/* global Telegram */

const API_BASE_URL = String(window.API_BASE_URL || "").trim().replace(/\/+$/, "");
const MUSIC_STORAGE_KEY = "bg_music_enabled";
const MUSIC_VOLUME_STORAGE_KEY = "bg_music_volume";
const DEFAULT_MUSIC_VOLUME = 0.35;

const TAB_MUSIC = {
  garage: "/sounds/music/garage_music.mp3",
  shop: "/sounds/music/shop_music.mp3",
  profile: "/sounds/music/profile_music.mp3",
  containers: "/sounds/music/profile_music.mp3",
};

function qs(id) {
  return document.getElementById(id);
}

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
  } catch {
    return path;
  }
}

function withCacheBust(url) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
}

const NAMES = {
  smoky: "Смоки",
  railgun: "Рельса",
  shaft: "Шафт",
  thunder: "Гром",
  hunter: "Хантер",
  titan: "Титан",
};

const DESCRIPTIONS = {
  smoky: "Базовая пушка со стабильным уроном.",
  railgun: "Дальнобойная пушка с высоким уроном.",
  shaft: "Снайперская пушка для точных попаданий.",
  thunder: "Мощный залп по площади.",
  hunter: "Универсальный корпус для баланса скорости и брони.",
  titan: "Тяжелый корпус с повышенной прочностью.",
};

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
  bgMusicEnabled: false,
  bgMusicVolume: DEFAULT_MUSIC_VOLUME,
};

function clearError() {
  const p = qs("panelNotice");
  if (!p) return;
  qs("notice").textContent = "";
  p.style.display = "none";
}

function setError(text) {
  const p = qs("panelNotice");
  if (!p) return;
  qs("notice").textContent = text;
  p.style.display = "block";
}

function humanizeError(detail, status) {
  const d = String(detail || "").trim().toLowerCase();
  if (status === 401) return "Сессия истекла. Открой WebApp заново из бота.";
  if (d === "weapon locked") return "Эта пушка еще не открыта.";
  if (d === "hull locked") return "Этот корпус еще не открыт.";
  if (d === "not enough crystals") return "Не хватает кристаллов.";
  if (d === "already owned") return "Уже куплено.";
  if (d === "no containers") return "Нет контейнеров.";
  return detail || `Ошибка ${status}`;
}

function prettyError(err) {
  if (err instanceof TypeError) return "Сервер недоступен. Проверь подключение.";
  return err?.message || "Неизвестная ошибка.";
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(withApiBase(path), { ...options, headers });
  if (!res.ok) {
    let msg = `${res.status}`;
    try {
      const body = await res.json();
      msg = body.detail || msg;
    } catch {}
    throw new Error(humanizeError(msg, res.status));
  }
  return res.json();
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

function saveMusicSettings() {
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, state.bgMusicEnabled ? "1" : "0");
    localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, String(state.bgMusicVolume));
  } catch {}
}

function getCurrentTabMusicUrl() {
  const rel = TAB_MUSIC[state.activeTab] || TAB_MUSIC.profile;
  return absUrl(withApiBase(rel));
}

async function applyMusicState() {
  if (!state.bgMusic) return;
  state.bgMusic.volume = state.bgMusicVolume;
  state.bgMusic.muted = !state.bgMusicEnabled;
  if (!state.bgMusicEnabled) {
    state.bgMusic.pause();
    updateMusicButton();
    return;
  }
  try {
    await state.bgMusic.play();
  } catch {}
  updateMusicButton();
}

async function switchTrackForTab() {
  if (!state.bgMusic) return;
  const nextSrc = getCurrentTabMusicUrl();
  if (state.bgMusic.src === nextSrc) return;
  state.bgMusic.src = nextSrc;
  state.bgMusic.load();
  await applyMusicState();
}

function initMusic() {
  const btn = qs("musicToggleBtn");
  const volume = qs("musicVolume");
  if (!btn || !volume) return;

  try {
    const savedEnabled = localStorage.getItem(MUSIC_STORAGE_KEY);
    const savedVolume = Number(localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY));
    state.bgMusicEnabled = savedEnabled === "1";
    if (!Number.isNaN(savedVolume)) state.bgMusicVolume = Math.max(0, Math.min(1, savedVolume));
  } catch {
    state.bgMusicEnabled = false;
    state.bgMusicVolume = DEFAULT_MUSIC_VOLUME;
  }

  const audio = new Audio(getCurrentTabMusicUrl());
  audio.loop = true;
  audio.preload = "none";
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
    saveMusicSettings();
    await applyMusicState();
  });

  volume.addEventListener("input", async () => {
    state.bgMusicVolume = Math.max(0, Math.min(1, Number(volume.value) / 100));
    saveMusicSettings();
    await applyMusicState();
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

function isUnlocked(key) {
  if (!state.profile) return false;
  if (key === "smoky" || key === "hunter") return true;
  return Boolean(state.profile.unlocks?.[key]);
}

function currentGarageKey() {
  return state.garageCategory === "weapon" ? state.selectedWeapon : state.selectedHull;
}

function renderHud() {
  if (!state.profile) return;
  qs("nickname").textContent = state.viewerName;
  qs("rankName").textContent = state.profile.rank.name;
  qs("pillCrystals").textContent = String(state.profile.crystals ?? 0);
  qs("pillContainers").textContent = String(state.profile.containers ?? 0);
  qs("rankImg").src = withCacheBust(absUrl(state.profile.rank_image_url));
  const required = Number(state.profile.rank?.exp_required || 0);
  const exp = Number(state.profile.experience || 0);
  qs("expValue").textContent = `${exp} / ${required}`;
  const percent = required > 0 ? Math.max(0, Math.min(100, (exp / required) * 100)) : 0;
  qs("expFill").style.width = `${percent}%`;
}

function renderProfileTab() {
  if (!state.profile) return;
  qs("battlesValue").textContent = String(state.profile.battles);
  qs("wlValue").textContent = `${state.profile.wins} / ${state.profile.losses}`;
  qs("tankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
}

function garageList() {
  return state.garageCategory === "weapon" ? ["smoky", "railgun", "shaft", "thunder"] : ["hunter", "titan"];
}

function itemImage(key) {
  return `/images/webapp/${key}.png`;
}

function renderGarageStage() {
  if (!state.profile) return;
  const key = currentGarageKey();
  qs("garageSelectedName").textContent = `${NAMES[key] || key}`.toUpperCase();
  qs("garageSelectedDesc").textContent = DESCRIPTIONS[key] || "Выберите предмет.";
  qs("garageTankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
}

function renderGarageRail() {
  const rail = qs("garageItemsRail");
  if (!rail || !state.profile) return;
  rail.innerHTML = "";
  const equipped = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  for (const key of garageList()) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "itemCard";
    if (!isUnlocked(key)) card.classList.add("isLocked");
    if (key === currentGarageKey()) card.classList.add("isSelected");
    card.innerHTML = `
      <img src="${withCacheBust(absUrl(itemImage(key)))}" alt="${NAMES[key] || key}" />
      <div class="itemName">${NAMES[key] || key}</div>
      <div class="itemStatus">${!isUnlocked(key) ? "Закрыто" : key === equipped ? "Установлено" : "Доступно"}</div>
    `;
    card.onclick = () => {
      if (state.garageCategory === "weapon") state.selectedWeapon = key;
      else state.selectedHull = key;
      renderGarage();
    };
    rail.appendChild(card);
  }
}

function renderGarage() {
  renderGarageStage();
  renderGarageRail();
}

function renderShop() {
  const list = qs("shopList");
  if (!list) return;
  list.innerHTML = "";
  if (!state.shop) return;
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
      <div class="shopCardActions">
        <span class="shopPrice">${item.price} 💎</span>
        ${buyButton}
      </div>
    `;
    list.appendChild(card);
  }
  list.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await api("/api/shop/buy", {
          method: "POST",
          body: JSON.stringify({ item: btn.getAttribute("data-buy") }),
        });
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

async function showTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll(".mainTab").forEach((b) => b.classList.toggle("isActive", b.dataset.tab === tab));
  const map = ["garage", "shop", "containers", "profile"];
  for (const key of map) {
    const panel = qs(`panel${key[0].toUpperCase()}${key.slice(1)}`);
    if (panel) panel.style.display = key === tab ? "block" : "none";
  }
  await switchTrackForTab();
}

async function refreshAll() {
  state.profile = await api("/api/profile/me");
  state.shop = await api("/api/shop/items");
  state.containersInfo = await api("/api/containers");
  state.selectedWeapon = state.profile.weapon;
  state.selectedHull = state.profile.hull;
  renderHud();
  renderProfileTab();
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
    qs("garageCategoryTabs")?.querySelectorAll(".subTab").forEach((it) => {
      it.classList.toggle("isActive", it.dataset.cat === state.garageCategory);
    });
    renderGarage();
  });

  qs("shopCategory")?.addEventListener("click", (e) => {
    const b = e.target.closest(".shopCat");
    if (!b) return;
    state.shopCategory = b.dataset.cat;
    qs("shopCategory")?.querySelectorAll(".shopCat").forEach((it) => {
      it.classList.toggle("isActive", it.dataset.cat === state.shopCategory);
    });
    renderShop();
  });

  qs("equipBtn")?.addEventListener("click", async () => {
    const key = currentGarageKey();
    if (!isUnlocked(key)) {
      qs("garageHint").textContent = "Сначала разблокируй этот предмет.";
      return;
    }
    const weapon = state.garageCategory === "weapon" ? key : state.selectedWeapon;
    const hull = state.garageCategory === "hull" ? key : state.selectedHull;
    try {
      await api("/api/garage/set_tank", {
        method: "POST",
        body: JSON.stringify({ weapon, hull }),
      });
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
    qs("containerResult").textContent = "";
    try {
      const result = await api("/api/containers/open", { method: "POST" });
      qs("containerResult").textContent =
        result.reward_type === "unlock"
          ? `Получено: ${NAMES[result.reward_key] || result.reward_key}`
          : `Получено кристаллов: ${result.reward_amount}`;
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
    try {
      await refreshAll();
      clearError();
    } catch (e) {
      setError(prettyError(e));
    }
  });
}

async function main() {
  initMusic();
  bindUI();
  await showTab("profile");
  try {
    await initAuth();
    await refreshAll();
    clearError();
    await switchTrackForTab();
    await applyMusicState();
  } catch (e) {
    setError(prettyError(e));
  }
}

main();
/* global Telegram */

const API_BASE_URL = String(window.API_BASE_URL || "").trim().replace(/\/+$/, "");
const MUSIC_STORAGE_KEY = "bg_music_enabled";
const MUSIC_VOLUME_STORAGE_KEY = "bg_music_volume";
const DEFAULT_MUSIC_VOLUME = 0.35;

const TAB_MUSIC = {
  garage: "/sounds/music/garage_music.mp3",
  shop: "/sounds/music/shop_music.mp3",
  profile: "/sounds/music/profile_music.mp3",
  containers: "/sounds/music/profile_music.mp3",
};

function qs(id) {
  return document.getElementById(id);
}

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
  } catch {
    return path;
  }
}

function withCacheBust(url) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
}

const NAMES = {
  smoky: "Смоки",
  railgun: "Рельса",
  shaft: "Шафт",
  thunder: "Гром",
  hunter: "Хантер",
  titan: "Титан",
};

const DESCRIPTIONS = {
  smoky: "Базовая пушка со стабильным уроном.",
  railgun: "Дальнобойная пушка с высоким уроном.",
  shaft: "Снайперская пушка для точных попаданий.",
  thunder: "Мощный залп по площади.",
  hunter: "Универсальный корпус для баланса скорости и брони.",
  titan: "Тяжелый корпус с повышенной прочностью.",
};

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
  bgMusicEnabled: false,
  bgMusicVolume: DEFAULT_MUSIC_VOLUME,
};

function clearError() {
  const p = qs("panelNotice");
  if (!p) return;
  qs("notice").textContent = "";
  p.style.display = "none";
}

function setError(text) {
  const p = qs("panelNotice");
  if (!p) return;
  qs("notice").textContent = text;
  p.style.display = "block";
}

function humanizeError(detail, status) {
  const d = String(detail || "").trim().toLowerCase();
  if (status === 401) return "Сессия истекла. Открой WebApp заново из бота.";
  if (d === "weapon locked") return "Эта пушка еще не открыта.";
  if (d === "hull locked") return "Этот корпус еще не открыт.";
  if (d === "not enough crystals") return "Не хватает кристаллов.";
  if (d === "already owned") return "Уже куплено.";
  if (d === "no containers") return "Нет контейнеров.";
  return detail || `Ошибка ${status}`;
}

function prettyError(err) {
  if (err instanceof TypeError) return "Сервер недоступен. Проверь подключение.";
  return err?.message || "Неизвестная ошибка.";
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(withApiBase(path), { ...options, headers });
  if (!res.ok) {
    let msg = `${res.status}`;
    try {
      const body = await res.json();
      msg = body.detail || msg;
    } catch {
      // ignore
    }
    throw new Error(humanizeError(msg, res.status));
  }
  return res.json();
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

function saveMusicSettings() {
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, state.bgMusicEnabled ? "1" : "0");
    localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, String(state.bgMusicVolume));
  } catch {
    // ignore storage errors
  }
}

function getCurrentTabMusicUrl() {
  const rel = TAB_MUSIC[state.activeTab] || TAB_MUSIC.profile;
  return absUrl(withApiBase(rel));
}

async function applyMusicState() {
  if (!state.bgMusic) return;
  state.bgMusic.volume = state.bgMusicVolume;
  state.bgMusic.muted = !state.bgMusicEnabled;
  if (!state.bgMusicEnabled) {
    state.bgMusic.pause();
    updateMusicButton();
    return;
  }
  try {
    await state.bgMusic.play();
  } catch {
    // autoplay block
  }
  updateMusicButton();
}

async function switchTrackForTab() {
  if (!state.bgMusic) return;
  const nextSrc = getCurrentTabMusicUrl();
  if (state.bgMusic.src === nextSrc) return;
  state.bgMusic.src = nextSrc;
  state.bgMusic.load();
  await applyMusicState();
}

function initMusic() {
  const btn = qs("musicToggleBtn");
  const volume = qs("musicVolume");
  if (!btn || !volume) return;

  try {
    const savedEnabled = localStorage.getItem(MUSIC_STORAGE_KEY);
    const savedVolume = Number(localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY));
    state.bgMusicEnabled = savedEnabled === "1";
    if (!Number.isNaN(savedVolume)) state.bgMusicVolume = Math.max(0, Math.min(1, savedVolume));
  } catch {
    state.bgMusicEnabled = false;
    state.bgMusicVolume = DEFAULT_MUSIC_VOLUME;
  }

  const audio = new Audio(getCurrentTabMusicUrl());
  audio.loop = true;
  audio.preload = "none";
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
    saveMusicSettings();
    await applyMusicState();
  });

  volume.addEventListener("input", async () => {
    state.bgMusicVolume = Math.max(0, Math.min(1, Number(volume.value) / 100));
    saveMusicSettings();
    await applyMusicState();
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

function isUnlocked(key) {
  if (!state.profile) return false;
  if (key === "smoky" || key === "hunter") return true;
  return Boolean(state.profile.unlocks?.[key]);
}

function currentGarageKey() {
  return state.garageCategory === "weapon" ? state.selectedWeapon : state.selectedHull;
}

function renderHud() {
  if (!state.profile) return;
  qs("nickname").textContent = state.viewerName;
  qs("rankName").textContent = state.profile.rank.name;
  qs("pillCrystals").textContent = String(state.profile.crystals ?? 0);
  qs("pillContainers").textContent = String(state.profile.containers ?? 0);
  qs("rankImg").src = withCacheBust(absUrl(state.profile.rank_image_url));
  const required = Number(state.profile.rank?.exp_required || 0);
  const exp = Number(state.profile.experience || 0);
  qs("expValue").textContent = `${exp} / ${required}`;
  const percent = required > 0 ? Math.max(0, Math.min(100, (exp / required) * 100)) : 0;
  qs("expFill").style.width = `${percent}%`;
}

function renderProfileTab() {
  if (!state.profile) return;
  qs("battlesValue").textContent = String(state.profile.battles);
  qs("wlValue").textContent = `${state.profile.wins} / ${state.profile.losses}`;
  qs("tankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
}

function garageList() {
  if (state.garageCategory === "weapon") return ["smoky", "railgun", "shaft", "thunder"];
  return ["hunter", "titan"];
}

function itemImage(key) {
  return `/images/webapp/${key}.png`;
}

function renderGarageStage() {
  if (!state.profile) return;
  const key = currentGarageKey();
  qs("garageSelectedName").textContent = `${NAMES[key] || key}`.toUpperCase();
  qs("garageSelectedDesc").textContent = DESCRIPTIONS[key] || "Выберите предмет.";
  qs("garageTankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
}

function renderGarageRail() {
  const rail = qs("garageItemsRail");
  if (!rail || !state.profile) return;
  rail.innerHTML = "";
  const equipped = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  for (const key of garageList()) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "itemCard";
    if (!isUnlocked(key)) card.classList.add("isLocked");
    if (key === currentGarageKey()) card.classList.add("isSelected");
    card.innerHTML = `
      <img src="${withCacheBust(absUrl(itemImage(key)))}" alt="${NAMES[key] || key}" />
      <div class="itemName">${NAMES[key] || key}</div>
      <div class="itemStatus">${!isUnlocked(key) ? "Закрыто" : key === equipped ? "Установлено" : "Доступно"}</div>
    `;
    card.onclick = () => {
      if (state.garageCategory === "weapon") state.selectedWeapon = key;
      else state.selectedHull = key;
      renderGarage();
    };
    rail.appendChild(card);
  }
}

function renderGarage() {
  renderGarageStage();
  renderGarageRail();
}

function renderShop() {
  const list = qs("shopList");
  if (!list) return;
  list.innerHTML = "";
  if (!state.shop) return;
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
      <div class="shopCardActions">
        <span class="shopPrice">${item.price} 💎</span>
        ${buyButton}
      </div>
    `;
    list.appendChild(card);
  }
  list.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await api("/api/shop/buy", {
          method: "POST",
          body: JSON.stringify({ item: btn.getAttribute("data-buy") }),
        });
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

async function showTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll(".mainTab").forEach((b) => b.classList.toggle("isActive", b.dataset.tab === tab));
  const map = ["garage", "shop", "containers", "profile"];
  for (const key of map) {
    const panel = qs(`panel${key[0].toUpperCase()}${key.slice(1)}`);
    if (panel) panel.style.display = key === tab ? "block" : "none";
  }
  await switchTrackForTab();
}

async function refreshAll() {
  state.profile = await api("/api/profile/me");
  state.shop = await api("/api/shop/items");
  state.containersInfo = await api("/api/containers");
  state.selectedWeapon = state.profile.weapon;
  state.selectedHull = state.profile.hull;
  renderHud();
  renderProfileTab();
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
    qs("garageCategoryTabs")?.querySelectorAll(".subTab").forEach((it) => {
      it.classList.toggle("isActive", it.dataset.cat === state.garageCategory);
    });
    renderGarage();
  });

  qs("shopCategory")?.addEventListener("click", (e) => {
    const b = e.target.closest(".shopCat");
    if (!b) return;
    state.shopCategory = b.dataset.cat;
    qs("shopCategory")?.querySelectorAll(".shopCat").forEach((it) => {
      it.classList.toggle("isActive", it.dataset.cat === state.shopCategory);
    });
    renderShop();
  });

  qs("equipBtn")?.addEventListener("click", async () => {
    const key = currentGarageKey();
    if (!isUnlocked(key)) {
      qs("garageHint").textContent = "Сначала разблокируй этот предмет.";
      return;
    }
    const weapon = state.garageCategory === "weapon" ? key : state.selectedWeapon;
    const hull = state.garageCategory === "hull" ? key : state.selectedHull;
    try {
      await api("/api/garage/set_tank", {
        method: "POST",
        body: JSON.stringify({ weapon, hull }),
      });
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
    qs("containerResult").textContent = "";
    try {
      const result = await api("/api/containers/open", { method: "POST" });
      if (result.reward_type === "unlock") {
        qs("containerResult").textContent = `Получено: ${NAMES[result.reward_key] || result.reward_key}`;
      } else {
        qs("containerResult").textContent = `Получено кристаллов: ${result.reward_amount}`;
      }
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
    try {
      await refreshAll();
      clearError();
    } catch (e) {
      setError(prettyError(e));
    }
  });
}

async function main() {
  initMusic();
  bindUI();
  await showTab("profile");
  try {
    await initAuth();
    await refreshAll();
    clearError();
    await switchTrackForTab();
    await applyMusicState();
  } catch (e) {
    setError(prettyError(e));
  }
}

main();
/* global Telegram */

const API_BASE_URL = String(window.API_BASE_URL || "").trim().replace(/\/+$/, "");

function qs(id) {
  return document.getElementById(id);
}

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
  } catch {
    return path;
  }
}

function withCacheBust(url) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
}

const NAMES = {
  smoky: "Смоки",
  railgun: "Рельса",
  shaft: "Шафт",
  thunder: "Гром",
  hunter: "Хантер",
  titan: "Титан",
};

const DESCRIPTIONS = {
  smoky: "Базовая пушка со стабильным уроном.",
  railgun: "Дальнобойная пушка с высоким уроном.",
  shaft: "Снайперская пушка для точных попаданий.",
  thunder: "Мощный залп по площади.",
  hunter: "Универсальный корпус для баланса скорости и брони.",
  titan: "Тяжелый корпус с повышенной прочностью.",
};

const state = {
  token: null,
  profile: null,
  shop: null,
  containersInfo: null,
  activeTab: "garage",
  garageCategory: "weapon",
  shopCategory: "weapon",
  selectedWeapon: "smoky",
  selectedHull: "hunter",
  viewerName: "player",
};

function clearError() {
  const p = qs("panelNotice");
  qs("notice").textContent = "";
  p.style.display = "none";
}

function setError(text) {
  qs("notice").textContent = text;
  qs("panelNotice").style.display = "block";
}

function humanizeError(detail, status) {
  const d = String(detail || "").trim().toLowerCase();
  if (status === 401) return "Сессия истекла. Открой WebApp заново из бота.";
  if (d === "weapon locked") return "Эта пушка еще не открыта.";
  if (d === "hull locked") return "Этот корпус еще не открыт.";
  if (d === "not enough crystals") return "Не хватает кристаллов.";
  if (d === "already owned") return "Уже куплено.";
  if (d === "no containers") return "Нет контейнеров.";
  return detail || `Ошибка ${status}`;
}

function prettyError(err) {
  if (err instanceof TypeError) return "Сервер недоступен. Проверь подключение.";
  return err?.message || "Неизвестная ошибка.";
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(withApiBase(path), { ...options, headers });
  if (!res.ok) {
    let msg = `${res.status}`;
    try {
      const body = await res.json();
      msg = body.detail || msg;
    } catch {
      // ignore
    }
    throw new Error(humanizeError(msg, res.status));
  }
  return res.json();
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

function isUnlocked(key) {
  if (!state.profile) return false;
  if (key === "smoky" || key === "hunter") return true;
  return Boolean(state.profile.unlocks?.[key]);
}

function currentGarageKey() {
  return state.garageCategory === "weapon" ? state.selectedWeapon : state.selectedHull;
}

function renderHud() {
  if (!state.profile) return;
  qs("nickname").textContent = state.viewerName;
  qs("rankName").textContent = state.profile.rank.name;
  qs("pillCrystals").textContent = String(state.profile.crystals ?? 0);
  qs("pillContainers").textContent = String(state.profile.containers ?? 0);
  qs("rankImg").src = withCacheBust(absUrl(state.profile.rank_image_url));
  const required = Number(state.profile.rank?.exp_required || 0);
  const exp = Number(state.profile.experience || 0);
  qs("expValue").textContent = `${exp} / ${required}`;
  const percent = required > 0 ? Math.max(0, Math.min(100, (exp / required) * 100)) : 0;
  qs("expFill").style.width = `${percent}%`;
}

function renderProfileTab() {
  if (!state.profile) return;
  qs("battlesValue").textContent = String(state.profile.battles);
  qs("wlValue").textContent = `${state.profile.wins} / ${state.profile.losses}`;
  qs("tankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
}

function garageList() {
  if (state.garageCategory === "weapon") {
    return ["smoky", "railgun", "shaft", "thunder"];
  }
  return ["hunter", "titan"];
}

function itemImage(key) {
  return `/images/webapp/${key}.png`;
}

function renderGarageStage() {
  if (!state.profile) return;
  const key = currentGarageKey();
  qs("garageSelectedName").textContent = `${NAMES[key] || key}`.toUpperCase();
  qs("garageSelectedDesc").textContent = DESCRIPTIONS[key] || "Выберите предмет.";
  qs("garageTankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
}

function renderGarageRail() {
  const rail = qs("garageItemsRail");
  rail.innerHTML = "";
  const equipped = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  for (const key of garageList()) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "itemCard";
    if (!isUnlocked(key)) card.classList.add("isLocked");
    if (key === currentGarageKey()) card.classList.add("isSelected");
    card.innerHTML = `
      <img src="${withCacheBust(absUrl(itemImage(key)))}" alt="${NAMES[key] || key}" />
      <div class="itemName">${NAMES[key] || key}</div>
      <div class="itemStatus">${!isUnlocked(key) ? "Закрыто" : key === equipped ? "Установлено" : "Доступно"}</div>
    `;
    card.onclick = () => {
      if (state.garageCategory === "weapon") state.selectedWeapon = key;
      else state.selectedHull = key;
      renderGarage();
    };
    rail.appendChild(card);
  }
}

function renderGarage() {
  renderGarageStage();
  renderGarageRail();
}

function renderShop() {
  const list = qs("shopList");
  list.innerHTML = "";
  if (!state.shop) return;
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
      <div class="shopCardActions">
        <span class="shopPrice">${item.price} 💎</span>
        ${buyButton}
      </div>
    `;
    list.appendChild(card);
  }
  list.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await api("/api/shop/buy", {
          method: "POST",
          body: JSON.stringify({ item: btn.getAttribute("data-buy") }),
        });
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

function showTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll(".mainTab").forEach((b) => b.classList.toggle("isActive", b.dataset.tab === tab));
  const map = ["garage", "shop", "containers", "profile"];
  for (const key of map) {
    qs(`panel${key[0].toUpperCase()}${key.slice(1)}`).style.display = key === tab ? "block" : "none";
  }
}

async function refreshAll() {
  state.profile = await api("/api/profile/me");
  state.shop = await api("/api/shop/items");
  state.containersInfo = await api("/api/containers");
  state.selectedWeapon = state.profile.weapon;
  state.selectedHull = state.profile.hull;
  renderHud();
  renderProfileTab();
  renderGarage();
  renderShop();
  renderContainers();
}

function bindUI() {
  qs("tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".mainTab");
    if (!b) return;
    showTab(b.dataset.tab);
  });

  qs("garageCategoryTabs").addEventListener("click", (e) => {
    const b = e.target.closest(".subTab");
    if (!b) return;
    state.garageCategory = b.dataset.cat;
    qs("garageCategoryTabs").querySelectorAll(".subTab").forEach((it) => {
      it.classList.toggle("isActive", it.dataset.cat === state.garageCategory);
    });
    renderGarage();
  });

  qs("shopCategory").addEventListener("click", (e) => {
    const b = e.target.closest(".shopCat");
    if (!b) return;
    state.shopCategory = b.dataset.cat;
    qs("shopCategory").querySelectorAll(".shopCat").forEach((it) => {
      it.classList.toggle("isActive", it.dataset.cat === state.shopCategory);
    });
    renderShop();
  });

  qs("equipBtn").addEventListener("click", async () => {
    const key = currentGarageKey();
    if (!isUnlocked(key)) {
      qs("garageHint").textContent = "Сначала разблокируй этот предмет.";
      return;
    }
    const weapon = state.garageCategory === "weapon" ? key : state.selectedWeapon;
    const hull = state.garageCategory === "hull" ? key : state.selectedHull;
    try {
      await api("/api/garage/set_tank", {
        method: "POST",
        body: JSON.stringify({ weapon, hull }),
      });
      qs("garageHint").textContent = "Установлено.";
      await refreshAll();
      clearError();
    } catch (e) {
      qs("garageHint").textContent = `Ошибка: ${prettyError(e)}`;
      setError(prettyError(e));
    }
  });

  qs("openContainerBtn").addEventListener("click", async () => {
    const btn = qs("openContainerBtn");
    btn.disabled = true;
    qs("containerResult").textContent = "";
    try {
      const result = await api("/api/containers/open", { method: "POST" });
      if (result.reward_type === "unlock") {
        qs("containerResult").textContent = `Получено: ${NAMES[result.reward_key] || result.reward_key}`;
      } else {
        qs("containerResult").textContent = `Получено кристаллов: ${result.reward_amount}`;
      }
      await refreshAll();
      clearError();
    } catch (e) {
      setError(prettyError(e));
      qs("containerResult").textContent = prettyError(e);
    } finally {
      btn.disabled = false;
    }
  });

  qs("refreshBtn").addEventListener("click", async () => {
    try {
      await refreshAll();
      clearError();
    } catch (e) {
      setError(prettyError(e));
    }
  });
}

async function main() {
  showTab("garage");
  bindUI();
  try {
    await initAuth();
    await refreshAll();
    clearError();
  } catch (e) {
    setError(prettyError(e));
  }
}

main();

/* global Telegram */

const API_BASE_URL = String(window.API_BASE_URL || "").trim().replace(/\/+$/, "");
const MUSIC_STORAGE_KEY = "bg_music_enabled";
const MUSIC_VOLUME_STORAGE_KEY = "bg_music_volume";
const DEFAULT_MUSIC_VOLUME = 0.35;
const FALLBACK_MUSIC_URL = "/sounds/bg.mp3";
const DEFAULT_MUSIC_API_PATH = "/api/music/current";

function qs(id) {
  return document.getElementById(id);
}

function on(id, event, handler) {
  const el = qs(id);
  if (!el) return;
  el.addEventListener(event, handler);
}

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
  } catch {
    return path;
  }
}

function withCacheBust(url) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
}

const NAMES = {
  smoky: "Смоки",
  railgun: "Рельса",
  shaft: "Шафт",
  thunder: "Гром",
  hunter: "Хантер",
  titan: "Титан",
};

const DESCRIPTIONS = {
  smoky: "Базовая пушка со стабильным уроном.",
  railgun: "Дальнобойная пушка с высоким уроном.",
  shaft: "Снайперская пушка для точных попаданий.",
  thunder: "Мощный залп по площади.",
  hunter: "Универсальный корпус для баланса скорости и брони.",
  titan: "Тяжелый корпус с повышенной прочностью.",
};

const state = {
  token: null,
  profile: null,
  shop: null,
  containersInfo: null,
  activeTab: "garage",
  garageCategory: "weapon",
  shopCategory: "weapon",
  selectedWeapon: "smoky",
  selectedHull: "hunter",
  viewerName: "player",
  bgMusic: null,
  bgMusicEnabled: false,
  bgMusicVolume: DEFAULT_MUSIC_VOLUME,
};

function getMusicUrl() {
  const fromWindow = String(window.BG_MUSIC_URL || "").trim();
  const fromQuery = (() => {
    try {
      return String(new URLSearchParams(window.location.search || "").get("music") || "").trim();
    } catch {
      return "";
    }
  })();
  return fromQuery || fromWindow || FALLBACK_MUSIC_URL;
}

function updateMusicButton() {
  const btn = qs("musicToggleBtn");
  const label = qs("musicToggleLabel");
  const led = qs("musicLed");
  if (!btn || !label || !led) return;
  btn.classList.toggle("isOn", state.bgMusicEnabled);
  label.textContent = state.bgMusicEnabled ? "Музыка вкл" : "Музыка выкл";
  led.classList.toggle("isOn", state.bgMusicEnabled);
}

function saveMusicSettings() {
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, state.bgMusicEnabled ? "1" : "0");
    localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, String(state.bgMusicVolume));
  } catch {
    // ignore storage errors
  }
}

async function applyMusicState() {
  if (!state.bgMusic) return;
  state.bgMusic.volume = state.bgMusicVolume;
  state.bgMusic.muted = !state.bgMusicEnabled;
  if (!state.bgMusicEnabled) {
    state.bgMusic.pause();
    updateMusicButton();
    return;
  }
  try {
    await state.bgMusic.play();
  } catch {
    // Autoplay may be blocked until user interaction.
  }
  updateMusicButton();
}

function buildAudioFromUrl(url) {
  const audio = new Audio(absUrl(url));
  audio.loop = true;
  audio.preload = "none";
  audio.addEventListener("error", () => {
    state.bgMusicEnabled = false;
    updateMusicButton();
    qs("notice").textContent = "Не удалось загрузить музыку с API.";
    qs("panelNotice").style.display = "block";
  });
  state.bgMusic = audio;
}

async function loadMusicUrlFromApi() {
  const endpointFromWindow = String(window.BG_MUSIC_API || "").trim();
  const endpointFromQuery = (() => {
    try {
      return String(new URLSearchParams(window.location.search || "").get("musicApi") || "").trim();
    } catch {
      return "";
    }
  })();
  const endpoint = endpointFromQuery || endpointFromWindow || DEFAULT_MUSIC_API_PATH;

  try {
    const data = await api(endpoint, { method: "GET" });
    if (typeof data === "string" && data.trim()) return data.trim();
    if (data && typeof data === "object") {
      const candidate =
        data.url ||
        data.music_url ||
        data.track_url ||
        data.audio_url ||
        data.path;
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    }
  } catch {
    // fallback below
  }
  return getMusicUrl();
}

function initMusic() {
  const btn = qs("musicToggleBtn");
  const volume = qs("musicVolume");
  if (!btn || !volume) return;

  try {
    const savedEnabled = localStorage.getItem(MUSIC_STORAGE_KEY);
    const savedVolume = Number(localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY));
    state.bgMusicEnabled = savedEnabled === "1";
    if (!Number.isNaN(savedVolume)) {
      state.bgMusicVolume = Math.max(0, Math.min(1, savedVolume));
    }
  } catch {
    state.bgMusicEnabled = false;
    state.bgMusicVolume = DEFAULT_MUSIC_VOLUME;
  }

  volume.value = String(Math.round(state.bgMusicVolume * 100));
  updateMusicButton();

  btn.addEventListener("click", async () => {
    state.bgMusicEnabled = !state.bgMusicEnabled;
    saveMusicSettings();
    await applyMusicState();
  });

  volume.addEventListener("input", async () => {
    state.bgMusicVolume = Math.max(0, Math.min(1, Number(volume.value) / 100));
    saveMusicSettings();
    await applyMusicState();
  });
}

async function initMusicTrack() {
  const trackUrl = await loadMusicUrlFromApi();
  buildAudioFromUrl(trackUrl);
  await applyMusicState();
}

function clearError() {
  const p = qs("panelNotice");
  qs("notice").textContent = "";
  p.style.display = "none";
}

function setError(text) {
  qs("notice").textContent = text;
  qs("panelNotice").style.display = "block";
}

function humanizeError(detail, status) {
  const d = String(detail || "").trim().toLowerCase();
  if (status === 401) return "Сессия истекла. Открой WebApp заново из бота.";
  if (d === "weapon locked") return "Эта пушка еще не открыта.";
  if (d === "hull locked") return "Этот корпус еще не открыт.";
  if (d === "not enough crystals") return "Не хватает кристаллов.";
  if (d === "already owned") return "Уже куплено.";
  if (d === "no containers") return "Нет контейнеров.";
  return detail || `Ошибка ${status}`;
}

function prettyError(err) {
  if (err instanceof TypeError) return "Сервер недоступен. Проверь подключение.";
  return err?.message || "Неизвестная ошибка.";
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(withApiBase(path), { ...options, headers });
  if (!res.ok) {
    let msg = `${res.status}`;
    try {
      const body = await res.json();
      msg = body.detail || msg;
    } catch {
      // ignore
    }
    throw new Error(humanizeError(msg, res.status));
  }
  return res.json();
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

function isUnlocked(key) {
  if (!state.profile) return false;
  if (key === "smoky" || key === "hunter") return true;
  return Boolean(state.profile.unlocks?.[key]);
}

function currentGarageKey() {
  return state.garageCategory === "weapon" ? state.selectedWeapon : state.selectedHull;
}

function renderHud() {
  if (!state.profile) return;
  qs("nickname").textContent = state.viewerName;
  qs("rankName").textContent = state.profile.rank.name;
  qs("pillCrystals").textContent = String(state.profile.crystals ?? 0);
  qs("pillContainers").textContent = String(state.profile.containers ?? 0);
  qs("rankImg").src = withCacheBust(absUrl(state.profile.rank_image_url));
  const required = Number(state.profile.rank?.exp_required || 0);
  const exp = Number(state.profile.experience || 0);
  qs("expValue").textContent = `${exp} / ${required}`;
  const percent = required > 0 ? Math.max(0, Math.min(100, (exp / required) * 100)) : 0;
  qs("expFill").style.width = `${percent}%`;
}

function renderProfileTab() {
  if (!state.profile) return;
  qs("battlesValue").textContent = String(state.profile.battles);
  qs("wlValue").textContent = `${state.profile.wins} / ${state.profile.losses}`;
  qs("tankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
}

function garageList() {
  if (state.garageCategory === "weapon") {
    return ["smoky", "railgun", "shaft", "thunder"];
  }
  return ["hunter", "titan"];
}

function itemImage(key) {
  return `/images/webapp/${key}.png`;
}

function renderGarageStage() {
  if (!state.profile) return;
  const key = currentGarageKey();
  qs("garageSelectedName").textContent = `${NAMES[key] || key}`.toUpperCase();
  qs("garageSelectedDesc").textContent = DESCRIPTIONS[key] || "Выберите предмет.";
  qs("garageTankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
}

function renderGarageRail() {
  const rail = qs("garageItemsRail");
  rail.innerHTML = "";
  const equipped = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  for (const key of garageList()) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "itemCard";
    if (!isUnlocked(key)) card.classList.add("isLocked");
    if (key === currentGarageKey()) card.classList.add("isSelected");
    card.innerHTML = `
      <img src="${withCacheBust(absUrl(itemImage(key)))}" alt="${NAMES[key] || key}" />
      <div class="itemName">${NAMES[key] || key}</div>
      <div class="itemStatus">${!isUnlocked(key) ? "Закрыто" : key === equipped ? "Установлено" : "Доступно"}</div>
    `;
    card.onclick = () => {
      if (state.garageCategory === "weapon") state.selectedWeapon = key;
      else state.selectedHull = key;
      renderGarage();
    };
    rail.appendChild(card);
  }
}

function renderGarage() {
  renderGarageStage();
  renderGarageRail();
}

function renderShop() {
  const list = qs("shopList");
  list.innerHTML = "";
  if (!state.shop) return;
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
      <div class="shopCardActions">
        <span class="shopPrice">${item.price} 💎</span>
        ${buyButton}
      </div>
    `;
    list.appendChild(card);
  }
  list.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await api("/api/shop/buy", {
          method: "POST",
          body: JSON.stringify({ item: btn.getAttribute("data-buy") }),
        });
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

function showTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll(".mainTab").forEach((b) => b.classList.toggle("isActive", b.dataset.tab === tab));
  const map = ["garage", "shop", "containers", "profile"];
  for (const key of map) {
    qs(`panel${key[0].toUpperCase()}${key.slice(1)}`).style.display = key === tab ? "block" : "none";
  }
}

async function refreshAll() {
  state.profile = await api("/api/profile/me");
  state.shop = await api("/api/shop/items");
  state.containersInfo = await api("/api/containers");
  state.selectedWeapon = state.profile.weapon;
  state.selectedHull = state.profile.hull;
  renderHud();
  renderProfileTab();
  renderGarage();
  renderShop();
  renderContainers();
}

function bindUI() {
  on("tabs", "click", (e) => {
    const b = e.target.closest(".mainTab");
    if (!b) return;
    showTab(b.dataset.tab);
  });

  on("garageCategoryTabs", "click", (e) => {
    const b = e.target.closest(".subTab");
    if (!b) return;
    state.garageCategory = b.dataset.cat;
    const tabs = qs("garageCategoryTabs");
    if (!tabs) return;
    tabs.querySelectorAll(".subTab").forEach((it) => {
      it.classList.toggle("isActive", it.dataset.cat === state.garageCategory);
    });
    renderGarage();
  });

  on("shopCategory", "click", (e) => {
    const b = e.target.closest(".shopCat");
    if (!b) return;
    state.shopCategory = b.dataset.cat;
    const shop = qs("shopCategory");
    if (!shop) return;
    shop.querySelectorAll(".shopCat").forEach((it) => {
      it.classList.toggle("isActive", it.dataset.cat === state.shopCategory);
    });
    renderShop();
  });

  on("equipBtn", "click", async () => {
    const key = currentGarageKey();
    if (!isUnlocked(key)) {
      qs("garageHint").textContent = "Сначала разблокируй этот предмет.";
      return;
    }
    const weapon = state.garageCategory === "weapon" ? key : state.selectedWeapon;
    const hull = state.garageCategory === "hull" ? key : state.selectedHull;
    try {
      await api("/api/garage/set_tank", {
        method: "POST",
        body: JSON.stringify({ weapon, hull }),
      });
      qs("garageHint").textContent = "Установлено.";
      await refreshAll();
      clearError();
    } catch (e) {
      qs("garageHint").textContent = `Ошибка: ${prettyError(e)}`;
      setError(prettyError(e));
    }
  });

  on("openContainerBtn", "click", async () => {
    const btn = qs("openContainerBtn");
    btn.disabled = true;
    qs("containerResult").textContent = "";
    try {
      const result = await api("/api/containers/open", { method: "POST" });
      if (result.reward_type === "unlock") {
        qs("containerResult").textContent = `Получено: ${NAMES[result.reward_key] || result.reward_key}`;
      } else {
        qs("containerResult").textContent = `Получено кристаллов: ${result.reward_amount}`;
      }
      await refreshAll();
      clearError();
    } catch (e) {
      setError(prettyError(e));
      qs("containerResult").textContent = prettyError(e);
    } finally {
      btn.disabled = false;
    }
  });

  on("refreshBtn", "click", async () => {
    try {
      await refreshAll();
      clearError();
    } catch (e) {
      setError(prettyError(e));
    }
  });
}

async function main() {
  showTab("garage");
  try {
    initMusic();
  } catch {
    // do not block UI if audio init fails
  }
  try {
    bindUI();
  } catch {
    // keep app interactive even if one section is missing
  }
  try {
    await initAuth();
    await initMusicTrack();
    await refreshAll();
    clearError();
  } catch (e) {
    setError(prettyError(e));
  }
}

main();

