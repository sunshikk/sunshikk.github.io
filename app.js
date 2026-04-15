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

const state = { token: null, profile: null, shop: null, containersInfo: null, activeTab: "profile", garageCategory: "weapon", shopCategory: "weapon", selectedWeapon: "smoky", selectedHull: "hunter", viewerName: "player", bgMusic: null, bgMusicEnabled: false, bgMusicVolume: DEFAULT_MUSIC_VOLUME };
const NAMES = { smoky: "Смоки", railgun: "Рельса", shaft: "Шафт", thunder: "Гром", hunter: "Хантер", titan: "Титан" };
const DESCRIPTIONS = { smoky: "Базовая пушка со стабильным уроном.", railgun: "Дальнобойная пушка с высоким уроном.", shaft: "Снайперская пушка для точных попаданий.", thunder: "Мощный залп по площади.", hunter: "Универсальный корпус для баланса скорости и брони.", titan: "Тяжелый корпус с повышенной прочностью." };

function qs(id){ return document.getElementById(id); }
function withApiBase(path){ if(!path) return path; if(/^https?:\/\//i.test(path)) return path; if(!API_BASE_URL) return path; return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`; }
function absUrl(path){ try { if(API_BASE_URL && path.startsWith("/")) return new URL(path, API_BASE_URL).toString(); return new URL(path, window.location.origin).toString(); } catch { return path; } }
function withCacheBust(url){ return `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`; }
function setError(text){ const p = qs("panelNotice"); if(!p) return; qs("notice").textContent = text; p.style.display = "block"; }
function clearError(){ const p = qs("panelNotice"); if(!p) return; qs("notice").textContent = ""; p.style.display = "none"; }
function prettyError(err){ return err instanceof TypeError ? "Сервер недоступен. Проверь подключение." : (err?.message || "Неизвестная ошибка."); }

async function api(path, options = {}){
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if(state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(withApiBase(path), { ...options, headers });
  if(!res.ok){
    let msg = `${res.status}`;
    try { const body = await res.json(); msg = body.detail || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

function updateMusicButton(){
  const btn = qs("musicToggleBtn"), label = qs("musicToggleLabel"), led = qs("musicLed");
  if(!btn || !label || !led) return;
  btn.classList.toggle("isOn", state.bgMusicEnabled);
  led.classList.toggle("isOn", state.bgMusicEnabled);
  label.textContent = state.bgMusicEnabled ? "Музыка вкл" : "Музыка выкл";
}
function saveMusic(){
  try { localStorage.setItem(MUSIC_STORAGE_KEY, state.bgMusicEnabled ? "1" : "0"); localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, String(state.bgMusicVolume)); } catch {}
}
function getTrack(){ return absUrl(withApiBase(TAB_MUSIC[state.activeTab] || TAB_MUSIC.profile)); }
async function applyMusic(){
  if(!state.bgMusic) return;
  state.bgMusic.volume = state.bgMusicVolume;
  state.bgMusic.muted = !state.bgMusicEnabled;
  if(!state.bgMusicEnabled){ state.bgMusic.pause(); updateMusicButton(); return; }
  try { await state.bgMusic.play(); } catch {}
  updateMusicButton();
}
async function switchTrack(){
  if(!state.bgMusic) return;
  const src = getTrack();
  if(state.bgMusic.src === src) return;
  state.bgMusic.src = src;
  state.bgMusic.load();
  await applyMusic();
}
function initMusic(){
  const btn = qs("musicToggleBtn"), volume = qs("musicVolume");
  if(!btn || !volume) return;
  try {
    state.bgMusicEnabled = localStorage.getItem(MUSIC_STORAGE_KEY) === "1";
    const saved = Number(localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY));
    if(!Number.isNaN(saved)) state.bgMusicVolume = Math.max(0, Math.min(1, saved));
  } catch {}
  const audio = new Audio(getTrack());
  audio.loop = true;
  audio.preload = "none";
  audio.addEventListener("error", () => { state.bgMusicEnabled = false; updateMusicButton(); setError("Не удалось загрузить музыку."); });
  state.bgMusic = audio;
  volume.value = String(Math.round(state.bgMusicVolume * 100));
  updateMusicButton();
  btn.addEventListener("click", async () => { state.bgMusicEnabled = !state.bgMusicEnabled; saveMusic(); await applyMusic(); });
  volume.addEventListener("input", async () => { state.bgMusicVolume = Math.max(0, Math.min(1, Number(volume.value) / 100)); saveMusic(); await applyMusic(); });
}

async function initAuth(){
  const tg = window.Telegram?.WebApp;
  if(!tg) throw new Error("Открой мини-апп из Telegram.");
  tg.ready();
  tg.expand();
  state.viewerName = tg.initDataUnsafe?.user?.username || tg.initDataUnsafe?.user?.first_name || "player";
  if(!tg.initData) throw new Error("initData не получен. Открой WebApp кнопкой из бота.");
  const auth = await api("/api/auth/telegram", { method: "POST", body: JSON.stringify({ initData: tg.initData }), headers: {} });
  state.token = auth.token;
}

function isUnlocked(key){ return key === "smoky" || key === "hunter" || Boolean(state.profile?.unlocks?.[key]); }
function currentGarageKey(){ return state.garageCategory === "weapon" ? state.selectedWeapon : state.selectedHull; }
function garageList(){ return state.garageCategory === "weapon" ? ["smoky", "railgun", "shaft", "thunder"] : ["hunter", "titan"]; }

function renderHud(){
  if(!state.profile) return;
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
function renderProfile(){ if(!state.profile) return; qs("battlesValue").textContent = String(state.profile.battles); qs("wlValue").textContent = `${state.profile.wins} / ${state.profile.losses}`; qs("tankImg").src = withCacheBust(absUrl(state.profile.tank_image_url)); }
function renderGarage(){
  if(!state.profile) return;
  const key = currentGarageKey();
  qs("garageSelectedName").textContent = `${NAMES[key] || key}`.toUpperCase();
  qs("garageSelectedDesc").textContent = DESCRIPTIONS[key] || "Выберите предмет.";
  qs("garageTankImg").src = withCacheBust(absUrl(state.profile.tank_image_url));
  const rail = qs("garageItemsRail");
  if(!rail) return;
  rail.innerHTML = "";
  const equipped = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  for(const itemKey of garageList()){
    const card = document.createElement("button");
    card.type = "button";
    card.className = "itemCard";
    if(!isUnlocked(itemKey)) card.classList.add("isLocked");
    if(itemKey === key) card.classList.add("isSelected");
    card.innerHTML = `<img src="${withCacheBust(absUrl(`/images/webapp/${itemKey}.png`))}" alt="${NAMES[itemKey] || itemKey}" /><div class="itemName">${NAMES[itemKey] || itemKey}</div><div class="itemStatus">${!isUnlocked(itemKey) ? "Закрыто" : itemKey === equipped ? "Установлено" : "Доступно"}</div>`;
    card.onclick = () => { if(state.garageCategory === "weapon") state.selectedWeapon = itemKey; else state.selectedHull = itemKey; renderGarage(); };
    rail.appendChild(card);
  }
}
function renderShop(){
  const list = qs("shopList");
  if(!list || !state.shop) return;
  list.innerHTML = "";
  const items = state.shop.items.filter((i) => i.category === state.shopCategory);
  for(const item of items){
    const card = document.createElement("div");
    card.className = "shopCard";
    const buyButton = item.owned ? `<span class="shopOwned">Куплено</span>` : `<button class="equipBtn" data-buy="${item.key}" style="margin-top:0">Купить</button>`;
    card.innerHTML = `<img src="${withCacheBust(absUrl(item.image_url))}" alt="${item.name}"><div class="shopCardTitle">${item.name}</div><div class="shopCardMeta">Категория: ${item.category === "weapon" ? "Пушка" : "Корпус"}</div><div class="shopCardActions"><span class="shopPrice">${item.price} 💎</span>${buyButton}</div>`;
    list.appendChild(card);
  }
  list.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try { await api("/api/shop/buy", { method: "POST", body: JSON.stringify({ item: btn.getAttribute("data-buy") }) }); await refreshAll(); clearError(); }
      catch (e) { setError(prettyError(e)); }
      finally { btn.disabled = false; }
    });
  });
}
function renderContainers(){ if(state.containersInfo) qs("containerImg").src = withCacheBust(absUrl(state.containersInfo.container_image_url)); }

async function showTab(tab){
  state.activeTab = tab;
  document.querySelectorAll(".mainTab").forEach((b) => b.classList.toggle("isActive", b.dataset.tab === tab));
  ["garage", "shop", "containers", "profile"].forEach((key) => {
    const panel = qs(`panel${key[0].toUpperCase()}${key.slice(1)}`);
    if(panel) panel.style.display = key === tab ? "block" : "none";
  });
  await switchTrack();
}

async function refreshAll(){
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

function bindUI(){
  qs("tabs")?.addEventListener("click", async (e) => { const b = e.target.closest(".mainTab"); if(b) await showTab(b.dataset.tab); });
  qs("garageCategoryTabs")?.addEventListener("click", (e) => { const b = e.target.closest(".subTab"); if(!b) return; state.garageCategory = b.dataset.cat; qs("garageCategoryTabs")?.querySelectorAll(".subTab").forEach((it) => it.classList.toggle("isActive", it.dataset.cat === state.garageCategory)); renderGarage(); });
  qs("shopCategory")?.addEventListener("click", (e) => { const b = e.target.closest(".shopCat"); if(!b) return; state.shopCategory = b.dataset.cat; qs("shopCategory")?.querySelectorAll(".shopCat").forEach((it) => it.classList.toggle("isActive", it.dataset.cat === state.shopCategory)); renderShop(); });
  qs("equipBtn")?.addEventListener("click", async () => {
    const key = currentGarageKey();
    if(!isUnlocked(key)){ qs("garageHint").textContent = "Сначала разблокируй этот предмет."; return; }
    const weapon = state.garageCategory === "weapon" ? key : state.selectedWeapon;
    const hull = state.garageCategory === "hull" ? key : state.selectedHull;
    try { await api("/api/garage/set_tank", { method: "POST", body: JSON.stringify({ weapon, hull }) }); qs("garageHint").textContent = "Установлено."; await refreshAll(); clearError(); }
    catch (e) { qs("garageHint").textContent = `Ошибка: ${prettyError(e)}`; setError(prettyError(e)); }
  });
  qs("openContainerBtn")?.addEventListener("click", async () => {
    const btn = qs("openContainerBtn");
    btn.disabled = true;
    qs("containerResult").textContent = "";
    try {
      const result = await api("/api/containers/open", { method: "POST" });
      qs("containerResult").textContent = result.reward_type === "unlock" ? `Получено: ${NAMES[result.reward_key] || result.reward_key}` : `Получено кристаллов: ${result.reward_amount}`;
      await refreshAll();
      clearError();
    } catch (e) { setError(prettyError(e)); qs("containerResult").textContent = prettyError(e); }
    finally { btn.disabled = false; }
  });
  qs("refreshBtn")?.addEventListener("click", async () => { try { await refreshAll(); clearError(); } catch (e) { setError(prettyError(e)); } });
}

async function main(){
  initMusic();
  bindUI();
  await showTab("profile");
  try {
    await initAuth();
    await refreshAll();
    clearError();
    await switchTrack();
    await applyMusicState();
  } catch (e) { setError(prettyError(e)); }
}

main();
