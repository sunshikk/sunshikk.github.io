/* global Telegram */

const API_BASE_URL = String(window.API_BASE_URL || "").trim().replace(/\/+$/, "");
const MUSIC_STORAGE_KEY = "bg_music_enabled";
const MUSIC_VOLUME_STORAGE_KEY = "bg_music_volume";
const DEFAULT_MUSIC_VOLUME = 0.35;
const TAB_MUSIC = {
  profile: "/sounds/music/background_music.mp3",
  garage: "/sounds/music/background_music.mp3",
  shop: "/sounds/music/background_music.mp3",
  containers: "/sounds/music/background_music.mp3",
};
const PURCHASE_SOUND_PATH = "/sounds/notify.mp3";
const BATTLE_AMBIENT_PATH = "/sounds/ambient/space_ambient.mp3";
const CONTAINER_CLOSED_IMAGE = "/images/webapp/container.png";
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
const RARITY_LABELS = {
  rare: "Редкое",
  epic: "Эпическое",
  ultrarare: "Ультраредкое",
  legendary: "Легендарное",
};
const RARITY_ORDER = ["legendary", "ultrarare", "epic", "rare"];
const CONTAINER_LOOT = [
  {
    key: "railgun",
    type: "weapon",
    name: "Рельса",
    chance: "1%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.railgun,
    description: "Легендарная пушка с самым редким шансом выпадения.",
  },
  {
    key: "shaft",
    type: "weapon",
    name: "Шафт",
    chance: "2%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.shaft,
    description: "Ультраредкая снайперская пушка для точных попаданий.",
  },
  {
    key: "thunder",
    type: "weapon",
    name: "Гром",
    chance: "5%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.thunder,
    description: "Эпическая пушка с мощным уроном по площади.",
  },
  {
    key: "titan",
    type: "hull",
    name: "Титан",
    chance: "5%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.titan,
    description: "Эпический тяжелый корпус с высоким запасом прочности.",
  },
  {
    key: "crystals_1000",
    type: "crystals",
    name: "Кристаллы x1000",
    chance: "8%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Эпическая награда с крупной пачкой кристаллов.",
  },
  {
    key: "crystals_10000",
    type: "crystals",
    name: "Кристаллы x10000",
    chance: "1.2%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Ультраредкая награда с огромным количеством кристаллов.",
  },
  {
    key: "crystals_20000",
    type: "crystals",
    name: "Кристаллы x20000",
    chance: "0.5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Легендарная кристальная награда с максимальной ценностью.",
  },
  {
    key: "crystals_50",
    type: "crystals",
    name: "Кристаллы x50",
    chance: "12.88%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с небольшим количеством кристаллов.",
  },
  {
    key: "crystals_100",
    type: "crystals",
    name: "Кристаллы x100",
    chance: "12.88%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда со средним количеством кристаллов.",
  },
  {
    key: "crystals_150",
    type: "crystals",
    name: "Кристаллы x150",
    chance: "12.88%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с хорошим количеством кристаллов.",
  },
  {
    key: "crystals_200",
    type: "crystals",
    name: "Кристаллы x200",
    chance: "12.88%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с крупной пачкой кристаллов.",
  },
  {
    key: "crystals_250",
    type: "crystals",
    name: "Кристаллы x250",
    chance: "12.88%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с большим количеством кристаллов.",
  },
  {
    key: "crystals_300",
    type: "crystals",
    name: "Кристаллы x300",
    chance: "12.88%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с максимальным количеством кристаллов.",
  },
];
const ITEM_IMAGE_OVERRIDES = { smoky: "smoky.png", hunter: "hunter.png" };
const RANK_EXP_BY_ID = {
  1: 0, 2: 50, 3: 120, 4: 200, 5: 300, 6: 420, 7: 560, 8: 720, 9: 900, 10: 1100,
  11: 1320, 12: 1560, 13: 1820, 14: 2100, 15: 2400, 16: 2720, 17: 3060, 18: 3420, 19: 3800, 20: 4200,
  21: 4620, 22: 5060, 23: 5520, 24: 6000, 25: 6500, 26: 7020, 27: 7560, 28: 8120, 29: 8700, 30: 9300, 31: 10000,
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
  prevMusic: null,
  bgMusicEnabled: false,
  bgMusicVolume: DEFAULT_MUSIC_VOLUME,
  musicSwitchSeq: 0,
  lootFilter: "all",
  notifySound: null,
  battleAmbient: null,
  battleAmbientActive: false,
  battleBgResumeTime: 0,
  battleBgWasPlaying: false,
  rewardAnimating: false,
  webBattleActive: false,
  battleCooldownTimer: null,
  battleLastState: null,
  avatarUrl: null,
  battlePollTimer: null,
  activeInviteId: null,
  outgoingInviteId: null,
  invitePollTimer: null,
  battleEndModalKey: null,
  battleMapSignature: "",
  damageHintTimers: { player: null, bot: null },
  markerDamageTimers: { player: null, bot: null },
  leaderboard: null,
  leaderboardSort: "experience",
  leaderboardLimit: 100,
  ranks: null,
  lobbies: null,
  joinLobbyId: null,
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
const LOCKED_HINTS = {
  railgun: "Эта пушка пока не открыта. Ее можно выбить из контейнера или купить в магазине.",
  shaft: "Эта пушка пока не открыта. Ее можно выбить из контейнера или купить в магазине.",
  thunder: "Эта пушка пока не открыта. Ее можно выбить из контейнера или купить в магазине.",
  titan: "Этот корпус пока не открыт. Его можно выбить из контейнера или купить в магазине.",
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
async function fadeAudioVolume(audio, from, to, durationMs = 300, shouldContinue = () => true) {
  if (!audio) return;
  const steps = 14;
  const stepTime = Math.max(15, Math.floor(durationMs / steps));
  audio.volume = Math.max(0, Math.min(1, from));
  for (let i = 1; i <= steps; i += 1) {
    if (!shouldContinue()) return;
    const t = i / steps;
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * t));
    await sleep(stepTime);
  }
}
function waitForImageLoad(img, timeoutMs = 2000) {
  return new Promise((resolve) => {
    if (!img) return resolve();
    if (img.complete && img.naturalWidth > 0) return resolve();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      img.onload = null;
      img.onerror = null;
      resolve();
    };
    img.onload = finish;
    img.onerror = finish;
    setTimeout(finish, timeoutMs);
  });
}
function preloadImage(url, timeoutMs = 2200) {
  return new Promise((resolve) => {
    if (!url) return resolve();
    const img = new Image();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      img.onload = null;
      img.onerror = null;
      resolve();
    };
    img.onload = finish;
    img.onerror = finish;
    img.src = url;
    setTimeout(finish, timeoutMs);
  });
}

function hideErrorModal() {
  const modal = qs("errorModal");
  if (modal) modal.style.display = "none";
}
function hidePurchaseModal() {
  const modal = qs("purchaseModal");
  if (modal) modal.style.display = "none";
}
function hideLootModal() {
  const modal = qs("lootModal");
  if (modal) modal.style.display = "none";
}
function clearError() {
  const p = qs("panelNotice");
  if (p) { qs("notice").textContent = ""; p.style.display = "none"; }
  hideErrorModal();
}
function setError(text) {
  const msg = String(text || "Неизвестная ошибка.");
  const title = qs("errorTitle");
  const body = qs("errorBody");
  const modal = qs("errorModal");
  if (title) title.textContent = "ВНИМАНИЕ!";
  if (body) body.textContent = msg;
  if (modal) modal.style.display = "flex";
}
function prettyError(err) {
  if (err instanceof TypeError) return "Сервер недоступен. Проверь подключение к интернету.";
  const raw = String(err?.message || "").trim();
  const low = raw.toLowerCase();
  if (!raw) return "Неизвестная ошибка.";
  if (low.includes("not enough crystals") || low.includes("insufficient crystals")) return "Недостаточно кристаллов для покупки.";
  if (low.includes("not enough") && low.includes("crystal")) return "Недостаточно кристаллов для покупки.";
  if (low.includes("not enough containers")) return "Недостаточно контейнеров.";
  if (low.includes("no containers")) return "У тебя нет контейнеров.";
  if (low.includes("already owned")) return "Этот предмет уже куплен.";
  if (low.includes("unauthorized") || low === "401") return "Сессия истекла. Открой мини-приложение заново из бота.";
  if (low.includes("invalid token")) return "Сессия недействительна. Открой мини-приложение заново из бота.";
  if (low.includes("forbidden") || low === "403") return "Нет доступа к этому действию.";
  if (low.includes("not found") || low === "404") return "Запрошенный ресурс не найден.";
  if (low.includes("item not found")) return "Предмет не найден.";
  if (low.includes("item locked") || low.includes("not unlocked")) return "Этот предмет еще не разблокирован.";
  if (low.includes("bad request") || low === "400") return "Некорректный запрос.";
  if (low.includes("internal server error") || low === "500") return "Внутренняя ошибка сервера.";
  if (low.includes("too many requests") || low === "429") return "Слишком много запросов. Попробуй чуть позже.";
  if (low.includes("failed to fetch")) return "Не удалось получить ответ от сервера.";
  if (low.includes("timeout")) return "Сервер долго отвечает. Попробуй еще раз.";
  if (low.includes("network")) return "Проблема сети. Проверь подключение.";
  if (low.includes("недостаточно кристаллов")) return "Недостаточно кристаллов для покупки.";
  return raw;
}

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

async function apiKeepalive(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(withApiBase(path), { ...options, headers, keepalive: true });
  if (!res.ok) {
    let msg = `${res.status}`;
    try { const body = await res.json(); msg = body.detail || msg; } catch {}
    throw new Error(msg);
  }
  try { return await res.json(); } catch { return { ok: true }; }
}

function detectRewardRarity(result) {
  if (result.reward_type === "crystals") {
    const amount = Number(result.reward_amount || 0);
    if (amount >= 20000) return "legendary";
    if (amount >= 10000) return "ultrarare";
    if (amount >= 1000) return "epic";
    return "rare";
  }
  if (result.reward_key === "railgun") return "legendary";
  if (result.reward_key === "shaft") return "ultrarare";
  if (result.reward_key === "thunder" || result.reward_key === "titan") return "epic";
  return "rare";
}

function getItemImage(key) {
  const imageName = ITEM_IMAGE_OVERRIDES[key] || `${key}.png`;
  return `/images/webapp/${imageName}`;
}
function applyBackgroundImage() {
  const root = document.documentElement;
  const bgUrl = absUrl(withApiBase("/images/webapp/Background.webp"));
  const nextValue = `url("${bgUrl}")`;
  if (root.style.getPropertyValue("--bg-image") !== nextValue) {
    root.style.setProperty("--bg-image", nextValue);
  }
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
    const seq = ++state.musicSwitchSeq;
    const current = state.bgMusic;
    const previous = state.prevMusic;
    await Promise.all([
      fadeAudioVolume(current, current.volume, 0, 220, () => seq === state.musicSwitchSeq),
      previous ? fadeAudioVolume(previous, previous.volume, 0, 220, () => seq === state.musicSwitchSeq) : Promise.resolve(),
    ]);
    current.pause();
    current.currentTime = 0;
    if (previous) previous.pause();
    if (previous) previous.currentTime = 0;
    if (state.battleAmbient) {
      try { await fadeAudioVolume(state.battleAmbient, state.battleAmbient.volume, 0, 180, () => seq === state.musicSwitchSeq); } catch {}
      state.battleAmbient.pause();
      state.battleAmbient.currentTime = 0;
    }
    state.battleAmbientActive = false;
    updateMusicButton();
    return;
  }
  if (state.prevMusic) {
    state.prevMusic.pause();
    state.prevMusic.currentTime = 0;
    state.prevMusic = null;
  }
  state.bgMusic.muted = false;
  state.bgMusic.volume = 0;
  state.bgMusic.currentTime = 0;
  try { await state.bgMusic.play(); } catch {}
  await fadeVolume(state.bgMusicVolume, 260);
  updateMusicButton();
}

async function startBattleAmbient() {
  if (!state.bgMusicEnabled) return;
  if (state.battleAmbientActive) return;
  if (!state.battleAmbient) {
    state.battleAmbient = new Audio(absUrl(withApiBase(BATTLE_AMBIENT_PATH)));
    state.battleAmbient.loop = true;
    state.battleAmbient.preload = "auto";
    state.battleAmbient.volume = 0;
  }
  state.battleAmbientActive = true;

  // Fully mute and pause main UI music during battle.
  if (state.bgMusic) {
    state.battleBgResumeTime = state.bgMusic.currentTime || 0;
    state.battleBgWasPlaying = !state.bgMusic.paused;
    await fadeAudioVolume(state.bgMusic, state.bgMusic.volume, 0, 220);
    state.bgMusic.pause();
    state.bgMusic.currentTime = state.battleBgResumeTime;
  }

  try { await state.battleAmbient.play(); } catch {}
  await fadeAudioVolume(state.battleAmbient, state.battleAmbient.volume, Math.min(0.55, state.bgMusicVolume + 0.1), 260);
}

async function stopBattleAmbient() {
  if (!state.battleAmbient || !state.battleAmbientActive) return;
  state.battleAmbientActive = false;
  const a = state.battleAmbient;
  await fadeAudioVolume(a, a.volume, 0, 220);
  a.pause();
  a.currentTime = 0;
  if (state.bgMusicEnabled && state.bgMusic && state.battleBgWasPlaying) {
    state.bgMusic.currentTime = state.battleBgResumeTime || 0;
    state.bgMusic.volume = 0;
    try { await state.bgMusic.play(); } catch {}
    await fadeAudioVolume(state.bgMusic, 0, state.bgMusicVolume, 220);
  }
  state.battleBgWasPlaying = false;
  state.battleBgResumeTime = 0;
}

async function playPurchaseSound() {
  if (!state.notifySound) {
    state.notifySound = new Audio(absUrl(withApiBase(PURCHASE_SOUND_PATH)));
    state.notifySound.preload = "auto";
  }
  const sound = state.notifySound;
  sound.pause();
  sound.currentTime = 0;

  try { await sound.play(); } catch {}
}

async function switchTrack() {
  if (!state.bgMusic) return;
  const src = getTrack();
  const currentSrc = state.bgMusic.src ? new URL(state.bgMusic.src, window.location.origin).toString() : "";
  const nextSrc = new URL(src, window.location.origin).toString();
  if (currentSrc === nextSrc) return;
  const seq = ++state.musicSwitchSeq;
  const oldAudio = state.bgMusic;
  if (!state.bgMusicEnabled) {
    oldAudio.src = nextSrc;
    oldAudio.load();
    return;
  }
  if (state.prevMusic) {
    state.prevMusic.pause();
    state.prevMusic.currentTime = 0;
    state.prevMusic = null;
  }
  const newAudio = new Audio(nextSrc);
  newAudio.loop = true;
  newAudio.preload = "none";
  newAudio.volume = 0;
  newAudio.muted = false;
  state.bgMusic = newAudio;
  state.prevMusic = oldAudio;
  try { await newAudio.play(); } catch {}
  if (seq !== state.musicSwitchSeq) {
    newAudio.pause();
    return;
  }
  // Сначала плавно входит новый трек, старый еще играет.
  await fadeAudioVolume(newAudio, 0, state.bgMusicVolume, 280, () => seq === state.musicSwitchSeq);
  if (seq !== state.musicSwitchSeq) return;
  // Затем плавно затихает старый.
  await fadeAudioVolume(oldAudio, oldAudio.volume, 0, 300, () => seq === state.musicSwitchSeq);
  oldAudio.pause();
  oldAudio.currentTime = 0;
  if (state.prevMusic === oldAudio) state.prevMusic = null;
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
  const unsafeUser = tg.initDataUnsafe?.user;
  state.viewerName = unsafeUser?.username || unsafeUser?.first_name || "player";
  if (unsafeUser?.photo_url) {
    state.avatarUrl = unsafeUser.photo_url;
  }
  if (!tg.initData) {
    throw new Error("initData не получен. Открой WebApp кнопкой из бота, а не обычной ссылкой в браузере.");
  }
  const auth = await api("/api/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ initData: tg.initData, photo_url: state.avatarUrl || null }),
    headers: {},
  });
  state.token = auth.token;
}

function isUnlocked(key) { return key === "smoky" || key === "hunter" || Boolean(state.profile?.unlocks?.[key]); }
function currentGarageKey() { return state.garageCategory === "weapon" ? state.selectedWeapon : state.selectedHull; }
function garageList() { return state.garageCategory === "weapon" ? ["smoky", "railgun", "shaft", "thunder"] : ["hunter", "titan"]; }
function showPurchaseLikeModal({ title, label, icon, name, price }) {
  const modal = qs("purchaseModal");
  const titleEl = qs("purchaseTitle");
  const labelEl = qs("purchaseLabel");
  const iconEl = qs("purchaseIcon");
  const nameEl = qs("purchaseItemName");
  const priceEl = qs("purchaseItemPrice");
  if (!modal || !nameEl || !priceEl) return;
  if (titleEl) titleEl.textContent = String(title || "ГОТОВО");
  if (labelEl) labelEl.textContent = String(label || "");
  if (iconEl && icon) iconEl.textContent = String(icon);
  nameEl.textContent = String(name || "—");
  priceEl.textContent = String(price || "");
  modal.style.display = "flex";
}
function showPurchaseModal(item) {
  const modal = qs("purchaseModal");
  const name = qs("purchaseItemName");
  const price = qs("purchaseItemPrice");
  if (!modal || !name || !price || !item) return;
  // Ensure default purchase look (in case promo modal changed it).
  showPurchaseLikeModal({
    title: "ПОКУПКА ПРОИЗВЕДЕНА УСПЕШНО",
    label: "Вы приобрели:",
    icon: "🛒",
    name: item.name || NAMES[item.key] || item.key,
    price: String(item.price ?? 0),
  });
}
function updateLootPreview(item) {
  const name = qs("lootPreviewName");
  const desc = qs("lootPreviewDesc");
  if (!name || !desc) return;
  if (!item) {
    name.textContent = "Обычный контейнер";
    desc.textContent = "Выберите предмет из списка, чтобы посмотреть описание и шанс выпадения.";
    return;
  }
  name.textContent = item.name;
  desc.textContent = `${item.description} Шанс выпадения: ${item.chance}. Редкость: ${RARITY_LABELS[item.rarity]}.`;
}
function renderContainerLoot() {
  const grid = qs("lootGrid");
  if (!grid) return;
  const items = CONTAINER_LOOT
    .filter((item) => state.lootFilter === "all" || item.rarity === state.lootFilter)
    .sort((a, b) => {
      const rarityDiff = RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
      if (rarityDiff !== 0) return rarityDiff;
      return a.name.localeCompare(b.name, "ru");
    });
  grid.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `lootItemCard rarity-${item.rarity}${index === 0 ? " isSelected" : ""}`;
    card.innerHTML = `
      <div class="lootChance">${item.chance}</div>
      <img src="${withCacheBust(absUrl(item.image))}" alt="${item.name}" class="lootItemImage" />
      <div class="lootItemFooter">${item.name}</div>
    `;
    card.addEventListener("click", () => {
      grid.querySelectorAll(".lootItemCard").forEach((el) => el.classList.remove("isSelected"));
      card.classList.add("isSelected");
      updateLootPreview(item);
    });
    grid.appendChild(card);
  });
  updateLootPreview(items[0] || null);
}
function showLootModal() {
  const modal = qs("lootModal");
  if (!modal) return;
  modal.style.display = "flex";
  renderContainerLoot();
}
function updateGarageEquipButton() {
  const equipBtn = qs("equipBtn");
  if (!equipBtn || !state.profile) return;
  const key = currentGarageKey();
  const equippedCurrent = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  const isCurrentEquipped = key === equippedCurrent;
  const isCurrentUnlocked = isUnlocked(key);
  if (!isCurrentUnlocked) {
    equipBtn.disabled = true;
    equipBtn.classList.add("isDisabled");
    equipBtn.textContent = "Недоступно";
    return;
  }
  if (isCurrentEquipped) {
    equipBtn.disabled = true;
    equipBtn.classList.add("isDisabled");
    equipBtn.textContent = "Установлено";
    return;
  }
  equipBtn.disabled = false;
  equipBtn.classList.remove("isDisabled");
  equipBtn.textContent = "Установить";
}

function renderHud() {
  if (!state.profile) return;
  const logo = qs("logoImg");
  if (logo && !logo.src) {
    if (state.avatarUrl) {
      logo.src = state.avatarUrl;
    } else {
      logo.src = withCacheBust(absUrl("/images/webapp/logo.png"));
    }
  }
  qs("nickname").textContent = state.viewerName;
  qs("rankName").textContent = state.profile.rank.name;
  qs("pillCrystals").textContent = String(state.profile.crystals ?? 0);
  qs("pillContainers").textContent = String(state.profile.containers ?? 0);
  qs("rankImg").src = withCacheBust(absUrl(state.profile.rank_image_url));
  const rankId = Number(state.profile.rank?.id || 1);
  const currentRankExp = Number(RANK_EXP_BY_ID[rankId] ?? 0);
  const nextRankExp = Number(RANK_EXP_BY_ID[Math.min(31, rankId + 1)] ?? currentRankExp);
  const exp = Number(state.profile.experience || 0);
  const maxExp = rankId >= 31 ? currentRankExp : nextRankExp;
  const progressDen = Math.max(1, maxExp - currentRankExp);
  const progressNum = Math.max(0, exp - currentRankExp);
  qs("expValue").textContent = `${exp} / ${maxExp}`;
  qs("expFill").style.width = `${Math.max(0, Math.min(100, (progressNum / progressDen) * 100))}%`;
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
  const rankValueIcon = qs("rankValueIcon");
  if (rankValueIcon) rankValueIcon.src = withCacheBust(absUrl(state.profile.rank_image_url));
  qs("winrateValue").textContent = `${winrate}%`;
}

function leaderboardRowHtml(row, isMe = false) {
  if (!row) return "";
  const place = Number(row.place || 0) > 0 ? String(row.place) : "—";
  const avatar = row.avatar_url ? absUrl(String(row.avatar_url)) : "";
  const rankImg = row.rank_image_url ? absUrl(String(row.rank_image_url)) : "";
  const rankName = String(row.rank_name || "Звание");
  const name = String(row.name || "Игрок");
  const initial = name.trim().charAt(0).toUpperCase() || "U";
  return `<div class="leadersRow${isMe ? " isMe" : ""}">
    <span class="leadersPlace">${place}</span>
    <span class="leadersIdentity">
      <span class="leadersAvatar${avatar ? "" : " isFallback"}">
        ${avatar ? `<img src="${avatar}" alt="${name}" loading="lazy" referrerpolicy="no-referrer" crossorigin="anonymous" onerror="this.closest('.leadersAvatar')?.classList.add('isFallback');this.remove();">` : ""}
        <span class="leadersAvatarFallback">${initial}</span>
      </span>
      <span class="leadersNameWrap">
        <span class="leadersName">${name}</span>
        <span class="leadersRank">${rankImg ? `<img class="leadersRankIcon" src="${rankImg}" alt="${rankName}">` : ""}<span>${rankName}</span></span>
      </span>
    </span>
    <span class="leadersExp">${Number(row.experience || 0)}</span>
    <span class="leadersWL">${Number(row.wins || 0)}/${Number(row.losses || 0)}</span>
    <span class="leadersBattles">${Number(row.battles || 0)}</span>
  </div>`;
}

function renderLeaderboard() {
  const rows = qs("leadersRows");
  const meWrap = qs("leadersMeWrap");
  const meRow = qs("leadersMeRow");
  if (!rows || !meWrap || !meRow) return;
  const data = state.leaderboard;
  if (!data) {
    rows.innerHTML = '<div class="leadersEmpty">Загрузка рейтинга...</div>';
    meWrap.style.display = "none";
    return;
  }
  const top = Array.isArray(data.top) ? data.top : [];
  if (!top.length) {
    rows.innerHTML = '<div class="leadersEmpty">Пока нет данных рейтинга.</div>';
  } else {
    rows.innerHTML = top.map((row) => leaderboardRowHtml(row, false)).join("");
  }
  const me = data.current_player;
  if (me && !data.in_top) {
    meWrap.style.display = "block";
    meRow.innerHTML = leaderboardRowHtml(me, true);
  } else {
    meWrap.style.display = "none";
    meRow.innerHTML = "";
  }
  qs("leadersSortTabs")?.querySelectorAll(".leadersSortBtn")
    .forEach((btn) => btn.classList.toggle("isActive", btn.dataset.sort === state.leaderboardSort));
}

async function refreshLeaderboard() {
  state.leaderboard = await api(
    `/api/leaderboard?sort=${encodeURIComponent(state.leaderboardSort)}&limit=${encodeURIComponent(state.leaderboardLimit)}`
  );
  renderLeaderboard();
}

function renderGarage() {
  if (!state.profile) return;
  const key = currentGarageKey();
  const unlocked = isUnlocked(key);
  qs("garageSelectedName").textContent = `${NAMES[key] || key}`.toUpperCase();
  qs("garageSelectedDesc").textContent = unlocked
    ? (DESCRIPTIONS[key] || "Выберите предмет.")
    : (LOCKED_HINTS[key] || "Этот предмет пока недоступен. Его можно открыть позже.");
  qs("garageTankImg").src = absUrl(state.profile.tank_image_url);
  const equippedCurrent = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  updateGarageEquipButton();
  const rail = qs("garageItemsRail");
  rail.innerHTML = "";
  const equipped = equippedCurrent;
  for (const itemKey of garageList()) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "itemCard";
    if (!isUnlocked(itemKey)) card.classList.add("isLocked");
    if (itemKey === key) card.classList.add("isSelected");
    card.innerHTML = isUnlocked(itemKey)
      ? `
        <img src="${absUrl(getItemImage(itemKey))}" alt="${NAMES[itemKey] || itemKey}" />
        <div class="itemName">${NAMES[itemKey] || itemKey}</div>
      `
      : `
        <div class="lockedQuestionMark">?</div>
        <div class="itemName">${NAMES[itemKey] || itemKey}</div>
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
  const promoPanel = qs("promoPanel");
  const shopHeader = qs("shopHeader");
  const shopContent = promoPanel?.closest(".shopContent");
  if (!state.shop) return;

  // Вкладка промокодов использует отдельную панель без списка товаров.
  if (state.shopCategory === "promo") {
    if (list) list.innerHTML = "";
    if (list) list.style.display = "none";
    if (promoPanel) promoPanel.style.display = "flex";
    if (shopHeader) shopHeader.style.display = "none";
    if (shopContent) shopContent.classList.add("isPromoView");
    return;
  }

  if (!list) return;
  list.style.display = "grid";
  if (promoPanel) promoPanel.style.display = "none";
  if (shopHeader) shopHeader.style.display = "block";
  if (shopContent) shopContent.classList.remove("isPromoView");

  list.innerHTML = "";
  const items = state.shop.items.filter((i) => i.category === state.shopCategory);
  for (const item of items) {
    const card = document.createElement("div");
    card.className = "shopCard";
    const buyButton = item.owned
      ? `<button class="promoBtn shopBuyBtn" type="button" style="margin-top:0" disabled>Куплено</button>`
      : `<button class="promoBtn shopBuyBtn" data-buy="${item.key}" style="margin-top:0">Купить</button>`;
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
      const itemKey = btn.getAttribute("data-buy");
      const item = state.shop?.items?.find((it) => it.key === itemKey);
      try {
        await api("/api/shop/buy", { method: "POST", body: JSON.stringify({ item: itemKey }) });
        await refreshAll();
        showPurchaseModal(item);
        void playPurchaseSound();
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
  if (!modal || !card || !box || !contImg || !dropImg || !text) {
    qs("containerResult").textContent = result.reward_type === "unlock"
      ? `Получено: ${NAMES[result.reward_key] || result.reward_key}`
      : `Получено кристаллов: ${result.reward_amount}`;
    return;
  }
  card.className = "rewardCard";
  state.rewardAnimating = true;
  box.classList.remove("shake");
  dropImg.classList.remove("show");
  text.textContent = "";
  contImg.src = withCacheBust(absUrl(CONTAINER_CLOSED_IMAGE));
  contImg.classList.remove("isHidden");
  const rewardKey = result.reward_type === "crystals" ? "crystals" : result.reward_key;
  const openedSrc = withCacheBust(absUrl(CONTAINER_OPEN_IMAGES[rarity] || CONTAINER_OPEN_IMAGES.rare));
  const dropSrc = withCacheBust(absUrl(REWARD_ITEM_IMAGES[rewardKey] || "/images/webapp/crystals.png"));
  // Preload reveal assets while shaking.
  void preloadImage(openedSrc, 2600);
  void preloadImage(dropSrc, 2600);
  modal.style.display = "flex";
  await sleep(30);
  box.classList.add("shake");
  // 1 second suspense, then smooth reveal (glow + opened container + drop + text).
  await sleep(1000);
  card.className = `rewardCard rarity-${rarity}`; // glow appears smoothly via CSS transition
  contImg.classList.add("isHidden");
  await sleep(160);
  contImg.src = openedSrc;
  dropImg.src = dropSrc;
  await Promise.all([waitForImageLoad(contImg, 2600), waitForImageLoad(dropImg, 2600)]);
  contImg.classList.remove("isHidden");
  const rewardText = result.reward_type === "unlock"
    ? `Получено: ${NAMES[result.reward_key] || result.reward_key}`
    : `Получено кристаллов: ${result.reward_amount}`;
  text.textContent = rewardText;
  dropImg.classList.add("show");
  await sleep(520);
  state.rewardAnimating = false;
}

function hideRewardModal() {
  if (state.rewardAnimating) return;
  const modal = qs("rewardModal");
  if (modal) modal.style.display = "none";
}

async function showTab(tab, { force = false } = {}) {
  if (!force && state.webBattleActive && tab !== "battles") {
    setError("Нельзя переключать вкладки во время боя.");
    return;
  }
  state.activeTab = tab;
  document.querySelectorAll(".mainTab").forEach((b) => b.classList.toggle("isActive", b.dataset.tab === tab));
  ["profile", "leaders", "battles", "garage", "shop", "containers"].forEach((key) => {
    const panel = qs(`panel${key[0].toUpperCase()}${key.slice(1)}`);
    if (panel) panel.style.display = key === tab ? "block" : "none";
  });
  if (state.token) {
    try { await refreshAll(); } catch (e) { setError(prettyError(e)); }
  }
  await switchTrack();
}

async function refreshAll() {
  state.profile = await api("/api/profile/me");
  state.shop = await api("/api/shop/items");
  state.containersInfo = await api("/api/containers");
  if (!state.ranks) {
    try { state.ranks = (await api("/api/ranks"))?.ranks || []; } catch { state.ranks = []; }
  }
  state.leaderboard = await api(
    `/api/leaderboard?sort=${encodeURIComponent(state.leaderboardSort)}&limit=${encodeURIComponent(state.leaderboardLimit)}`
  );
  applyBackgroundImage();
  state.selectedWeapon = state.profile.weapon;
  state.selectedHull = state.profile.hull;
  renderHud();
  renderProfile();
  renderGarage();
  renderShop();
  renderContainers();
  renderLeaderboard();
}

function ranksOptionsHtml(selectedId) {
  const list = Array.isArray(state.ranks) ? state.ranks : [];
  if (!list.length) return `<option value="1">Новобранец</option>`;
  return list.map((r) => {
    const id = Number(r.id || 1);
    const name = String(r.name || `Rank ${id}`);
    return `<option value="${id}"${id === Number(selectedId) ? " selected" : ""}>${name}</option>`;
  }).join("");
}

function openCreateLobbyModal() {
  const modal = qs("createLobbyModal");
  const name = qs("lobbyNameInput");
  const allow = qs("lobbyAllowAllRanks");
  const minSel = qs("lobbyMinRank");
  const maxSel = qs("lobbyMaxRank");
  const rangeWrap = qs("lobbyRankRange");
  if (!modal || !name || !allow || !minSel || !maxSel || !rangeWrap) return;
  name.value = "";
  allow.checked = true;
  rangeWrap.style.opacity = "0.45";
  rangeWrap.style.pointerEvents = "none";
  minSel.innerHTML = ranksOptionsHtml(1);
  maxSel.innerHTML = ranksOptionsHtml(31);
  modal.style.display = "flex";
}

function closeCreateLobbyModal() {
  const modal = qs("createLobbyModal");
  if (modal) modal.style.display = "none";
}

function closeJoinLobbyModal() {
  const modal = qs("joinLobbyModal");
  if (modal) modal.style.display = "none";
  state.joinLobbyId = null;
}

function lobbyRankText(lb) {
  if (!lb) return "Все звания";
  if (lb.allow_all_ranks) return "Все звания";
  const minName = lb.min_rank_name || "—";
  const maxName = lb.max_rank_name || "—";
  return `${minName} — ${maxName}`;
}

function lobbyCardHtml(lb) {
  const title = String(lb.name || "Бой");
  const creator = String(lb.creator_name || "Игрок");
  const ranks = lobbyRankText(lb);
  const time = Math.max(0, Number(lb.expires_in || 0));
  return `<button class="battleLobbyCard" type="button" data-lobby="${String(lb.lobby_id || "")}">
    <div class="battleLobbyName">${title}</div>
    <div class="battleLobbyMeta">
      <span class="battleLobbyTag">👤 ${creator}</span>
      <span class="battleLobbyTag">🎖 ${ranks}</span>
      <span class="battleLobbyTag">⏳ ${time}с</span>
    </div>
  </button>`;
}

function renderLobbies() {
  const section = qs("battleLobbiesSection");
  const list = qs("battleLobbiesList");
  const createBtnWrap = qs("createLobbyBtn")?.closest(".battleLobbyCreateWrap");
  if (!section || !list) return;
  const modesVisible = (qs("battleModesGrid")?.style.display || "grid") !== "none";
  const botCardVisible = (qs("battleBotCard")?.style.display || "none") !== "none";
  const pvpCardVisible = (qs("battlePlayerCard")?.style.display || "none") !== "none";
  const inArena = (qs("battleArena")?.style.display || "none") !== "none";
  const show = modesVisible && !inArena && !botCardVisible && !pvpCardVisible;
  if (createBtnWrap) createBtnWrap.style.display = show ? "flex" : "none";
  section.style.display = show ? "block" : "none";
  if (!show) return;
  const lobbies = Array.isArray(state.lobbies) ? state.lobbies : [];
  if (!lobbies.length) {
    list.innerHTML = `<div class="leadersEmpty" style="grid-column:1/-1;">Пока нет открытых боёв. Создай свой!</div>`;
    return;
  }
  list.innerHTML = lobbies.map(lobbyCardHtml).join("");
}

async function refreshLobbies() {
  try {
    const data = await api("/api/battle/lobbies/list");
    state.lobbies = data?.lobbies || [];
  } catch {
    state.lobbies = [];
  }
  renderLobbies();
}

async function createLobbyFromModal() {
  const name = String(qs("lobbyNameInput")?.value || "").trim();
  const allow = Boolean(qs("lobbyAllowAllRanks")?.checked);
  const minId = Number(qs("lobbyMinRank")?.value || 1);
  const maxId = Number(qs("lobbyMaxRank")?.value || 31);
  await api("/api/battle/lobbies/create", {
    method: "POST",
    body: JSON.stringify({
      name,
      allow_all_ranks: allow,
      min_rank_id: allow ? null : minId,
      max_rank_id: allow ? null : maxId,
    }),
  });
  closeCreateLobbyModal();
  await refreshLobbies();
  clearError();
}

function openJoinLobbyModal(lb) {
  const modal = qs("joinLobbyModal");
  if (!modal) return;
  state.joinLobbyId = String(lb.lobby_id || "");
  qs("joinLobbyName").textContent = String(lb.name || "Бой");
  qs("joinLobbyMeta").textContent = `🎖 ${lobbyRankText(lb)}`;
  qs("joinLobbyLabel").textContent = `Вступить в бой игрока ${String(lb.creator_name || "Игрок")}?`;
  modal.style.display = "flex";
}

function renderBattleMap(
  mapSize,
  playerPos,
  botPos,
  playerTankImageUrl = "",
  botTankImageUrl = "",
  playerAiming = false,
  botAiming = false,
) {
  const map = qs("battleMap");
  if (!map) return;
  const size = Number(mapSize || 5);
  map.innerHTML = "";
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const cell = document.createElement("div");
      cell.className = "battleCell";
      if (playerPos && playerPos[0] === r && playerPos[1] === c) {
        cell.classList.add("isPlayer");
        const marker = document.createElement("div");
        marker.className = "battleMarker isPlayer";
        if (playerAiming) marker.classList.add("isAiming");
        if (playerTankImageUrl) {
          const img = document.createElement("img");
          img.className = "battleMarkerImg";
          img.src = absUrl(playerTankImageUrl);
          img.alt = "player marker";
          img.loading = "eager";
          img.decoding = "async";
          marker.appendChild(img);
        } else {
          marker.textContent = "YOU";
        }
        cell.appendChild(marker);
      } else if (botPos && botPos[0] === r && botPos[1] === c) {
        cell.classList.add("isBot");
        const marker = document.createElement("div");
        marker.className = "battleMarker isBot";
        if (botAiming) marker.classList.add("isAiming");
        if (botTankImageUrl) {
          const img = document.createElement("img");
          img.className = "battleMarkerImg";
          img.src = absUrl(botTankImageUrl);
          img.alt = "opponent marker";
          img.loading = "eager";
          img.decoding = "async";
          marker.appendChild(img);
        } else {
          marker.textContent = "OP";
        }
        cell.appendChild(marker);
      } else {
        cell.textContent = "";
      }
      map.appendChild(cell);
    }
  }
}

function renderBattleLog(text) {
  const log = qs("battleLog");
  if (!log) return;
  const raw = String(text || "").trim();
  if (!raw) {
    log.innerHTML = '<div class="battleLogItem">Событий пока нет.</div>';
    return;
  }
  const lines = raw.split("\n").map((s) => s.trim()).filter(Boolean).slice(-7);
  log.innerHTML = lines.map((line) => {
    let cls = "battleLogItem";
    if (line.includes("💥")) cls += " isHit";
    else if (line.includes("❌") || line.includes("пораж")) cls += " isWarn";
    else if (line.includes("🏆") || line.includes("Побед")) cls += " isWin";
    else if (line.includes("⏱")) cls += " isTime";
    return `<div class="${cls}">${line}</div>`;
  }).join("");
}

function hidePvpInviteModal() {
  const modal = qs("pvpInviteModal");
  if (modal) modal.style.display = "none";
  state.activeInviteId = null;
}

async function openInviteModal(inviteId) {
  if (!inviteId) return;
  state.activeInviteId = inviteId;
  const info = await api(`/api/battle/player/invites/by-id/${encodeURIComponent(inviteId)}`);
  const modal = qs("pvpInviteModal");
  if (!modal) return;
  qs("pvpInviteName").textContent = info.inviter_name || "Игрок";
  qs("pvpInviteTime").textContent = `${Math.max(0, Number(info.expires_in || 0))} сек`;
  modal.style.display = "flex";
}

async function updateOutgoingInviteState() {
  const sendBtn = qs("sendPvpInviteBtn");
  const cancelBtn = qs("cancelPvpInviteBtn");
  const hint = qs("pvpInviteHint");
  if (!sendBtn || !cancelBtn) return;
  try {
    const data = await api("/api/battle/player/invites/outgoing");
    const inv = data?.invite || null;
    state.outgoingInviteId = inv?.invite_id || null;
    const hasOutgoing = Boolean(state.outgoingInviteId);
    sendBtn.disabled = hasOutgoing;
    cancelBtn.style.display = hasOutgoing ? "block" : "none";
    if (hasOutgoing && hint) hint.textContent = `Приглашение активно (${Math.max(0, Number(inv.expires_in || 0))} сек).`;
    if (!hasOutgoing && hint && hint.textContent.includes("Приглашение активно")) hint.textContent = "";
  } catch {}
}

async function pollIncomingInvite() {
  try {
    const data = await api("/api/battle/player/invites/pending");
    const inv = data?.invite || null;
    if (inv && !state.webBattleActive && state.activeInviteId !== inv.invite_id) {
      await openInviteModal(inv.invite_id);
    }
  } catch {}
}

async function pollPendingNotice() {
  try {
    const notice = await api("/api/notifications/pending");
    if (notice?.message) {
      setError(String(notice.message));
      if (notice.play_sound) void playPurchaseSound();
    }
  } catch {}
}

function setHpBar(fillEl, textEl, hp, maxHp) {
  if (!fillEl || !textEl) return;
  const cur = Math.max(0, Number(hp || 0));
  const max = Math.max(1, Number(maxHp || 1));
  textEl.textContent = `${cur}/${max}`;
  fillEl.style.width = `${Math.max(0, Math.min(100, (cur / max) * 100))}%`;
}

function showDamageHint(side, amount) {
  const el = qs(side === "player" ? "battlePlayerDamageHint" : "battleBotDamageHint");
  if (!el) return;
  const dmg = Math.max(0, Number(amount || 0));
  if (!dmg) return;
  el.textContent = `-${dmg} урона`;
  el.style.display = "inline-flex";
  el.classList.add("isShow");
  const prevTimer = state.damageHintTimers[side];
  if (prevTimer) clearTimeout(prevTimer);
  state.damageHintTimers[side] = setTimeout(() => {
    el.classList.remove("isShow");
    el.style.display = "none";
    state.damageHintTimers[side] = null;
  }, 1100);
}

function showMarkerDamage(side, amount) {
  const dmg = Math.max(0, Number(amount || 0));
  if (!dmg) return;
  const marker = document.querySelector(`.battleMarker.${side === "player" ? "isPlayer" : "isBot"}`);
  if (!marker) return;
  marker.querySelector(".battleMarkerDamage")?.remove();
  const badge = document.createElement("div");
  badge.className = "battleMarkerDamage";
  badge.textContent = `-${dmg}`;
  marker.appendChild(badge);
  const prev = state.markerDamageTimers[side];
  if (prev) clearTimeout(prev);
  state.markerDamageTimers[side] = setTimeout(() => {
    badge.remove();
    state.markerDamageTimers[side] = null;
  }, 900);
}

function startCooldownTicker() {
  if (state.battleCooldownTimer) return;
  state.battleCooldownTimer = setInterval(() => {
    const st = state.battleLastState;
    const cd = qs("battleCooldown");
    if (!cd) return;
    const remaining = Number(st?.cooldown_remaining || 0);
    cd.textContent = remaining > 0 ? `Кулдаун: ${remaining}с` : "";
  }, 250);
}

function stopCooldownTicker() {
  if (!state.battleCooldownTimer) return;
  clearInterval(state.battleCooldownTimer);
  state.battleCooldownTimer = null;
}

function lockMainTabs(locked) {
  document.querySelectorAll(".mainTab").forEach((b) => {
    const isBattles = b.dataset.tab === "battles";
    const shouldLock = locked && !isBattles;
    b.disabled = shouldLock;
    b.classList.toggle("isDisabled", shouldLock);
  });
}

function setBattlesTitle(isInBattle, isPvp = false) {
  const title = qs("battlesTitle");
  if (!title) return;
  if (!isInBattle) {
    title.textContent = "ВЫБОР РЕЖИМА";
    return;
  }
  title.textContent = isPvp ? "БОЙ С ИГРОКОМ" : "БОЙ С БОТОМ";
}

function resetBattleUI() {
  const modes = qs("battleModesGrid");
  const botCard = qs("battleBotCard");
  const pvpCard = qs("battlePlayerCard");
  const arena = qs("battleArena");
  if (arena) arena.style.display = "none";
  if (botCard) botCard.style.display = "none";
  if (pvpCard) pvpCard.style.display = "none";
  if (modes) modes.style.display = "grid";
  const surrenderBtn = qs("battleSurrenderBtn");
  if (surrenderBtn) surrenderBtn.disabled = false;
  stopBattlePolling();
  lockMainTabs(false);
  setBattlesTitle(false);
  state.webBattleActive = false;
  state.battleEndModalKey = null;
  state.battleMapSignature = "";
  void stopBattleAmbient();
  void refreshLobbies();
}

function showBattleResultModal(win) {
  const modal = qs("battleResultModal");
  const title = qs("battleResultTitle");
  const banner = qs("battleResultBanner");
  const icon = qs("battleResultIcon");
  const text = qs("battleResultText");
  if (!modal || !title || !banner) return;
  const isWin = Boolean(win);
  title.textContent = isWin ? "ПОБЕДА" : "ПОРАЖЕНИЕ";
  banner.classList.toggle("isLose", !isWin);
  if (icon) icon.textContent = isWin ? "🏆" : "💥";
  if (text) {
    text.textContent = isWin
      ? "Ты уничтожил соперника! Отличный бой. Нажми вне окна, чтобы продолжить."
      : "Бой проигран, но это опыт. Нажми вне окна, чтобы вернуться и попробовать снова.";
  }
  modal.style.display = "flex";
}

function showRankUpModal(st) {
  const modal = qs("rankUpModal");
  const img = qs("rankUpImg");
  const name = qs("rankUpName");
  if (!modal || !img || !name) return;
  img.src = withCacheBust(absUrl(st.new_rank_image_url || ""));
  name.textContent = String(st.new_rank_name || "—");
  modal.style.display = "flex";
}

function hideRankUpModal() {
  const modal = qs("rankUpModal");
  if (modal) modal.style.display = "none";
}

function openSurrenderModal() {
  const modal = qs("surrenderModal");
  if (modal) modal.style.display = "flex";
}

function closeSurrenderModal() {
  const modal = qs("surrenderModal");
  if (modal) modal.style.display = "none";
}

async function hideBattleResultModal() {
  const modal = qs("battleResultModal");
  if (modal) modal.style.display = "none";
  // Tell server to drop finished battle so a new one can start immediately.
  void apiKeepalive("/api/battle/ack", { method: "POST" });
  resetBattleUI();
  if (state.token) {
    try { await refreshAll(); } catch (e) { setError(prettyError(e)); }
  }
}

async function battlePollOnce() {
  try {
    const st = await api("/api/battle/state");
    if (st.active) renderBattleState(st);
  } catch {}
}

function startBattlePolling() {
  if (state.battlePollTimer) return;
  state.battlePollTimer = setInterval(() => {
    if (state.activeTab !== "battles") return;
    void battlePollOnce();
  }, 2000);
}

function stopBattlePolling() {
  if (!state.battlePollTimer) return;
  clearInterval(state.battlePollTimer);
  state.battlePollTimer = null;
}

function renderBattleState(st) {
  const prev = state.battleLastState;
  state.battleLastState = st;
  if (st.active) {
    state.activeInviteId = null;
    hidePvpInviteModal();
  }
  const modes = qs("battleModesGrid");
  const botCard = qs("battleBotCard");
  const pvpCard = qs("battlePlayerCard");
  const arena = qs("battleArena");
  if (modes) modes.style.display = "none";
  if (botCard) botCard.style.display = "none";
  if (pvpCard) pvpCard.style.display = "none";
  if (arena) arena.style.display = "block";
  setBattlesTitle(true, Boolean(st.is_pvp));

  const mapSig = JSON.stringify([
    st.map_size,
    st.player_pos,
    st.bot_pos,
    st.player_tank_image_url,
    st.bot_tank_image_url,
    Boolean(st.aiming),
    Boolean(st.opponent_aiming),
  ]);
  if (state.battleMapSignature !== mapSig) {
    state.battleMapSignature = mapSig;
    renderBattleMap(
      st.map_size,
      st.player_pos,
      st.bot_pos,
      st.player_tank_image_url,
      st.bot_tank_image_url,
      Boolean(st.aiming),
      Boolean(st.opponent_aiming),
    );
  }

  setHpBar(qs("battlePlayerHpFill"), qs("battlePlayerHpText"), st.player_hp, st.player_hp_max);
  setHpBar(qs("battleBotHpFill"), qs("battleBotHpText"), st.bot_hp, st.bot_hp_max);
  const prevPlayerHp = Number(prev?.player_hp ?? st.player_hp ?? 0);
  const prevBotHp = Number(prev?.bot_hp ?? st.bot_hp ?? 0);
  const curPlayerHp = Number(st.player_hp ?? 0);
  const curBotHp = Number(st.bot_hp ?? 0);
  if (prev && curPlayerHp < prevPlayerHp) {
    const dmg = prevPlayerHp - curPlayerHp;
    showDamageHint("player", dmg);
    showMarkerDamage("player", dmg);
  }
  if (prev && curBotHp < prevBotHp) {
    const dmg = prevBotHp - curBotHp;
    showDamageHint("bot", dmg);
    showMarkerDamage("bot", dmg);
  }

  const pImg = qs("battlePlayerTankImg");
  if (pImg && st.player_tank_image_url) {
    const next = absUrl(st.player_tank_image_url);
    if (pImg.src !== next) pImg.src = next;
  }
  const bImg = qs("battleBotTankImg");
  if (bImg && st.bot_tank_image_url) {
    const next = absUrl(st.bot_tank_image_url);
    if (bImg.src !== next) bImg.src = next;
  }
  const pW = qs("battlePlayerWeapon");
  if (pW) pW.textContent = `🔫 ${st.player_weapon_name || state.profile?.weapon || "—"}`;
  const pH = qs("battlePlayerHull");
  if (pH) {
    const turnMark = st.is_pvp ? (st.is_player_turn ? " • Ваш ход" : "") : "";
    pH.textContent = `🛡 ${st.player_hull_name || state.profile?.hull || "—"}${turnMark}`;
  }
  const bW = qs("battleBotWeapon");
  if (bW) bW.textContent = `🔫 ${st.bot_weapon_name || "—"}`;
  const aimState = qs("battleAimState");
  if (aimState) {
    aimState.style.display = st.aiming ? "inline-flex" : "none";
    aimState.classList.toggle("isActive", Boolean(st.aiming));
  }
  const oppTitle = qs("battleOpponentTitle");
  if (oppTitle) oppTitle.textContent = st.is_pvp ? String(st.opponent_name || "Соперник") : "ПРОТИВНИК";
  const bH = qs("battleBotHull");
  if (bH) {
    const enemyTurn = st.is_pvp ? (!st.is_player_turn ? " • Ходит сейчас" : "") : "";
    bH.textContent = `🛡 ${st.bot_hull_name || "—"}${enemyTurn}`;
  }

  renderBattleLog(st.log || "");

  const cd = qs("battleCooldown");
  if (cd) {
    const remaining = Number(st.cooldown_remaining || 0);
    cd.textContent = remaining > 0 ? `Кулдаун: ${remaining}с` : "";
  }
  const isOnCooldown = Number(st.cooldown_remaining || 0) > 0;
  const isLockedByTurn = Boolean(st.is_pvp) && !Boolean(st.is_player_turn) && !Boolean(st.game_over);
  const shootBtn = qs("battleShootBtn");
  if (shootBtn) shootBtn.disabled = isOnCooldown || isLockedByTurn || Boolean(st.game_over);
  // Disable move buttons if cooldown/turn locked/game over, or if movement would go out of bounds.
  const size = Number(st.map_size || 5);
  const pos = Array.isArray(st.player_pos) ? st.player_pos : null;
  const r = pos ? Number(pos[0]) : 0;
  const c = pos ? Number(pos[1]) : 0;
  const blocked = {
    up: pos ? r <= 0 : false,
    down: pos ? r >= (size - 1) : false,
    left: pos ? c <= 0 : false,
    right: pos ? c >= (size - 1) : false,
  };
  document.querySelectorAll("[data-battle-move]").forEach((b) => {
    const dir = String(b.getAttribute("data-battle-move") || "");
    const outOfBounds = Boolean(blocked[dir]);
    b.disabled = isOnCooldown || isLockedByTurn || Boolean(st.game_over) || outOfBounds;
    b.classList.toggle("isDisabled", b.disabled);
  });

  // Aim button (only if player weapon supports it; backend will reject otherwise, but we hide by default)
  const aimBtn = qs("battleAimBtn");
  if (aimBtn) {
    // show aim toggle if player has Shaft (or any weapon with aiming) — simplest client heuristic:
    const hasAiming = state.profile?.weapon === "shaft";
    aimBtn.style.display = hasAiming ? "block" : "none";
    aimBtn.textContent = st.aiming ? "Сбросить прицел" : "Прицел";
    aimBtn.disabled = Boolean(st.cooldown_remaining > 0) || isLockedByTurn || Boolean(st.game_over);
  }

  state.webBattleActive = Boolean(st.active) && !Boolean(st.game_over);
  startCooldownTicker();
  if (state.webBattleActive) {
    lockMainTabs(true);
    startBattlePolling();
    void startBattleAmbient();
  }

  const turn = qs("battleTurnTimer");
  if (turn) {
    const t = Number(st.turn_remaining || 0);
    const turnPrefix = st.is_pvp ? (st.is_player_turn ? "Ваш ход" : "Ход соперника") : "Время хода";
    turn.textContent = t > 0 ? `${turnPrefix}: ${t}с` : "";
  }

  if (st.game_over) {
    state.webBattleActive = false;
    stopCooldownTicker();
    stopBattlePolling();
    lockMainTabs(false);
    void stopBattleAmbient();
    if (aimBtn) aimBtn.disabled = true;
    const surrenderBtn = qs("battleSurrenderBtn");
    if (surrenderBtn) surrenderBtn.disabled = true;
    const endKey = `${st.winner || ""}|${st.rank_up ? "1" : "0"}|${String(st.log || "").length}`;
    if (state.battleEndModalKey !== endKey) {
      state.battleEndModalKey = endKey;
      if (st.rank_up) {
        showRankUpModal(st);
      } else {
        showBattleResultModal(st.winner === "player");
      }
    }
  } else {
    state.battleEndModalKey = null;
    const surrenderBtn = qs("battleSurrenderBtn");
    if (surrenderBtn) surrenderBtn.disabled = false;
  }
}

async function battleFetchState() {
  const st = await api("/api/battle/state");
  if (st.active) {
    if (state.activeTab !== "battles") await showTab("battles", { force: true });
    renderBattleState(st);
  }
  return st;
}

async function battleStartBot() {
  const st = await api("/api/battle/bot/start", { method: "POST" });
  await showTab("battles", { force: true });
  renderBattleState(st);
}

async function battleSendAction(action, direction = null) {
  const payload = { action, ...(direction ? { direction } : {}) };
  const st = await api("/api/battle/action", { method: "POST", body: JSON.stringify(payload) });
  renderBattleState(st);
}

async function forfeitBattleIfActive() {
  if (!state.webBattleActive) return;
  try { await apiKeepalive("/api/battle/forfeit", { method: "POST" }); } catch {}
  state.webBattleActive = false;
  void stopBattleAmbient();
}

function bindUI() {
  let surrenderBusy = false;
  async function handleSurrender() {
    if (surrenderBusy) return;
    surrenderBusy = true;
    try {
      await battleSendAction("surrender");
    } catch (e) {
      setError(prettyError(e));
    } finally {
      surrenderBusy = false;
    }
  }

  qs("tabs")?.addEventListener("click", async (e) => {
    const b = e.target.closest(".mainTab");
    if (!b) return;
    await showTab(b.dataset.tab);
  });

  // PvP lobby UI (create / list / join)
  qs("createLobbyBtn")?.addEventListener("click", () => {
    if (state.webBattleActive) return;
    openCreateLobbyModal();
  });
  qs("createLobbyCancelBtn")?.addEventListener("click", closeCreateLobbyModal);
  qs("createLobbyModal")?.addEventListener("click", (e) => { if (e.target === qs("createLobbyModal")) closeCreateLobbyModal(); });
  qs("lobbyAllowAllRanks")?.addEventListener("change", () => {
    const allow = Boolean(qs("lobbyAllowAllRanks")?.checked);
    const rangeWrap = qs("lobbyRankRange");
    if (!rangeWrap) return;
    rangeWrap.style.opacity = allow ? "0.45" : "1";
    rangeWrap.style.pointerEvents = allow ? "none" : "auto";
  });
  qs("createLobbyConfirmBtn")?.addEventListener("click", async () => {
    const btn = qs("createLobbyConfirmBtn");
    if (!btn) return;
    btn.disabled = true;
    try {
      await createLobbyFromModal();
      showPurchaseLikeModal({
        title: "БОЙ СОЗДАН",
        label: "Ждем соперника (3 минуты).",
        icon: "⚔",
        name: "Открытый бой",
        price: "",
      });
      void playPurchaseSound();
    } catch (e) {
      setError(prettyError(e));
    } finally {
      btn.disabled = false;
    }
  });

  qs("battleLobbiesList")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lobby]");
    if (!btn) return;
    const id = String(btn.getAttribute("data-lobby") || "");
    const lb = (Array.isArray(state.lobbies) ? state.lobbies : []).find((x) => String(x.lobby_id) === id);
    if (!lb) return;
    openJoinLobbyModal(lb);
  });
  qs("joinLobbyCancelBtn")?.addEventListener("click", closeJoinLobbyModal);
  qs("joinLobbyModal")?.addEventListener("click", (e) => { if (e.target === qs("joinLobbyModal")) closeJoinLobbyModal(); });
  qs("joinLobbyConfirmBtn")?.addEventListener("click", async () => {
    if (!state.joinLobbyId) return;
    const btn = qs("joinLobbyConfirmBtn");
    if (!btn) return;
    btn.disabled = true;
    try {
      await api(`/api/battle/lobbies/${encodeURIComponent(state.joinLobbyId)}/join`, { method: "POST" });
      closeJoinLobbyModal();
      await refreshLobbies();
      await battleFetchState();
      clearError();
    } catch (e) {
      setError(prettyError(e));
      await refreshLobbies();
    } finally {
      btn.disabled = false;
    }
  });
  qs("leadersSortTabs")?.addEventListener("click", async (e) => {
    const btn = e.target.closest(".leadersSortBtn");
    if (!btn) return;
    const nextSort = String(btn.dataset.sort || "experience");
    if (nextSort === state.leaderboardSort) return;
    state.leaderboardSort = nextSort;
    try {
      await refreshLeaderboard();
      clearError();
    } catch (err) {
      setError(prettyError(err));
    }
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
    qs("shopCategory")
      ?.querySelectorAll(".shopCat")
      .forEach((it) => it.classList.toggle("isActive", it.dataset.cat === state.shopCategory));
    renderShop();
  });
  qs("equipBtn")?.addEventListener("click", async () => {
    const key = currentGarageKey();
    const equipped = state.garageCategory === "weapon" ? state.profile?.weapon : state.profile?.hull;
    if (key === equipped) return;
    if (!isUnlocked(key)) {
      qs("garageHint").textContent = "Сначала разблокируй этот предмет.";
      updateGarageEquipButton();
      return;
    }
    const weapon = state.garageCategory === "weapon" ? key : state.selectedWeapon;
    const hull = state.garageCategory === "hull" ? key : state.selectedHull;
    try {
      await api("/api/garage/set_tank", { method: "POST", body: JSON.stringify({ weapon, hull }) });
      qs("garageHint").textContent = "";
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
      qs("containerResult").textContent = "";
    } finally {
      btn.disabled = false;
    }
  });

  // Активация промокодов (только в WebApp)
  const promoForm = qs("promoForm");
  const promoInput = qs("promoCodeInput");
  const promoBtn = qs("promoSubmitBtn");
  if (promoForm && promoInput && promoBtn) {
    const onSubmitPromo = async (e) => {
      if (e) e.preventDefault();
      const code = String(promoInput.value || "").trim();
      if (!code) {
        setError("Введите промокод.");
        return;
      }
      promoBtn.disabled = true;
      try {
        const res = await api("/api/promo/redeem", {
          method: "POST",
          body: JSON.stringify({ code }),
        });
        qs("promoResult").textContent = String(res.message || "Промокод успешно активирован.");

        // Show a purchase-like modal for promo rewards
        const rewardType = String(res.reward_type || "").toLowerCase();
        const rewardKey = String(res.reward_key || "");
        const rewardAmount = Number(res.reward_amount || 0);
        let rewardName = "Награда";
        let rewardValue = "";
        if (rewardType === "crystals") {
          rewardName = "Кристаллы";
          rewardValue = `x${rewardAmount}`;
        } else if (rewardType === "containers") {
          rewardName = "Контейнеры";
          rewardValue = `x${rewardAmount}`;
        } else if (rewardType === "unlock") {
          rewardName = "Разблокировка";
          rewardValue = NAMES[rewardKey] || rewardKey || "Предмет";
        }
        showPurchaseLikeModal({
          title: "ПРОМОКОД АКТИВИРОВАН",
          label: "Вы получили:",
          icon: "🎟",
          name: rewardName,
          price: rewardValue,
        });

        await refreshAll();
        clearError();
        promoInput.value = "";
      } catch (e2) {
        qs("promoResult").textContent = "";
        setError(prettyError(e2));
      } finally {
        promoBtn.disabled = false;
      }
    };
    promoForm.addEventListener("submit", onSubmitPromo);
    promoBtn.addEventListener("click", onSubmitPromo);
  }
  qs("refreshBtn")?.addEventListener("click", async () => {
    try { await refreshAll(); clearError(); } catch (e) { setError(prettyError(e)); }
  });
  qs("rewardModal")?.addEventListener("click", (e) => { if (e.target === qs("rewardModal")) hideRewardModal(); });
  qs("errorModal")?.addEventListener("click", (e) => { if (e.target === qs("errorModal")) hideErrorModal(); });
  qs("purchaseCloseBtn")?.addEventListener("click", hidePurchaseModal);
  qs("purchaseCloseTopBtn")?.addEventListener("click", hidePurchaseModal);
  qs("purchaseModal")?.addEventListener("click", (e) => { if (e.target === qs("purchaseModal")) hidePurchaseModal(); });
  qs("viewContainerRewardsBtn")?.addEventListener("click", showLootModal);
  qs("lootCloseTopBtn")?.addEventListener("click", hideLootModal);
  qs("lootModal")?.addEventListener("click", (e) => { if (e.target === qs("lootModal")) hideLootModal(); });
  qs("lootFilters")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".lootFilterBtn");
    if (!btn) return;
    state.lootFilter = btn.dataset.rarity || "all";
    qs("lootFilters")?.querySelectorAll(".lootFilterBtn").forEach((el) => el.classList.toggle("isActive", el === btn));
    renderContainerLoot();
  });

  qs("battleBotModeCard")?.addEventListener("click", () => {
    const modes = qs("battleModesGrid");
    const botCard = qs("battleBotCard");
    const pvpCard = qs("battlePlayerCard");
    const arena = qs("battleArena");
    if (modes) modes.style.display = "none";
    if (arena) arena.style.display = "none";
    if (pvpCard) pvpCard.style.display = "none";
    if (botCard) botCard.style.display = "flex";
  });

  qs("battlePlayerModeCard")?.addEventListener("click", () => {
    const modes = qs("battleModesGrid");
    const botCard = qs("battleBotCard");
    const pvpCard = qs("battlePlayerCard");
    const arena = qs("battleArena");
    if (modes) modes.style.display = "none";
    if (arena) arena.style.display = "none";
    if (botCard) botCard.style.display = "none";
    if (pvpCard) pvpCard.style.display = "flex";
  });

  qs("backToModesBtn")?.addEventListener("click", () => {
    const modes = qs("battleModesGrid");
    const botCard = qs("battleBotCard");
    const pvpCard = qs("battlePlayerCard");
    const arena = qs("battleArena");
    if (botCard) botCard.style.display = "none";
    if (pvpCard) pvpCard.style.display = "none";
    if (arena) arena.style.display = "none";
    if (modes) modes.style.display = "grid";
  });
  qs("backToModesFromPvpBtn")?.addEventListener("click", () => {
    const modes = qs("battleModesGrid");
    const botCard = qs("battleBotCard");
    const pvpCard = qs("battlePlayerCard");
    const arena = qs("battleArena");
    if (botCard) botCard.style.display = "none";
    if (pvpCard) pvpCard.style.display = "none";
    if (arena) arena.style.display = "none";
    if (modes) modes.style.display = "grid";
  });

  qs("startBotBattleBtn")?.addEventListener("click", async () => {
    try {
      await battleStartBot();
      clearError();
    } catch (e) {
      setError(prettyError(e));
    }
  });

  qs("sendPvpInviteBtn")?.addEventListener("click", async () => {
    const input = qs("pvpUsernameInput");
    const hint = qs("pvpInviteHint");
    const btn = qs("sendPvpInviteBtn");
    const username = String(input?.value || "").trim();
    if (!username) {
      if (hint) hint.textContent = "Введите @username игрока.";
      return;
    }
    btn.disabled = true;
    try {
      await api("/api/battle/player/invite", {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      await updateOutgoingInviteState();
      if (hint) hint.textContent = "Приглашение отправлено. Ждем ответ игрока (до 2 минут).";
      clearError();
    } catch (e) {
      if (hint) hint.textContent = "";
      setError(prettyError(e));
    } finally {
      btn.disabled = false;
    }
  });
  qs("cancelPvpInviteBtn")?.addEventListener("click", async () => {
    if (!state.outgoingInviteId) return;
    try {
      await api(`/api/battle/player/invites/${encodeURIComponent(state.outgoingInviteId)}/cancel`, { method: "POST" });
      state.outgoingInviteId = null;
      await updateOutgoingInviteState();
      const hint = qs("pvpInviteHint");
      if (hint) hint.textContent = "Приглашение отменено.";
    } catch (e) {
      setError(prettyError(e));
    }
  });

  document.querySelectorAll("[data-battle-move]")?.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const dir = btn.getAttribute("data-battle-move");
      try { await battleSendAction("move", dir); } catch (e) { setError(prettyError(e)); }
    });
  });

  qs("battleShootBtn")?.addEventListener("click", async () => {
    try { await battleSendAction("shoot"); } catch (e) { setError(prettyError(e)); }
  });

  qs("battleAimBtn")?.addEventListener("click", async () => {
    const aiming = Boolean(state.battleLastState?.aiming);
    try { await battleSendAction(aiming ? "cancel_aim" : "aim"); } catch (e) { setError(prettyError(e)); }
  });

  qs("battleSurrenderBtn")?.addEventListener("click", openSurrenderModal);
  qs("surrenderCancelBtn")?.addEventListener("click", closeSurrenderModal);
  qs("surrenderConfirmBtn")?.addEventListener("click", async () => {
    closeSurrenderModal();
    await handleSurrender();
  });
  qs("surrenderModal")?.addEventListener("click", (e) => {
    if (e.target === qs("surrenderModal")) closeSurrenderModal();
  });

  qs("battleResultModal")?.addEventListener("click", (e) => { if (e.target === qs("battleResultModal")) hideBattleResultModal(); });

  qs("rankUpModal")?.addEventListener("click", (e) => {
    if (e.target !== qs("rankUpModal")) return;
    hideRankUpModal();
    void hideBattleResultModal();
  });

  qs("pvpInviteCloseTopBtn")?.addEventListener("click", hidePvpInviteModal);
  qs("pvpInviteModal")?.addEventListener("click", (e) => { if (e.target === qs("pvpInviteModal")) hidePvpInviteModal(); });
  qs("pvpDeclineBtn")?.addEventListener("click", async () => {
    if (!state.activeInviteId) return;
    try {
      await api(`/api/battle/player/invites/${encodeURIComponent(state.activeInviteId)}/decline`, { method: "POST" });
      hidePvpInviteModal();
      state.activeInviteId = null;
      setError("Вы отклонили приглашение в бой.");
    } catch (e) {
      setError(prettyError(e));
    }
  });
  qs("pvpAcceptBtn")?.addEventListener("click", async () => {
    if (!state.activeInviteId) return;
    try {
      await api(`/api/battle/player/invites/${encodeURIComponent(state.activeInviteId)}/accept`, { method: "POST" });
      hidePvpInviteModal();
      state.activeInviteId = null;
      await updateOutgoingInviteState();
      await battleFetchState();
    } catch (e) {
      setError(prettyError(e));
    }
  });

  window.addEventListener("keydown", async (e) => {
    if (!state.webBattleActive || state.activeTab !== "battles") return;
    if (e.defaultPrevented) return;

    const target = e.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
    if (target instanceof HTMLElement && target.isContentEditable) return;

    const key = String(e.key || "").toLowerCase();
    const code = String(e.code || "");
    const dirByCode = {
      KeyW: "up",
      KeyA: "left",
      KeyS: "down",
      KeyD: "right",
      ArrowUp: "up",
      ArrowLeft: "left",
      ArrowDown: "down",
      ArrowRight: "right",
    };
    const dirByKey = {
      w: "up",
      a: "left",
      s: "down",
      d: "right",
      "ц": "up",
      "ф": "left",
      "ы": "down",
      "в": "right",
      arrowup: "up",
      arrowleft: "left",
      arrowdown: "down",
      arrowright: "right",
    };
    const dir = dirByCode[code] || dirByKey[key];
    const isShoot = code === "KeyF" || key === "f" || key === "а";
    const isAimToggle = code === "KeyG" || key === "g" || key === "п";
    if (!dir && !isShoot && !isAimToggle) return;

    e.preventDefault();
    try {
      if (dir) {
        await battleSendAction("move", dir);
      } else if (isShoot) {
        if (e.repeat) return;
        await battleSendAction("shoot");
      } else if (isAimToggle) {
        if (e.repeat) return;
        const aimingNow = Boolean(state.battleLastState?.aiming);
        await battleSendAction(aimingNow ? "cancel_aim" : "aim");
      }
    } catch (err) {
      const msg = String(err?.message || "").toLowerCase();
      if (
        !msg.includes("ход другого игрока")
        && !msg.includes("cooldown")
        && !msg.includes("кулдаун")
        && !msg.includes("не поддерживает прицеливание")
      ) {
        setError(prettyError(err));
      }
    }
  });

  // Don't auto-forfeit on hide/reload: active battle must be restorable on next open.
  // If WebApp is being closed/left, notify backend with a short grace window.
  const sendDisconnectIfActive = () => {
    if (!state.webBattleActive) return;
    try { void apiKeepalive("/api/battle/disconnect", { method: "POST" }); } catch {}
  };
  window.addEventListener("pagehide", sendDisconnectIfActive);
  // NOTE: do not treat simple app minimize/background as a disconnect.
}

async function main() {
  initMusic();
  bindUI();
  await showTab("profile");
  try {
    await initAuth();
    try { await api("/api/session/ping", { method: "POST" }); } catch {}
    try {
      const inviteId = new URL(window.location.href).searchParams.get("invite");
      if (inviteId) await openInviteModal(inviteId);
    } catch {}
    await refreshAll();
    await refreshLobbies();
    await updateOutgoingInviteState();
    await pollIncomingInvite();
    await pollPendingNotice();
    if (!state.invitePollTimer) {
      state.invitePollTimer = setInterval(() => {
        void api("/api/session/ping", { method: "POST" }).catch(() => {});
        void updateOutgoingInviteState();
        void pollIncomingInvite();
        void pollPendingNotice();
        void refreshLobbies();
        // So inviter enters PvP without manual page reload when invite gets accepted.
        void battlePollOnce();
      }, 1500);
    }
    clearError();
    await switchTrack();
    if (state.bgMusicEnabled) await applyMusic();

    // Restore battle UI if server still has an active battle
    try {
      const st = await battleFetchState();
      if (st?.active) {
        // We are back (reload/open), cancel pending disconnect forfeit.
        try { await apiKeepalive("/api/battle/reconnect", { method: "POST" }); } catch {}
      }
    } catch {}
  } catch (e) {
    setError(prettyError(e));
  }
}

main();
