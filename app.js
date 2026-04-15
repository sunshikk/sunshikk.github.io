/* global Telegram */

const API_BASE_URL = String(window.API_BASE_URL || "").trim().replace(/\/+$/, "");
const MUSIC_STORAGE_KEY = "bg_music_enabled";
const MUSIC_VOLUME_STORAGE_KEY = "bg_music_volume";
const DEFAULT_MUSIC_VOLUME = 0.35;
const TAB_MUSIC = {
  profile: "/sounds/music/profile_music.mp3",
  garage: "/sounds/music/garage_music.mp3",
  shop: "/sounds/music/shop_music.mp3",
  containers: "/sounds/music/profile_music.mp3",
};
const CONTAINER_OPEN_IMAGES = {
  rare: "/images/webapp/contopen_rare.png",
  epic: "/images/webapp/contopen_epic.png",
  ultrarare: "/images/webapp/contopen_ultrarare.png",
  legendary: "/images/webapp/contopen_legendary.png",
};
const REWARD_ITEM_IMAGES = {
  crystals: "/images/webapp/crystals.png",
  railgun: "/images/webapp/railgun.png",
  shaft: "/images/webapp/shaft.png",
  thunder: "/images/webapp/thunder.png",
  titan: "/images/webapp/titan.png",
};
const ITEM_IMAGE_OVERRIDES = { smoky: "smoky.png", hunter: "hunter.png" };

const state = {
  token: null,
  profile: null,
  shop: null,
  containersInfo: null,
  activeTab: "profile",
  garageCategory: "weapon",
  shopCategory: "weapon",
  selectedWeapon: "smoky",
  selectedHull: "hunter",
  viewerName: "player",
  bgMusic: null,
  prevMusic: null,
  bgMusicEnabled: false,
  bgMusicVolume: DEFAULT_MUSIC_VOLUME,
};

const NAMES = { smoky: "Смоки", railgun: "Рельса", shaft: "Шафт", thunder: "Гром", hunter: "Хантер", titan: "Титан" };
const DESCRIPTIONS = {
  smoky: "Базовая пушка со стабильным уроном.",
  railgun: "Дальнобойная пушка с высоким уроном.",
  shaft: "Снайперская пушка для точных попаданий.",
  thunder: "Мощный залп по площади.",
  hunter: "Универсальный корпус для баланса скорости и брони.",
  titan: "Тяжелый корпус с повышенной прочностью.",
};

function qs(id) { return document.getElementById(id); }
function withApiBase(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
function absUrl(path) {
  try {
    if (API_BASE_URL && path.startsWith("/")) return new URL(path, API_BASE_URL).toString();
    return new URL(path, window.location.origin).toString();
  } catch { return path; }
}
function withCacheBust(url) { return `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`; }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function clearError() { const p = qs("panelNotice"); if (!p) return; qs("notice").textContent = ""; p.style.display = "none"; }
function setError(text) { const p = qs("panelNotice"); if (!p) return; qs("notice").textContent = text; p.style.display = "block"; }
function prettyError(err) { return err instanceof TypeError ? "Сервер недоступен. Проверь подключение." : (err?.message || "Неизвестная ошибка."); }

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(withApiBase(path), { ...options, headers });
  if (!res.ok) {
    let msg = `${res.status}`;
    try { const body = await res.json(); msg = body.detail || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

function detectRewardRarity(result) {
  if (result.reward_type === "crystals") return "rare";
  if (result.reward_key === "railgun") return "legendary";
  if (result.reward_key === "shaft") return "ultrarare";
  if (result.reward_key === "thunder" || result.reward_key === "titan") return "epic";
  return "rare";
}

function getItemImage(key) {
  const imageName = ITEM_IMAGE_OVERRIDES[key] || `${key}.png`;
  return `/images/webapp/${imageName}`;
}

function updateMusicButton() {
  const btn = qs("musicToggleBtn");
  const label = qs("musicToggleLabel");
  const led = qs("musicLed");
  if (!btn || !label || !led) return;
  btn.classList.toggle("isOn", state.bgMusicEnabled);
  led.classList.toggle("isOn", state.bgMusicEnabled);
  label.textContent = state.bgMusicEnabled ? "Музыка вкл" : "Музыка выкл";
}

function saveMusic() {
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, state.bgMusicEnabled ? "1" : "0");
    localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, String(state.bgMusicVolume));
  } catch {}
}

function getTrack() { return absUrl(withApiBase(TAB_MUSIC[state.activeTab] || TAB_MUSIC.profile)); }

async function fadeVolume(target, durationMs = 300) {
  if (!state.bgMusic) return;
  const start = state.bgMusic.volume;
  const steps = 12;
  const stepTime = Math.max(15, Math.floor(durationMs / steps));
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    state.bgMusic.volume = start + (target - start) * t;
    await sleep(stepTime);
  }
}

async function applyMusic() {
  if (!state.bgMusic) return;
  if (!state.bgMusicEnabled) {
    await fadeVolume(0, 220);
    state.bgMusic.pause();
    updateMusicButton();
    return;
  }
  state.bgMusic.muted = false;
  state.bgMusic.volume = 0;
  try { await state.bgMusic.play(); } catch {}
  await fadeVolume(state.bgMusicVolume, 260);
  updateMusicButton();
}

async function switchTrack() {
  if (!state.bgMusic) return;
  const src = getTrack();
  if (state.bgMusic.src === src) return;
  if (!state.bgMusicEnabled) {
    state.bgMusic.src = src;
    state.bgMusic.load();
    return;
  }
  const oldAudio = state.bgMusic;
  const newAudio = new Audio(src);
  newAudio.loop = true;
  newAudio.preload = "none";
  newAudio.volume = 0;
  state.prevMusic = oldAudio;
  state.bgMusic = newAudio;
  try { await newAudio.play(); } catch {}
  const duration = 420;
  const steps = 14;
  const stepTime = Math.max(18, Math.floor(duration / steps));
  const oldStart = oldAudio.volume;
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    newAudio.volume = state.bgMusicVolume * t;
    oldAudio.volume = oldStart * (1 - t);
    await sleep(stepTime);
  }
  oldAudio.pause();
  oldAudio.currentTime = 0;
  state.prevMusic = null;
}

function initMusic() {
  const btn = qs("musicToggleBtn");
  const volume = qs("musicVolume");
  if (!btn || !volume) return;

  try {
    state.bgMusicEnabled = localStorage.getItem(MUSIC_STORAGE_KEY) === "1";
    const saved = Number(localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY));
    if (!Number.isNaN(saved)) state.bgMusicVolume = Math.max(0, Math.min(1, saved));
  } catch {}

  const audio = new Audio(getTrack());
  audio.loop = true;
  audio.preload = "none";
  audio.volume = state.bgMusicEnabled ? state.bgMusicVolume : 0;
  audio.addEventListener("error", () => {
    state.bgMusicEnabled = false;
    updateMusicButton();
    setError("Не удалось загрузить музыку.");
  });
  state.bgMusic = audio;

  volume.value = String(Math.round(state.bgMusicVolume * 100));
  updateMusicButton();

  btn.addEventListener("click", async () => {
    state.bgMusicEnabled = !state.bgMusicEnabled;
    saveMusic();
    await applyMusic();
  });
  volume.addEventListener("input", async () => {
    state.bgMusicVolume = Math.max(0, Math.min(1, Number(volume.value) / 100));
    saveMusic();
    if (state.bgMusicEnabled) await fadeVolume(state.bgMusicVolume, 140);
  });
}

async function initAuth() {
  const tg = window.Telegram?.WebApp;
  if (!tg) throw new Error("Открой мини-апп из Telegram.");
  tg.ready();
  tg.expand();
  state.viewerName = tg.initDataUnsafe?.user?.username || tg.initDataUnsafe?.user?.first_name || "player";
  if (!tg.initData) throw new Error("initData не получен. Открой WebApp кнопкой из бота.");
  const auth = await api("/api/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ initData: tg.initData }),
    headers: {},
  });
  state.token = auth.token;
}

function isUnlocked(key) { return key === "smoky" || key === "hunter" || Boolean(state.profile?.unlocks?.[key]); }
function currentGarageKey() { return state.garageCategory === "weapon" ? state.selectedWeapon : state.selectedHull; }
function garageList() { return state.garageCategory === "weapon" ? ["smoky", "railgun", "shaft", "thunder"] : ["hunter", "titan"]; }

function renderHud() {
  if (!state.profile) return;
  const logo = qs("logoImg");
  if (logo && !logo.src) logo.src = withCacheBust(absUrl("/images/webapp/logo.png"));
  qs("nickname").textContent = state.viewerName;
  qs("rankName").textContent = state.profile.rank.name;
  qs("pillCrystals").textContent = String(state.profile.crystals ?? 0);
  qs("pillContainers").textContent = String(state.profile.containers ?? 0);
  qs("rankImg").src = withCacheBust(absUrl(state.profile.rank_image_url));
  const required = Number(state.profile.rank?.exp_required || 0);
  const exp = Number(state.profile.experience || 0);
  qs("expValue").textContent = `${exp} / ${required}`;
  qs("expFill").style.width = `${required > 0 ? Math.max(0, Math.min(100, (exp / required) * 100)) : 0}%`;
}

function renderProfile() {
  if (!state.profile) return;
  const battles = Number(state.profile.battles || 0);
  const wins = Number(state.profile.wins || 0);
  const losses = Number(state.profile.losses || 0);
  const winrate = battles > 0 ? ((wins / battles) * 100).toFixed(1) : "0.0";
  qs("tankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
  qs("battlesValue").textContent = String(battles);
  qs("winsValue").textContent = String(wins);
  qs("lossesValue").textContent = String(losses);
  qs("expTotalValue").textContent = String(state.profile.experience || 0);
  qs("rankValue").textContent = String(state.profile.rank?.name || "-");
  qs("winrateValue").textContent = `${winrate}%`;
}

function renderGarage() {
  if (!state.profile) return;
  const key = currentGarageKey();
  qs("garageSelectedName").textContent = `${NAMES[key] || key}`.toUpperCase();
  qs("garageSelectedDesc").textContent = DESCRIPTIONS[key] || "Выберите предмет.";
  qs("garageTankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
  const rail = qs("garageItemsRail");
  rail.innerHTML = "";
  const equipped = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  for (const itemKey of garageList()) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "itemCard";
    if (!isUnlocked(itemKey)) card.classList.add("isLocked");
    if (itemKey === key) card.classList.add("isSelected");
    card.innerHTML = `
      <img src="${withCacheBust(absUrl(getItemImage(itemKey)))}" alt="${NAMES[itemKey] || itemKey}" />
      <div class="itemName">${NAMES[itemKey] || itemKey}</div>
      <div class="itemStatus">${!isUnlocked(itemKey) ? "Закрыто" : itemKey === equipped ? "Установлено" : "Доступно"}</div>
    `;
    card.onclick = () => {
      if (state.garageCategory === "weapon") state.selectedWeapon = itemKey;
      else state.selectedHull = itemKey;
      renderGarage();
    };
    rail.appendChild(card);
  }
}

function renderShop() {
  const list = qs("shopList");
  if (!list || !state.shop) return;
  list.innerHTML = "";
  const items = state.shop.items.filter((i) => i.category === state.shopCategory);
  for (const item of items) {
    const card = document.createElement("div");
    card.className = "shopCard";
    const buyButton = item.owned
      ? `<span class="shopOwned">Куплено</span>`
      : `<button class="equipBtn" data-buy="${item.key}" style="margin-top:0">Купить</button>`;
    card.innerHTML = `
      <img src="${withCacheBust(absUrl(item.image_url))}" alt="${item.name}">
      <div class="shopCardTitle">${item.name}</div>
      <div class="shopCardMeta">Категория: ${item.category === "weapon" ? "Пушка" : "Корпус"}</div>
      <div class="shopCardActions"><span class="shopPrice">${item.price} 💎</span>${buyButton}</div>
    `;
    list.appendChild(card);
  }
  list.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await api("/api/shop/buy", { method: "POST", body: JSON.stringify({ item: btn.getAttribute("data-buy") }) });
        await refreshAll();
        clearError();
      } catch (e) {
        setError(prettyError(e));
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function renderContainers() {
  if (!state.containersInfo) return;
  qs("containerImg").src = withCacheBust(absUrl(state.containersInfo.container_image_url));
}

async function showRewardModal(result) {
  const rarity = detectRewardRarity(result);
  const modal = qs("rewardModal");
  const card = qs("rewardCard");
  const box = qs("rewardContainerBox");
  const contImg = qs("rewardContainerImg");
  const dropImg = qs("rewardDropImg");
  const text = qs("rewardText");
  card.className = `rewardCard rarity-${rarity}`;
  box.classList.remove("shake");
  dropImg.classList.remove("show");
  contImg.src = withCacheBust(absUrl(CONTAINER_OPEN_IMAGES[rarity]));
  const rewardKey = result.reward_type === "crystals" ? "crystals" : result.reward_key;
  dropImg.src = withCacheBust(absUrl(REWARD_ITEM_IMAGES[rewardKey] || "/images/webapp/crystals.png"));
  modal.style.display = "flex";
  await sleep(30);
  box.classList.add("shake");
  const rewardText = result.reward_type === "unlock"
    ? `Получено: ${NAMES[result.reward_key] || result.reward_key}`
    : `Получено кристаллов: ${result.reward_amount}`;
  text.textContent = rewardText;
  await sleep(720);
  dropImg.classList.add("show");
}

function hideRewardModal() {
  const modal = qs("rewardModal");
  if (modal) modal.style.display = "none";
}

async function showTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll(".mainTab").forEach((b) => b.classList.toggle("isActive", b.dataset.tab === tab));
  ["profile", "garage", "shop", "containers"].forEach((key) => {
    const panel = qs(`panel${key[0].toUpperCase()}${key.slice(1)}`);
    if (panel) panel.style.display = key === tab ? "block" : "none";
  });
  await switchTrack();
}

async function refreshAll() {
  state.profile = await api("/api/profile/me");
  state.shop = await api("/api/shop/items");
  state.containersInfo = await api("/api/containers");
  state.selectedWeapon = state.profile.weapon;
  state.selectedHull = state.profile.hull;
  renderHud();
  renderProfile();
  renderGarage();
  renderShop();
  renderContainers();
}

function bindUI() {
  qs("tabs")?.addEventListener("click", async (e) => {
    const b = e.target.closest(".mainTab");
    if (!b) return;
    await showTab(b.dataset.tab);
  });
  qs("garageCategoryTabs")?.addEventListener("click", (e) => {
    const b = e.target.closest(".subTab");
    if (!b) return;
    state.garageCategory = b.dataset.cat;
    qs("garageCategoryTabs")?.querySelectorAll(".subTab").forEach((it) => it.classList.toggle("isActive", it.dataset.cat === state.garageCategory));
    renderGarage();
  });
  qs("shopCategory")?.addEventListener("click", (e) => {
    const b = e.target.closest(".shopCat");
    if (!b) return;
    state.shopCategory = b.dataset.cat;
    qs("shopCategory")?.querySelectorAll(".shopCat").forEach((it) => it.classList.toggle("isActive", it.dataset.cat === state.shopCategory));
    renderShop();
  });
  qs("equipBtn")?.addEventListener("click", async () => {
    const key = currentGarageKey();
    if (!isUnlocked(key)) { qs("garageHint").textContent = "Сначала разблокируй этот предмет."; return; }
    const weapon = state.garageCategory === "weapon" ? key : state.selectedWeapon;
    const hull = state.garageCategory === "hull" ? key : state.selectedHull;
    try {
      await api("/api/garage/set_tank", { method: "POST", body: JSON.stringify({ weapon, hull }) });
      qs("garageHint").textContent = "Установлено.";
      await refreshAll();
      clearError();
    } catch (e) {
      qs("garageHint").textContent = `Ошибка: ${prettyError(e)}`;
      setError(prettyError(e));
    }
  });
  qs("openContainerBtn")?.addEventListener("click", async () => {
    const btn = qs("openContainerBtn");
    btn.disabled = true;
    try {
      const result = await api("/api/containers/open", { method: "POST" });
      await showRewardModal(result);
      await refreshAll();
      clearError();
    } catch (e) {
      setError(prettyError(e));
      qs("containerResult").textContent = prettyError(e);
    } finally {
      btn.disabled = false;
    }
  });
  qs("refreshBtn")?.addEventListener("click", async () => {
    try { await refreshAll(); clearError(); } catch (e) { setError(prettyError(e)); }
  });
  qs("rewardCloseBtn")?.addEventListener("click", hideRewardModal);
  qs("rewardModal")?.addEventListener("click", (e) => { if (e.target === qs("rewardModal")) hideRewardModal(); });
}

async function main() {
  initMusic();
  bindUI();
  await showTab("profile");
  try {
    await initAuth();
    await refreshAll();
    clearError();
    await switchTrack();
    if (state.bgMusicEnabled) await applyMusic();
  } catch (e) {
    setError(prettyError(e));
  }
}

main();
