/* global Telegram */

const API_BASE_URL = String(window.API_BASE_URL || "").trim().replace(/\/+$/, "");
const MUSIC_STORAGE_KEY = "bg_music_enabled";
const MUSIC_VOLUME_STORAGE_KEY = "bg_music_volume";
const QUESTS_SEEN_DAY_KEY_STORAGE = "quests_seen_day_key";
const DEFAULT_MUSIC_VOLUME = 0.35;
const LOCALES = ["ru", "en"];
const TAB_MUSIC = {
  profile: "/sounds/music/background_music.mp3",
  battles: "/sounds/music/battle_music.mp3",
  garage: "/sounds/music/background_music.mp3",
  shop: "/sounds/music/background_music.mp3",
  containers: "/sounds/music/background_music.mp3",
  quests: "/sounds/music/background_music.mp3",
};
const PURCHASE_SOUND_PATH = "/sounds/notify.mp3";
const BATTLE_AMBIENT_PATH = "/sounds/ambient/space_ambient.mp3";
const CONTAINER_CLOSED_IMAGE = "/images/webapp/container.png";
const PREMIUM_BADGE_PATH = "/images/webapp/premium_ribbon.png";
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
  ricochet: "/images/webapp/ricochet.png",
  molot: "/images/webapp/molot.png",
  titan: "/images/webapp/titan.png",
  paladin: "/images/webapp/paladin.png",
  dictator: "/images/webapp/dictator.png",
};
const RARITY_LABELS = {
  rare: "Редкое",
  epic: "Эпическое",
  ultrarare: "Ультраредкое",
  legendary: "Легендарное",
};
const RARITY_LABELS_EN = {
  rare: "Rare",
  epic: "Epic",
  ultrarare: "Ultra Rare",
  legendary: "Legendary",
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
    chance: "3%",
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
    key: "ricochet",
    type: "weapon",
    name: "Рикошет",
    chance: "1%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.ricochet,
    description: "Легендарная пушка с рикошетом от укрытий и стабильным уроном.",
  },
  {
    key: "molot",
    type: "weapon",
    name: "Молот",
    chance: "2%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.molot,
    description: "Ультраредкая пушка: вблизи огромный урон, вдали стабильные 10 урона.",
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
    key: "dictator",
    type: "hull",
    name: "Диктатор",
    chance: "5%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.dictator,
    description: "Эпический корпус с 150 HP без дополнительных способностей.",
  },
  {
    key: "paladin",
    type: "hull",
    name: "Паладин",
    chance: "1%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.paladin,
    description: "Легендарный штурмовой корпус с щитом и увеличенной мобильностью.",
  },
  {
    key: "crystals_1000",
    type: "crystals",
    name: "Кристаллы x1000",
    chance: "5%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Эпическая награда с крупной пачкой кристаллов.",
  },
  {
    key: "crystals_10000",
    type: "crystals",
    name: "Кристаллы x10000",
    chance: "1.5%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Ультраредкая награда с огромным количеством кристаллов.",
  },
  {
    key: "crystals_20000",
    type: "crystals",
    name: "Кристаллы x20000",
    chance: "0.2%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Легендарная кристальная награда с максимальной ценностью.",
  },
  {
    key: "crystals_50",
    type: "crystals",
    name: "Кристаллы x50",
    chance: "11.72%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с небольшим количеством кристаллов.",
  },
  {
    key: "crystals_100",
    type: "crystals",
    name: "Кристаллы x100",
    chance: "11.72%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда со средним количеством кристаллов.",
  },
  {
    key: "crystals_150",
    type: "crystals",
    name: "Кристаллы x150",
    chance: "11.72%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с хорошим количеством кристаллов.",
  },
  {
    key: "crystals_200",
    type: "crystals",
    name: "Кристаллы x200",
    chance: "11.72%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с крупной пачкой кристаллов.",
  },
  {
    key: "crystals_250",
    type: "crystals",
    name: "Кристаллы x250",
    chance: "11.72%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с большим количеством кристаллов.",
  },
  {
    key: "crystals_300",
    type: "crystals",
    name: "Кристаллы x300",
    chance: "11.72%",
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
  quests: null,
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
  battleAudioSeq: 0,
  battleBgResumeTime: 0,
  battleBgWasPlaying: false,
  battleMusicStartedForId: null,
  battleMusicDelayTimer: null,
  battleHintBattleId: null,
  battlePlayerHintUntil: 0,
  battleHintHideTimer: null,
  rewardAnimating: false,
  webBattleActive: false,
  battleCooldownTimer: null,
  battleLastState: null,
  avatarUrl: null,
  battlePollTimer: null,
  activeInviteId: null,
  activeInviteExpireAt: 0,
  inviteCountdownTimer: null,
  outgoingInviteId: null,
  invitePollTimer: null,
  battleMapSignature: "",
  damageHintTimers: { player: null, bot: null },
  markerDamageTimers: { player: null, bot: null },
  hudAvatarSig: "",
  leaderboard: null,
  leaderboardSort: "experience",
  leaderboardLimit: 100,
  ranks: null,
  lobbies: null,
  lobbyTicker: null,
  lastLobbiesFetchAt: 0,
  lobbiesPollTimer: null,
  /** Пока ждём соперника в созданном лобби — опрашиваем бой, чтобы зайти в арену без перезагрузки. */
  pendingHostLobbyId: null,
  pendingHostLobbyMissingSince: 0,
  joinLobbyId: null,
  globalChatAfterId: 0,
  battleChatAfterId: 0,
  currentBattleId: null,
  rankUpModalBattleId: null,
  battleOutcomeModalBattleId: null,
  battleAmbientStoppedForBattleId: null,
  battleResultAckBattleId: null,
  battleResultClosing: false,
  battleResultShownBattleId: null,
  battleAutoCloseResultId: null,
  settings: null,
  settingsTab: "privacy",
  lastQuestSyncAt: 0,
  lastQuestZeroForceAt: 0,
  questsSeenDayKey: "",
  locale: "en",
  confirmOnOk: null,
  damageAcc: null,
  markerDamageAcc: null,
  paladinDashMode: false,
};

const I18N = {
  ru: {
    tab_profile: "Профиль",
    tab_leaders: "Лидеры",
    tab_battles: "Бои",
    tab_garage: "Гараж",
    tab_shop: "Магазин",
    tab_containers: "Контейнеры",
    tab_quests: "Квесты",
    tab_settings: "Настройки",
    quests_title: "ЕЖЕДНЕВНЫЕ КВЕСТЫ",
    reset_prefix: "До обновления:",
    quest_chip_premium: "Премиум",
    quest_chip_common: "Обычный",
    quest_status_premium_only: "Доступно только с премиумом",
    quest_status_claimed: "Награда получена",
    quest_status_ready: "Готово к получению",
    quest_status_progress: "В процессе",
    quest_claim_take: "Забрать",
    quest_claimed: "Получено",
    err_open_in_telegram: "Открой мини-апп из Telegram.",
    err_initdata_missing: "initData не получен. Открой WebApp кнопкой из бота, а не обычной ссылкой в браузере.",
    battle_cooldown: "Кулдаун",
    battles_title_modes: "ВЫБОР РЕЖИМА",
    battles_title_pvp: "БОЙ С ИГРОКОМ",
    battles_title_bot: "БОЙ С БОТОМ",
    battle_victory: "ПОБЕДА",
    battle_defeat: "ПОРАЖЕНИЕ",
    notice_title: "УВЕДОМЛЕНИЕ",
    damage_unit: "урона",
    lobby_empty: "Пока нет открытых боёв. Создай свой!",
    battle_no_events: "Событий пока нет.",
    battle_you: "YOU",
    battle_op: "OP",
  },
  en: {
    tab_profile: "Profile",
    tab_leaders: "Leaders",
    tab_battles: "Battles",
    tab_garage: "Garage",
    tab_shop: "Shop",
    tab_containers: "Containers",
    tab_quests: "Quests",
    tab_settings: "Settings",
    quests_title: "DAILY QUESTS",
    reset_prefix: "Resets in:",
    quest_chip_premium: "Premium",
    quest_chip_common: "Common",
    quest_status_premium_only: "Premium only",
    quest_status_claimed: "Reward claimed",
    quest_status_ready: "Ready to claim",
    quest_status_progress: "In progress",
    quest_claim_take: "Claim",
    quest_claimed: "Claimed",
    err_open_in_telegram: "Open this mini app from Telegram.",
    err_initdata_missing: "initData is missing. Open the WebApp using the bot button (not a regular browser link).",
    battle_cooldown: "Cooldown",
    battles_title_modes: "MODE SELECT",
    battles_title_pvp: "BATTLE VS PLAYER",
    battles_title_bot: "BATTLE VS BOT",
    battle_victory: "VICTORY",
    battle_defeat: "DEFEAT",
    notice_title: "NOTICE",
    damage_unit: "damage",
    lobby_empty: "No open battles yet. Create yours!",
    battle_no_events: "No events yet.",
    battle_you: "YOU",
    battle_op: "OP",
  },
};

function tr(key) {
  const loc = LOCALES.includes(state.locale) ? state.locale : "en";
  return (I18N[loc] && I18N[loc][key]) || I18N.en[key] || key;
}

function trText(ru, en) {
  return state.locale === "en" ? en : ru;
}

function trRankName(name) {
  const raw = String(name || "").trim();
  if (!raw) return state.locale === "en" ? "Rank" : "Звание";
  const map = {
    "Новобранец": "Recruit",
    "Рядовой": "Private",
    "Ефрейтор": "Corporal",
    "Капрал": "Master Corporal",
    "Сержант": "Sergeant",
    "Штаб-сержант": "Staff Sergeant",
    "Мастер-сержант": "Master Sergeant",
    "Первый сержант": "First Sergeant",
    "Сержант-майор": "Sergeant Major",
    "Уорент-офицер 1": "Warrant Officer 1",
    "Уорент-офицер 2": "Warrant Officer 2",
    "Уорент-офицер 3": "Warrant Officer 3",
    "Уорент-офицер 4": "Warrant Officer 4",
    "Уорент-офицер 5": "Warrant Officer 5",
    "Младший лейтенант": "Second Lieutenant",
    "Лейтенант": "Lieutenant",
    "Старший лейтенант": "First Lieutenant",
    "Капитан": "Captain",
    "Майор": "Major",
    "Подполковник": "Lieutenant Colonel",
    "Полковник": "Colonel",
    "Бригадир": "Brigadier",
    "Генерал-майор": "Major General",
    "Генерал-лейтенант": "Lieutenant General",
    "Генерал": "General",
    "Маршал": "Marshal",
    "Фельдмаршал": "Field Marshal",
    "Командор": "Commander",
    "Генералиссимус": "Generalissimo",
  };
  return state.locale === "en" ? (map[raw] || raw) : raw;
}

function applyStaticI18n() {
  // Tabs
  document.querySelectorAll(".mainTab").forEach((btn) => {
    const tab = String(btn.dataset.tab || "");
    const map = {
      profile: "tab_profile",
      leaders: "tab_leaders",
      battles: "tab_battles",
      garage: "tab_garage",
      shop: "tab_shop",
      containers: "tab_containers",
      quests: "tab_quests",
      settings: "tab_settings",
    };
    const key = map[tab];
    if (!key) return;
    // Preserve badge span for quests
    const badge = btn.querySelector("#questsTabAlert");
    btn.textContent = tr(key) + (tab === "quests" ? " " : "");
    if (tab === "quests" && badge) btn.appendChild(badge);
  });
  // Quests title
  const panel = document.getElementById("panelQuests");
  const title = panel?.querySelector(".leadersTitle");
  if (title) title.textContent = tr("quests_title");
}

const NAMES = {
  smoky: "Смоки",
  railgun: "Рельса",
  shaft: "Шафт",
  thunder: "Гром",
  ricochet: "Рикошет",
  molot: "Молот",
  hunter: "Хантер",
  titan: "Титан",
  paladin: "Паладин",
  dictator: "Диктатор",
};
const NAMES_EN = {
  smoky: "Smoky",
  railgun: "Railgun",
  shaft: "Shaft",
  thunder: "Thunder",
  ricochet: "Ricochet",
  molot: "Molot",
  hunter: "Hunter",
  titan: "Titan",
  paladin: "Paladin",
  dictator: "Dictator",
  crystals_1000: "Crystals x1000",
  crystals_10000: "Crystals x10000",
  crystals_20000: "Crystals x20000",
  crystals_50: "Crystals x50",
  crystals_100: "Crystals x100",
  crystals_150: "Crystals x150",
  crystals_200: "Crystals x200",
  crystals_250: "Crystals x250",
  crystals_300: "Crystals x300",
};
const SHOP_CATEGORY_LABELS = { weapon: "Пушка", hull: "Корпус", premium: "Премиум подписка" };
const SHOP_PREMIUM_META = {
  premium_1d: {
    title: "ПРЕМИУМ НА 1 ДЕНЬ",
    subtitle: "Ускоряй прогресс, усиливай награды и продлевай подписку без ограничений.",
    duration: "1 день",
    accent: "Быстрый старт",
    icon: "👑",
  },
  premium_3d: {
    title: "ПРЕМИУМ НА 3 ДНЯ",
    subtitle: "Оптимальный вариант на несколько игровых сессий подряд.",
    duration: "3 дня",
    accent: "Популярный выбор",
    icon: "💎",
  },
  premium_10d: {
    title: "ПРЕМИУМ НА 10 ДНЕЙ",
    subtitle: "Максимальная выгода для активной игры и длинная суммируемая подписка.",
    duration: "10 дней",
    accent: "Максимум выгоды",
    icon: "⚡",
  },
};
const DESCRIPTIONS = {
  smoky: "Базовая пушка со стабильным уроном.",
  railgun: "Дальнобойная пушка с высоким уроном.",
  shaft: "Снайперская пушка для точных попаданий.",
  thunder: "Мощный залп по площади.",
  ricochet: "Сбалансированная скорострельная пушка.",
  molot: "Вблизи почти гарантированно попадает и наносит огромный урон, вдали наносит 10 урона.",
  hunter: "Универсальный корпус для баланса скорости и брони.",
  titan: "Тяжелый корпус с повышенной прочностью.",
  paladin: "Штурмовой корпус с щитом и +1 клеткой передвижения.",
  dictator: "Тяжелый корпус с 150 HP без дополнительных свойств.",
};
const DESCRIPTIONS_EN = {
  smoky: "Basic weapon with stable damage.",
  railgun: "Long-range weapon with high damage.",
  shaft: "Sniper weapon for precision shots.",
  thunder: "Powerful area burst shot.",
  ricochet: "Balanced rapid-fire weapon.",
  molot: "Huge close-range hit chance with massive damage; at range deals stable 10 damage.",
  hunter: "Universal hull balancing speed and armor.",
  titan: "Heavy hull with increased durability.",
  paladin: "Assault hull with shield and +1 movement cell.",
  dictator: "Heavy hull with 150 HP and no extra abilities.",
};
const LOCKED_HINTS = {
  railgun: "Эта пушка пока не открыта. Ее можно выбить из контейнера или купить в магазине.",
  shaft: "Эта пушка пока не открыта. Ее можно выбить из контейнера или купить в магазине.",
  thunder: "Эта пушка пока не открыта. Ее можно выбить из контейнера или купить в магазине.",
  ricochet: "Эта легендарная пушка пока не открыта. Ее можно выбить из контейнера или получить по промокоду.",
  molot: "Эта ультраредкая пушка пока не открыта. Ее можно выбить только из контейнера.",
  titan: "Этот корпус пока не открыт. Его можно выбить из контейнера или купить в магазине.",
  paladin: "Этот легендарный корпус пока не открыт. Его можно выбить из контейнера или получить по промокоду.",
  dictator: "Этот корпус пока не открыт. Его можно выбить из контейнера или купить в магазине.",
};
const LOCKED_HINTS_EN = {
  railgun: "This weapon is locked. Get it from containers or buy in shop.",
  shaft: "This weapon is locked. Get it from containers or buy in shop.",
  thunder: "This weapon is locked. Get it from containers or buy in shop.",
  ricochet: "This legendary weapon is locked. Get it from containers or promo codes.",
  molot: "This ultra-rare weapon is locked. It drops only from containers.",
  titan: "This hull is locked. Get it from containers or buy in shop.",
  paladin: "This legendary hull is locked. Get it from containers or promo codes.",
  dictator: "This hull is locked. Get it from containers or buy in shop.",
};

function itemName(key) {
  return state.locale === "en" ? (NAMES_EN[key] || NAMES[key] || key) : (NAMES[key] || key);
}
function itemDescription(key) {
  return state.locale === "en" ? (DESCRIPTIONS_EN[key] || DESCRIPTIONS[key] || "") : (DESCRIPTIONS[key] || "");
}
function itemLockedHint(key) {
  return state.locale === "en" ? (LOCKED_HINTS_EN[key] || LOCKED_HINTS[key] || "This item is unavailable now.") : (LOCKED_HINTS[key] || "Этот предмет пока недоступен.");
}
function rarityLabel(key) {
  return state.locale === "en" ? (RARITY_LABELS_EN[key] || key) : (RARITY_LABELS[key] || key);
}

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
function normalizeStoredAvatarUrl(storedUrl) {
  const s = String(storedUrl || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return absUrl(s);
}
function avatarProxyUrlForUser(userId) {
  const uid = Number(userId || 0);
  if (uid <= 0) return "";
  return absUrl(withApiBase(`/api/avatar/${uid}`));
}
/** Prefer DB avatar URL first, fallback to proxy. */
function avatarUrlForUser(userId, storedUrl) {
  const direct = normalizeStoredAvatarUrl(storedUrl);
  if (direct) return direct;
  return avatarProxyUrlForUser(userId);
}
const ASSET_CACHE_VERSION = "54";
function withCacheBust(url) { return `${url}${url.includes("?") ? "&" : "?"}v=${ASSET_CACHE_VERSION}`; }
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
function hideConfirmModal() {
  const modal = qs("confirmModal");
  if (modal) modal.style.display = "none";
  state.confirmOnOk = null;
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
  const msg = String(text || trText("Неизвестная ошибка.", "Unknown error."));
  const title = qs("errorTitle");
  const body = qs("errorBody");
  const modal = qs("errorModal");
  if (title) title.textContent = trText("ВНИМАНИЕ!", "WARNING!");
  if (body) body.textContent = msg;
  if (modal) modal.style.display = "flex";
}
function prettyError(err) {
  if (err instanceof TypeError) return trText("Сервер недоступен. Проверь подключение к интернету.", "Server is unavailable. Check your internet connection.");
  const raw = String(err?.message || "").trim();
  const low = raw.toLowerCase();
  if (!raw) return trText("Неизвестная ошибка.", "Unknown error.");
  if (low.includes("not enough crystals") || low.includes("insufficient crystals")) return trText("Недостаточно кристаллов для покупки.", "Not enough crystals for purchase.");
  if (low.includes("not enough") && low.includes("crystal")) return trText("Недостаточно кристаллов для покупки.", "Not enough crystals for purchase.");
  if (low.includes("not enough containers")) return trText("Недостаточно контейнеров.", "Not enough containers.");
  if (low.includes("no containers")) return trText("У тебя нет контейнеров.", "You have no containers.");
  if (low.includes("already owned")) return trText("Этот предмет уже куплен.", "This item is already owned.");
  if (low.includes("unauthorized") || low === "401") return trText("Сессия истекла. Открой мини-приложение заново из бота.", "Session expired. Reopen mini app from the bot.");
  if (low.includes("invalid token")) return trText("Сессия недействительна. Открой мини-приложение заново из бота.", "Session is invalid. Reopen mini app from the bot.");
  if (low.includes("forbidden") || low === "403") return trText("Нет доступа к этому действию.", "No access to this action.");
  if (low.includes("not found") || low === "404") return trText("Запрошенный ресурс не найден.", "Requested resource was not found.");
  if (low.includes("item not found")) return trText("Предмет не найден.", "Item not found.");
  if (low.includes("item locked") || low.includes("not unlocked")) return trText("Этот предмет еще не разблокирован.", "This item is not unlocked yet.");
  if (low.includes("bad request") || low === "400") return trText("Некорректный запрос.", "Bad request.");
  if (low.includes("internal server error") || low === "500") return trText("Внутренняя ошибка сервера.", "Internal server error.");
  if (low.includes("too many requests") || low === "429") return trText("Слишком много запросов. Попробуй чуть позже.", "Too many requests. Try again later.");
  if (low.includes("failed to fetch")) return trText("Не удалось получить ответ от сервера.", "Failed to fetch server response.");
  if (low.includes("timeout")) return trText("Сервер долго отвечает. Попробуй еще раз.", "Server response timeout. Try again.");
  if (low.includes("network")) return trText("Проблема сети. Проверь подключение.", "Network issue. Check your connection.");
  if (low.includes("недостаточно кристаллов")) return trText("Недостаточно кристаллов для покупки.", "Not enough crystals for purchase.");
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
  if (result.reward_key === "molot") return "ultrarare";
  if (["ricochet", "paladin"].includes(result.reward_key)) return "legendary";
  if (["thunder", "titan", "dictator"].includes(result.reward_key)) return "epic";
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
    state.battleAudioSeq += 1;
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
  state.battleAudioSeq += 1;
  const seq = state.battleAudioSeq;
  if (!state.battleAmbient) {
    state.battleAmbient = new Audio(absUrl(withApiBase(BATTLE_AMBIENT_PATH)));
    state.battleAmbient.loop = false;
    state.battleAmbient.preload = "auto";
    state.battleAmbient.volume = 0;
    state.battleAmbient.addEventListener("ended", () => {
      if (!state.battleAmbient || !state.battleAmbientActive) return;
      state.battleAmbient.currentTime = 0;
      void state.battleAmbient.play().catch(() => {});
    });
  }
  const a = state.battleAmbient;
  if (state.bgMusic) {
    state.battleBgResumeTime = Number(state.bgMusic.currentTime) || 0;
    state.battleBgWasPlaying = !state.bgMusic.paused;
  }

  const crossMs = 1200;
  const targetVol = Math.min(0.52, state.bgMusicVolume + 0.08);
  a.volume = 0;
  try { await a.play(); } catch {}
  const still = () => seq === state.battleAudioSeq;
  await Promise.all([
    state.bgMusic
      ? fadeAudioVolume(state.bgMusic, state.bgMusic.volume, 0, crossMs, still)
      : Promise.resolve(),
    fadeAudioVolume(a, a.volume, targetVol, crossMs, still),
  ]);
  if (!still()) return;
  if (state.bgMusic) {
    try {
      state.bgMusic.pause();
      state.bgMusic.currentTime = Math.max(0, Number(state.battleBgResumeTime) || 0);
    } catch {}
  }
  state.battleAmbientActive = true;
}

let battleAmbientStopChain = Promise.resolve();
function stopBattleAmbient() {
  battleAmbientStopChain = battleAmbientStopChain.then(() => stopBattleAmbientInner()).catch(() => {});
  return battleAmbientStopChain;
}

async function stopBattleAmbientInner() {
  if (!state.battleAmbient) {
    state.battleAmbientActive = false;
    return;
  }
  const a = state.battleAmbient;
  // Avoid overlapping fades when renderBattleState / resetBattleUI both stop ambient.
  if (!state.battleAmbientActive && a.paused && a.volume <= 0.001) {
    return;
  }
  state.battleAudioSeq += 1;
  const seq = state.battleAudioSeq;
  state.battleAmbientActive = false;
  const crossMs = 1400;
  const resume = Boolean(state.bgMusicEnabled && state.bgMusic && state.battleBgWasPlaying);
  const still = () => seq === state.battleAudioSeq;
  if (resume) {
    // Ensure no parallel menu tracks keep playing.
    if (state.prevMusic) {
      try { state.prevMusic.pause(); state.prevMusic.currentTime = 0; } catch {}
      state.prevMusic = null;
    }
    const bg = state.bgMusic;
    try {
      bg.currentTime = 0;
    } catch {}
    const menuAlreadyAudible = Boolean(bg && !bg.paused && bg.volume > 0.05);
    if (menuAlreadyAudible) {
      await fadeAudioVolume(a, a.volume, 0, crossMs, still);
    } else {
      bg.volume = 0;
      try { await bg.play(); } catch {}
      await Promise.all([
        fadeAudioVolume(a, a.volume, 0, crossMs, still),
        fadeAudioVolume(bg, 0, state.bgMusicVolume, crossMs, still),
      ]);
    }
  } else {
    await fadeAudioVolume(a, a.volume, 0, crossMs, still);
  }
  if (!still()) return;
  try {
    a.pause();
    a.currentTime = 0;
    a.volume = 0;
  } catch {}
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
  newAudio.preload = "auto";
  newAudio.volume = 0;
  newAudio.muted = false;
  newAudio.addEventListener("ended", () => {
    if (!state.bgMusicEnabled || state.bgMusic !== newAudio) return;
    newAudio.currentTime = 0;
    void newAudio.play().catch(() => {});
  });
  state.bgMusic = newAudio;
  state.prevMusic = oldAudio;
  try { await newAudio.play(); } catch {}
  if (seq !== state.musicSwitchSeq) {
    newAudio.pause();
    return;
  }
  // Плавный кроссфейд как при переходе в ambient боя.
  const crossMs = 1200;
  await Promise.all([
    fadeAudioVolume(newAudio, 0, state.bgMusicVolume, crossMs, () => seq === state.musicSwitchSeq),
    fadeAudioVolume(oldAudio, oldAudio.volume, 0, crossMs, () => seq === state.musicSwitchSeq),
  ]);
  if (seq !== state.musicSwitchSeq) return;
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
  audio.preload = "auto";
  audio.volume = state.bgMusicEnabled ? state.bgMusicVolume : 0;
  audio.addEventListener("ended", () => {
    if (!state.bgMusicEnabled || state.bgMusic !== audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  });
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
  if (!tg) throw new Error(tr("err_open_in_telegram"));
  tg.ready();
  tg.expand();
  const unsafeUser = tg.initDataUnsafe?.user;
  state.viewerName = unsafeUser?.username || unsafeUser?.first_name || "player";
  if (unsafeUser?.photo_url) {
    state.avatarUrl = unsafeUser.photo_url;
  }
  if (!tg.initData) {
    throw new Error(tr("err_initdata_missing"));
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
function garageList() {
  return state.garageCategory === "weapon"
    ? ["smoky", "railgun", "shaft", "thunder", "ricochet", "molot"]
    : ["hunter", "titan", "paladin", "dictator"];
}
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

function showConfirmModal({ title = "ПОДТВЕРДИТЕ", label = "Вы уверены?", icon = "⚑", name = "—", meta = "", onOk = null }) {
  const modal = qs("confirmModal");
  if (!modal) return;
  const t = qs("confirmTitle");
  const l = qs("confirmLabel");
  const i = qs("confirmIcon");
  const n = qs("confirmName");
  const m = qs("confirmMeta");
  if (t) t.textContent = String(title || "ПОДТВЕРДИТЕ");
  if (l) l.textContent = String(label || "");
  if (i) i.textContent = String(icon || "⚑");
  if (n) n.textContent = String(name || "—");
  if (m) m.textContent = String(meta || "");
  state.confirmOnOk = typeof onOk === "function" ? onOk : null;
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
    name.textContent = state.locale === "en" ? "Standard container" : "Обычный контейнер";
    desc.textContent = state.locale === "en"
      ? "Select an item to see its description and drop chance."
      : "Выберите предмет из списка, чтобы посмотреть описание и шанс выпадения.";
    return;
  }
  const dispName = itemName(item.key) || item.name;
  const dispDesc = itemDescription(item.key) || item.description;
  name.textContent = dispName;
  desc.textContent = state.locale === "en"
    ? `${dispDesc} Drop chance: ${item.chance}. Rarity: ${rarityLabel(item.rarity)}.`
    : `${dispDesc} Шанс выпадения: ${item.chance}. Редкость: ${rarityLabel(item.rarity)}.`;
}
function renderContainerLoot() {
  const grid = qs("lootGrid");
  if (!grid) return;
  const items = CONTAINER_LOOT
    .filter((item) => state.lootFilter === "all" || item.rarity === state.lootFilter)
    .sort((a, b) => {
      const rarityDiff = RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
      if (rarityDiff !== 0) return rarityDiff;
      return itemName(a.key).localeCompare(itemName(b.key), state.locale === "en" ? "en" : "ru");
    });
  grid.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `lootItemCard rarity-${item.rarity}${index === 0 ? " isSelected" : ""}`;
    card.innerHTML = `
      <div class="lootChance">${item.chance}</div>
      <img src="${withCacheBust(absUrl(item.image))}" alt="${itemName(item.key)}" class="lootItemImage" />
      <div class="lootItemFooter">${itemName(item.key)}</div>
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
  if (logo) {
    const fromProfile = String(state.profile?.avatar_url || "").trim();
    const fromTg = String(state.avatarUrl || "").trim();
    const rawAvatar = fromProfile || fromTg;
    const fallbackAvatar = rawAvatar ? avatarProxyUrlForUser(state.profile?.user_id) : "";
    const nextAvatar = state.profile?.user_id
      ? avatarUrlForUser(state.profile.user_id, rawAvatar)
      : (fromProfile ? absUrl(fromProfile) : fromTg ? absUrl(fromTg) : "");
    const sig = `${state.profile.user_id}|${nextAvatar}|${fallbackAvatar}`;
    if (sig !== state.hudAvatarSig) {
      state.hudAvatarSig = sig;
      logo.referrerPolicy = "no-referrer";
      logo.removeAttribute("crossorigin");
      logo.src = nextAvatar ? nextAvatar : withCacheBust(absUrl("/images/webapp/logo.png"));
      logo.onerror = () => {
        if (fallbackAvatar && logo.src !== fallbackAvatar) {
          logo.src = fallbackAvatar;
          return;
        }
        logo.onerror = null;
        logo.src = withCacheBust(absUrl("/images/webapp/logo.png"));
      };
      logo.onload = () => { logo.style.display = ""; };
    }
  }
  const displayName = String(state.profile?.name || state.viewerName || "player");
  qs("nickname").textContent = displayName;
  qs("rankName").textContent = trRankName(state.profile.rank.name);
  qs("pillCrystals").textContent = String(state.profile.crystals ?? 0);
  qs("pillContainers").textContent = String(state.profile.containers ?? 0);
  qs("rankImg").src = withCacheBust(absUrl(state.profile.rank_image_url));
  const prem = Boolean(state.profile.is_premium);
  const premSrc = absUrl(state.profile.premium_badge_url || PREMIUM_BADGE_PATH);
  qs("hudRankStack")?.classList.toggle("rankPremiumStack--hasPremium", prem);
  qs("profileRankStack")?.classList.toggle("rankPremiumStack--hasPremium", prem);
  const hudPb = qs("hudPremiumBadge");
  if (hudPb) {
    hudPb.src = premSrc;
    hudPb.style.display = prem ? "block" : "none";
  }
  const profPb = qs("profilePremiumBadge");
  if (profPb) {
    profPb.src = premSrc;
    profPb.style.display = prem ? "block" : "none";
  }
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

  const premStatus = qs("premiumStatusValue");
  const premUntil = qs("premiumUntilValue");
  const untilTs = Number(state.profile.premium_until_ts || 0);
  const nowTs = Math.floor(Date.now() / 1000);
  const isPrem = Boolean(state.profile.is_premium) && untilTs > nowTs;
  if (premStatus) premStatus.textContent = isPrem ? trText("Активен", "Active") : trText("Неактивен", "Inactive");
  if (premUntil) {
    if (!isPrem) {
      premUntil.textContent = "";
    } else {
      const ms = untilTs * 1000;
      const d = new Date(ms);
      const daysLeft = Math.max(0, Math.ceil((untilTs - nowTs) / 86400));
      const localeTag = state.locale === "en" ? "en-US" : "ru-RU";
      const dateStr = d.toLocaleDateString(localeTag, { year: "numeric", month: "2-digit", day: "2-digit" });
      const timeStr = d.toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit" });
      premUntil.textContent = state.locale === "en"
        ? `Until: ${dateStr} ${timeStr} • Left: ${daysLeft} d.`
        : `До: ${dateStr} ${timeStr} • Осталось: ${daysLeft} дн.`;
    }
  }
}

function leaderboardRowHtml(row, isMe = false) {
  if (!row) return "";
  const place = Number(row.place || 0) > 0 ? String(row.place) : "—";
  const uid = Number(row.user_id || 0);
  const avatar = uid > 0 ? avatarUrlForUser(uid, row.avatar_url) : (row.avatar_url ? absUrl(String(row.avatar_url)) : "");
  const avatarFallback = uid > 0 ? avatarProxyUrlForUser(uid) : "";
  const rankImg = row.rank_image_url ? absUrl(String(row.rank_image_url)) : "";
  const rankName = trRankName(String(row.rank_name || "Звание"));
  const name = String(row.name || trText("Игрок", "Player"));
  const initial = name.trim().charAt(0).toUpperCase() || "U";
  const isPrem = Boolean(row.is_premium);
  const premSrc = absUrl(PREMIUM_BADGE_PATH);
  const rankInner = rankImg
    ? (isPrem
      ? `<span class="leadersRankImgCol rankPremiumStack--hasPremium"><img class="premiumBadgeLayer" src="${premSrc}" alt=""><img class="leadersRankIcon" src="${rankImg}" alt="${rankName}"></span><span>${rankName}</span>`
      : `<span class="leadersRankImgCol"><img class="leadersRankIcon" src="${rankImg}" alt="${rankName}"></span><span>${rankName}</span>`)
    : `<span>${rankName}</span>`;
  return `<div class="leadersRow${isMe ? " isMe" : ""}">
    <span class="leadersPlace">${place}</span>
    <span class="leadersIdentity">
      <span class="leadersAvatar${avatar ? "" : " isFallback"}">
        ${avatar ? `<img src="${avatar}" data-alt-src="${avatarFallback}" alt="${name}" loading="lazy" referrerpolicy="no-referrer" onerror="const alt=this.dataset.altSrc||'';if(alt&&this.src!==alt){this.src=alt;return;}this.closest('.leadersAvatar')?.classList.add('isFallback');this.remove();">` : ""}
        <span class="leadersAvatarFallback">${initial}</span>
      </span>
      <span class="leadersNameWrap">
        <span class="leadersName">${name}</span>
        <span class="leadersRank">${rankInner}</span>
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
    rows.innerHTML = `<div class="leadersEmpty">${trText("Загрузка рейтинга...", "Loading leaderboard...")}</div>`;
    meWrap.style.display = "none";
    return;
  }
  const top = Array.isArray(data.top) ? data.top : [];
  if (!top.length) {
    rows.innerHTML = `<div class="leadersEmpty">${trText("Пока нет данных рейтинга.", "No leaderboard data yet.")}</div>`;
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
  qs("garageSelectedName").textContent = `${itemName(key)}`.toUpperCase();
  qs("garageSelectedDesc").textContent = unlocked
    ? (itemDescription(key) || (state.locale === "en" ? "Select an item." : "Выберите предмет."))
    : itemLockedHint(key);
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
        <img src="${absUrl(getItemImage(itemKey))}" alt="${itemName(itemKey)}" />
        <div class="itemName">${itemName(itemKey)}</div>
      `
      : `
        <div class="lockedQuestionMark">?</div>
        <div class="itemName">${itemName(itemKey)}</div>
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
    const isPremium = item.category === "premium";
    card.className = `shopCard${isPremium ? " shopCardPremium" : ""}`;
    const premiumMeta = isPremium ? (SHOP_PREMIUM_META[item.key] || {}) : null;
    const buyButton = isPremium
      ? `<button class="promoBtn shopBuyBtn shopBuyBtnPremium" data-buy="${item.key}" style="margin-top:0">${state.locale === "en" ? "Activate" : "Оформить"}</button>`
      : (item.owned
        ? `<button class="promoBtn shopBuyBtn" type="button" style="margin-top:0" disabled>${state.locale === "en" ? "Owned" : "Куплено"}</button>`
        : `<button class="promoBtn shopBuyBtn" data-buy="${item.key}" style="margin-top:0">${state.locale === "en" ? "Buy" : "Купить"}</button>`);
    if (isPremium) {
      card.innerHTML = `
        <div class="shopPremiumGlow"></div>
        <div class="shopPremiumHero">
          <img src="${withCacheBust(absUrl(item.image_url))}" alt="${item.name}">
          <div class="shopPremiumBadge">${escapeHtml(String(premiumMeta?.accent || "Премиум"))}</div>
        </div>
        <div class="shopCardTitle">${escapeHtml(String(premiumMeta?.title || item.name))}</div>
        <div class="shopCardMeta">${escapeHtml(String(premiumMeta?.subtitle || "Подписка суммируется с уже активной."))}</div>
        <div class="shopPremiumPerks">
          <span class="shopPremiumChip">${escapeHtml(String(premiumMeta?.duration || item.name))}</span>
          <span class="shopPremiumChip">${escapeHtml(String(premiumMeta?.icon || "👑"))} срок суммируется</span>
        </div>
        <div class="shopCardActions"><span class="shopPrice">${item.price} 💎</span>${buyButton}</div>
      `;
    } else {
      card.innerHTML = `
        <img src="${withCacheBust(absUrl(item.image_url))}" alt="${item.name}">
        <div class="shopCardTitle">${itemName(item.key) || item.name}</div>
        <div class="shopCardMeta">${state.locale === "en" ? "Category" : "Категория"}: ${SHOP_CATEGORY_LABELS[item.category] || item.category}</div>
        <div class="shopCardActions"><span class="shopPrice">${item.price} 💎</span>${buyButton}</div>
      `;
    }
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
        if (item?.category === "premium") {
          const premiumMeta = SHOP_PREMIUM_META[item.key] || {};
          showPurchaseLikeModal({
            title: "ПРЕМИУМ АКТИВИРОВАН",
            label: "Подписка продлена на:",
            icon: String(premiumMeta.icon || "👑"),
            name: String(premiumMeta.duration || item.name || "Премиум"),
            price: `${item.price} 💎`,
          });
        } else {
          showPurchaseModal(item);
        }
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

function formatQuestReset(seconds) {
  const sec = Math.max(0, Number(seconds || 0));
  if (sec < 60) return `${Math.floor(sec)}с`;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}ч ${m}м`;
}

function loadSeenQuestDayKey() {
  try {
    return String(localStorage.getItem(QUESTS_SEEN_DAY_KEY_STORAGE) || "").trim();
  } catch {
    return "";
  }
}

function markQuestDaySeen(dayKey) {
  const key = String(dayKey || "").trim();
  if (!key) return;
  state.questsSeenDayKey = key;
  try { localStorage.setItem(QUESTS_SEEN_DAY_KEY_STORAGE, key); } catch {}
}

function renderQuests() {
  const list = qs("questsList");
  const reset = qs("questsResetTime");
  if (!list || !reset) return;
  const payload = state.quests || {};
  const quests = Array.isArray(payload.quests) ? payload.quests : [];
  reset.textContent = `${tr("reset_prefix")} ${formatQuestReset(payload.reset_in_seconds)}`;
  updateQuestsTabAlert(quests);
  if (!quests.length) {
    list.innerHTML = `<div class="leadersEmpty">${state.locale === "en" ? "Quests will appear soon." : "Квесты скоро появятся."}</div>`;
    return;
  }
  const sorted = [...quests].sort((a, b) => {
    const wa = a.claimed ? 2 : (a.completed ? 1 : 0);
    const wb = b.claimed ? 2 : (b.completed ? 1 : 0);
    if (wa !== wb) return wa - wb;
    return String(a.title || "").localeCompare(String(b.title || ""), state.locale === "en" ? "en" : "ru");
  });
  list.innerHTML = sorted.map((q) => {
    const progressPct = Math.max(0, Math.min(100, Math.round((Number(q.progress || 0) / Math.max(1, Number(q.target || 1))) * 100)));
    const reward = q.reward_type === "containers"
      ? `📦 x${q.reward_amount}`
      : `💎 x${q.reward_amount}`;
    const status = !q.available
      ? tr("quest_status_premium_only")
      : (q.claimed ? tr("quest_status_claimed") : (q.completed ? tr("quest_status_ready") : tr("quest_status_progress")));
    const btn = (!q.available || q.claimed || !q.completed)
      ? `<button class="promoBtn questClaimBtn" type="button" disabled>${q.claimed ? tr("quest_claimed") : tr("quest_claim_take")}</button>`
      : `<button class="promoBtn questClaimBtn" type="button" data-quest-claim="${escapeHtml(String(q.quest_id || ""))}">${tr("quest_claim_take")}</button>`;
    const chip = q.premium_only ? tr("quest_chip_premium") : tr("quest_chip_common");
    return `
      <div class="questCard${q.premium_only ? " questCardPremium" : ""}${q.completed ? " questCardCompleted" : ""}${q.claimed ? " questCardDone" : ""}${(q.completed && !q.claimed) ? " questCardReady" : ""}">
        <div class="questTop">
          <div>
            <div class="questTitle">${escapeHtml(String(q.title || "Квест"))}</div>
            <div class="questChip">${chip}</div>
          </div>
          <div class="questReward">${reward}</div>
        </div>
        <div class="questDesc">${escapeHtml(String(q.description || ""))}</div>
        <div class="questProgressRow">
          <div class="questProgressTrack"><div class="questProgressFill" style="width:${progressPct}%"></div></div>
          <div class="questProgressText">${Number(q.progress || 0)} / ${Number(q.target || 0)}</div>
        </div>
        <div class="questFooter">
          <div class="questStatus">${escapeHtml(String(status))}</div>
          ${btn}
        </div>
      </div>
    `;
  }).join("");
}

function updateQuestsTabAlert(questsArr = null) {
  const badge = qs("questsTabAlert");
  if (!badge) return;
  const quests = Array.isArray(questsArr)
    ? questsArr
    : (Array.isArray(state.quests?.quests) ? state.quests.quests : []);
  const hasReady = quests.some((q) => Boolean(q?.available) && Boolean(q?.completed) && !Boolean(q?.claimed));
  const currentDayKey = String(state.quests?.day_key || "").trim();
  const hasUnreadNewDay = Boolean(currentDayKey) && currentDayKey !== String(state.questsSeenDayKey || "").trim();
  badge.style.display = (hasReady || hasUnreadNewDay) ? "inline-flex" : "none";
}

async function syncQuestBadge(force = false) {
  const now = Date.now();
  if (!force && now - Number(state.lastQuestSyncAt || 0) < 15000) return;
  try {
    const q = await api("/api/quests/daily");
    state.quests = q;
    state.lastQuestSyncAt = now;
    updateQuestsTabAlert(Array.isArray(q?.quests) ? q.quests : []);
    if (state.activeTab === "quests") renderQuests();
  } catch {}
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
  // Keep reveal fast on mobile to avoid long "frozen" feeling.
  await sleep(420);
  card.className = `rewardCard rarity-${rarity}`; // glow appears smoothly via CSS transition
  contImg.classList.add("isHidden");
  await sleep(160);
  contImg.src = openedSrc;
  dropImg.src = dropSrc;
  await Promise.race([
    Promise.all([waitForImageLoad(contImg, 900), waitForImageLoad(dropImg, 900)]),
    sleep(520),
  ]);
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

async function refreshTabContext(tab) {
  if (!state.token) return;
  const p = encodeURIComponent(state.leaderboardSort || "experience");
  const lim = encodeURIComponent(state.leaderboardLimit || 100);
  if (tab === "profile") {
    state.profile = await api("/api/profile/me");
    const loc = String(state.profile?.locale || "").toLowerCase();
    if (loc === "ru" || loc === "en") {
      const changed = state.locale !== loc;
      state.locale = loc;
      if (changed) applyStaticI18n();
    }
    renderHud();
    renderProfile();
    return;
  }
  if (tab === "leaders") {
    const [leaderboard, profile] = await Promise.all([
      api(`/api/leaderboard?sort=${p}&limit=${lim}`),
      api("/api/profile/me"),
    ]);
    state.leaderboard = leaderboard;
    state.profile = profile;
    const loc = String(state.profile?.locale || "").toLowerCase();
    if (loc === "ru" || loc === "en") {
      const changed = state.locale !== loc;
      state.locale = loc;
      if (changed) applyStaticI18n();
    }
    renderLeaderboard();
    renderHud();
    return;
  }
  if (tab === "shop") {
    const [shop, profile] = await Promise.all([
      api("/api/shop/items"),
      api("/api/profile/me"),
    ]);
    state.shop = shop;
    state.profile = profile;
    const loc = String(state.profile?.locale || "").toLowerCase();
    if (loc === "ru" || loc === "en") {
      const changed = state.locale !== loc;
      state.locale = loc;
      if (changed) applyStaticI18n();
    }
    renderHud();
    renderShop();
    return;
  }
  if (tab === "containers") {
    const [containersInfo, profile] = await Promise.all([
      api("/api/containers"),
      api("/api/profile/me"),
    ]);
    state.containersInfo = containersInfo;
    state.profile = profile;
    const loc = String(state.profile?.locale || "").toLowerCase();
    if (loc === "ru" || loc === "en") {
      const changed = state.locale !== loc;
      state.locale = loc;
      if (changed) applyStaticI18n();
    }
    renderHud();
    renderContainers();
    return;
  }
  if (tab === "quests") {
    const [quests, profile] = await Promise.all([
      api("/api/quests/daily"),
      api("/api/profile/me"),
    ]);
    state.quests = quests;
    state.profile = profile;
    const loc = String(state.profile?.locale || "").toLowerCase();
    if (loc === "ru" || loc === "en") {
      const changed = state.locale !== loc;
      state.locale = loc;
      if (changed) applyStaticI18n();
    }
    renderHud();
    renderQuests();
    return;
  }
  if (tab === "garage") {
    if (!state.profile) await refreshAll();
    else {
      state.profile = await api("/api/profile/me");
      renderHud();
      renderGarage();
    }
    return;
  }
  if (tab === "battles") {
    const [profile, st] = await Promise.all([
      api("/api/profile/me"),
      api("/api/battle/state").catch(() => null),
    ]);
    state.profile = profile;
    renderHud();
    // Force immediate lobby refresh when opening the tab.
    state.lastLobbiesFetchAt = 0;
    void refreshLobbies();
    try {
      if (st) {
      renderBattleState(st);
      if (st.active && !st.game_over) startBattlePolling();
      }
    } catch {}
    return;
  }
  if (tab === "settings") {
    state.settings = await api("/api/settings");
    renderSettings();
    return;
  }
}

async function showTab(tab, { force = false } = {}) {
  if (!force && state.webBattleActive && tab !== "battles") {
    setError("Нельзя переключать вкладки во время боя.");
    return;
  }
  if (state.activeTab === "battles" && tab !== "battles") {
    stopLobbiesPolling();
  }
  state.activeTab = tab;
  document.querySelectorAll(".mainTab").forEach((b) => b.classList.toggle("isActive", b.dataset.tab === tab));
  ["profile", "leaders", "battles", "garage", "shop", "containers", "quests", "settings"].forEach((key) => {
    const panel = qs(`panel${key[0].toUpperCase()}${key.slice(1)}`);
    if (panel) panel.style.display = key === tab ? "block" : "none";
  });
  if (state.token) {
    try { await refreshTabContext(tab); } catch (e) { setError(prettyError(e)); }
  }
  if (tab === "quests" && state.quests?.day_key) {
    markQuestDaySeen(state.quests.day_key);
    updateQuestsTabAlert(Array.isArray(state.quests?.quests) ? state.quests.quests : []);
  }
  await switchTrack();
}

async function refreshAll() {
  const [profile, shop, containersInfo, leaderboard, quests] = await Promise.all([
    api("/api/profile/me"),
    api("/api/shop/items"),
    api("/api/containers"),
    api(`/api/leaderboard?sort=${encodeURIComponent(state.leaderboardSort)}&limit=${encodeURIComponent(state.leaderboardLimit)}`),
    api("/api/quests/daily"),
  ]);
  state.profile = profile;
  const loc = String(state.profile?.locale || "").toLowerCase();
  if (loc === "ru" || loc === "en") {
    const changed = state.locale !== loc;
    state.locale = loc;
    if (changed) applyStaticI18n();
  }
  state.shop = shop;
  state.containersInfo = containersInfo;
  state.leaderboard = leaderboard;
  state.quests = quests;
  if (!state.ranks) {
    try { state.ranks = (await api("/api/ranks"))?.ranks || []; } catch { state.ranks = []; }
  }
  applyBackgroundImage();
  state.selectedWeapon = state.profile.weapon;
  state.selectedHull = state.profile.hull;
  renderHud();
  renderProfile();
  renderGarage();
  renderShop();
  renderContainers();
  renderQuests();
  renderLeaderboard();
}

function parseAllowlistInput(text) {
  return String(text || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.startsWith("@") ? x.slice(1) : x)
    .map((x) => x.toLowerCase());
}

function renderSettings() {
  const s = state.settings || {};
  const block = qs("setBlockInvites");
  const allow = qs("setInvitesAllowlist");
  const showA = qs("setShowAvatar");
  const vis = qs("setChatVisibility");
  if (block) block.checked = Boolean(s.block_battle_invites);
  if (allow) allow.value = (Array.isArray(s.invites_allowlist) ? s.invites_allowlist : []).map((x) => `@${x}`).join(", ");
  if (showA) showA.checked = Boolean(s.show_avatar ?? true);
  if (vis) vis.value = String(s.chat_visibility || "on");
  // Tabs
  const privacy = qs("settingsPrivacy");
  const chat = qs("settingsChat");
  if (privacy) privacy.style.display = state.settingsTab === "privacy" ? "block" : "none";
  if (chat) chat.style.display = state.settingsTab === "chat" ? "block" : "none";
  qs("settingsTabs")?.querySelectorAll(".subTab").forEach((b) => b.classList.toggle("isActive", b.dataset.settings === state.settingsTab));

  // Apply chat visibility to UI immediately
  applyChatVisibilityToUI(String(s.chat_visibility || "on"));
}

function applyChatVisibilityToUI(mode) {
  const m = String(mode || "on").toLowerCase();
  const globalCard = qs("globalChatCard");
  const battleWrap = qs("battleChatWrap");
  if (m === "off") {
    if (globalCard) globalCard.style.display = "none";
    if (battleWrap) battleWrap.style.display = "none";
    return;
  }
  if (m === "battle_only") {
    if (globalCard) globalCard.style.display = "none";
    // battle chat only visible in arena
    if (battleWrap) battleWrap.style.display = state.webBattleActive ? "block" : "none";
    return;
  }
  if (globalCard) globalCard.style.display = "block";
  if (battleWrap) battleWrap.style.display = state.webBattleActive ? "block" : "none";
}

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** Снимает дубли при гонке: POST+poll и интервальный poll с одинаковым after_id. */
function dedupeChatMessages(list, msgs) {
  const seen = new Set();
  if (list) {
    list.querySelectorAll("[data-chat-msg-id]").forEach((el) => {
      const id = el.getAttribute("data-chat-msg-id");
      if (id) seen.add(id);
    });
  }
  const batch = new Set();
  return msgs.filter((m) => {
    const id = String(m.id ?? "");
    if (!id) return true;
    if (seen.has(id) || batch.has(id)) return false;
    batch.add(id);
    return true;
  });
}

function renderGlobalChatMessages(msgs, { append = true } = {}) {
  const list = qs("globalChatList");
  if (!list) return;
  const raw = Array.isArray(msgs) ? msgs : [];
  if (!append) list.innerHTML = "";
  const arr = append ? dedupeChatMessages(list, raw) : raw;
  const wasNearBottom = (list.scrollTop + list.clientHeight) >= (list.scrollHeight - 80);
  const premBg = absUrl(PREMIUM_BADGE_PATH);
  const html = arr.map((m) => {
    const icon = absUrl(String(m.rank_image_url || ""));
    const avatar = avatarUrlForUser(m.user_id, m.avatar_url);
    const avatarFallback = avatarProxyUrlForUser(m.user_id);
    const name = escapeHtml(m.name || "Игрок");
    const nameInitial = name.trim().charAt(0).toUpperCase() || "U";
    const text = escapeHtml(m.message || "");
    const nickInner = m.is_premium
      ? `<span class="chatNickPremiumGlow"><span class="chatNickInline chatNickPremium">${name}</span></span>`
      : `<span class="chatNickInline">${name}</span>`;
    const rankCell = icon
      ? (m.is_premium
        ? `<span class="chatRankPremiumStack"><img class="chatPremiumBg" src="${premBg}" alt=""><img class="chatRankIcon" src="${icon}" alt="rank" loading="lazy" /></span>`
        : `<img class="chatRankIcon" src="${icon}" alt="rank" loading="lazy" />`)
      : `<span class="chatRankPlaceholder" aria-hidden="true"></span>`;
    const avatarCell = `<span class="chatAvatar${avatar ? "" : " isFallback"}">
      ${avatar ? `<img src="${avatar}" data-alt-src="${avatarFallback}" alt="${name}" loading="lazy" referrerpolicy="no-referrer" onerror="const alt=this.dataset.altSrc||'';if(alt&&this.src!==alt){this.src=alt;return;}this.closest('.chatAvatar')?.classList.add('isFallback');this.remove();">` : ""}
      <span class="chatAvatarFallback">${nameInitial}</span>
    </span>`;
    const flag = `<button class="chatFlagBtn" type="button" title="Пожаловаться" data-report-scope="global" data-report-id="${escapeHtml(String(m.id ?? ""))}">⚑</button>`;
    return `<div class="chatMsg" data-chat-msg-id="${escapeHtml(String(m.id ?? ""))}">
      <div class="chatInlineRow chatInlineRow--full">
        ${avatarCell}
        ${rankCell}
        <div class="chatMsgLine">${nickInner}<span class="chatColon">:</span> ${text}</div>
        ${flag}
      </div>
    </div>`;
  }).join("");
  if (append) list.insertAdjacentHTML("beforeend", html);
  else list.innerHTML = html;
  if (wasNearBottom) list.scrollTop = list.scrollHeight;
}

async function pollGlobalChat() {
  if (!state.token) return;
  try {
    const data = await api(`/api/chat/global?after_id=${encodeURIComponent(state.globalChatAfterId)}&limit=50`);
    const msgs = data?.messages || [];
    if (msgs.length) {
      state.globalChatAfterId = Math.max(state.globalChatAfterId, ...msgs.map((m) => Number(m.id || 0)));
      renderGlobalChatMessages(msgs, { append: true });
    }
  } catch {}
}

async function sendGlobalChat(text) {
  await api("/api/chat/global", { method: "POST", body: JSON.stringify({ message: String(text || "") }) });
  await pollGlobalChat();
}

function renderBattleChatMessages(msgs, { append = true } = {}) {
  const list = qs("battleChatList");
  if (!list) return;
  const raw = Array.isArray(msgs) ? msgs : [];
  if (!append) list.innerHTML = "";
  const arr = append ? dedupeChatMessages(list, raw) : raw;
  const wasNearBottom = (list.scrollTop + list.clientHeight) >= (list.scrollHeight - 80);
  const premBg = absUrl(PREMIUM_BADGE_PATH);
  const html = arr.map((m) => {
    const name = escapeHtml(m.name || "Игрок");
    const avatar = avatarUrlForUser(m.user_id, m.avatar_url);
    const avatarFallback = avatarProxyUrlForUser(m.user_id);
    const nameInitial = name.trim().charAt(0).toUpperCase() || "U";
    const text = escapeHtml(m.message || "");
    const rank = absUrl(String(m.rank_image_url || ""));
    const nickBlock = m.is_premium
      ? `<span class="chatNickPremiumGlow"><span class="chatNickInline battleChatNickPremium">${name}</span></span>`
      : `<span class="chatNickInline">${name}</span>`;
    const rankCell = rank
      ? (m.is_premium
        ? `<span class="chatRankPremiumStack battleChatRankStack"><img class="chatPremiumBg" src="${premBg}" alt=""><img class="chatRankIcon" src="${rank}" alt="rank" loading="lazy" /></span>`
        : `<img class="chatRankIcon" src="${rank}" alt="rank" loading="lazy" />`)
      : `<span class="chatRankPlaceholder" aria-hidden="true"></span>`;
    const avatarCell = `<span class="chatAvatar chatAvatarSmall${avatar ? "" : " isFallback"}">
      ${avatar ? `<img src="${avatar}" data-alt-src="${avatarFallback}" alt="${name}" loading="lazy" referrerpolicy="no-referrer" onerror="const alt=this.dataset.altSrc||'';if(alt&&this.src!==alt){this.src=alt;return;}this.closest('.chatAvatar')?.classList.add('isFallback');this.remove();">` : ""}
      <span class="chatAvatarFallback">${nameInitial}</span>
    </span>`;
    const flag = `<button class="chatFlagBtn" type="button" title="Пожаловаться" data-report-scope="battle" data-report-id="${escapeHtml(String(m.id ?? ""))}" data-report-battle="${escapeHtml(String(state.currentBattleId || ""))}">⚑</button>`;
    const body = `<span class="battleChatMsgInline"><span class="battleChatMsgRest">${nickBlock}<span class="chatColon">:</span> ${text}</span></span>`;
    return `<div class="battleChatLine" data-chat-msg-id="${escapeHtml(String(m.id ?? ""))}">${avatarCell}${rankCell}${body}${flag}</div>`;
  }).join("");
  if (append) list.insertAdjacentHTML("beforeend", html);
  else list.innerHTML = html;
  if (wasNearBottom) list.scrollTop = list.scrollHeight;
}

function showToast(text, { title = null, ms = 2600 } = {}) {
  const host = qs("toastHost");
  if (!host) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.style.setProperty("--toast-ms", `${Math.max(800, Number(ms) || 2600)}ms`);
  el.innerHTML = `
    <div class="toastTop">
      <div class="toastTitle">${escapeHtml(String(title || trText("Уведомление", "Notice")))}</div>
    </div>
    <div class="toastText">${escapeHtml(String(text || ""))}</div>
    <div class="toastBar"><div class="toastBarFill"></div></div>
  `.trim();
  host.appendChild(el);
  void playPurchaseSound();
  window.setTimeout(() => {
    try { el.remove(); } catch {}
  }, Math.max(800, Number(ms) || 2600));
}

async function pollBattleChat() {
  if (!state.token) return;
  if (!state.webBattleActive) return;
  if (!state.currentBattleId) return;
  try {
    const data = await api(`/api/chat/battle/${encodeURIComponent(state.currentBattleId)}?after_id=${encodeURIComponent(state.battleChatAfterId)}&limit=50`);
    const msgs = data?.messages || [];
    if (msgs.length) {
      state.battleChatAfterId = Math.max(state.battleChatAfterId, ...msgs.map((m) => Number(m.id || 0)));
      renderBattleChatMessages(msgs, { append: true });

      const myId = Number(state.profile?.user_id || 0);
      const incoming = msgs.filter((m) => Number(m.user_id || 0) !== myId);
      if (incoming.length) {
        const last = incoming[incoming.length - 1];
        const from = String(last.name || trText("Игрок", "Player"));
        const txt = String(last.message || "");
        void playPurchaseSound();
        showToast(`${from}: ${txt}`, { title: trText("ЧАТ БОЯ", "BATTLE CHAT"), ms: 2600 });
      }
    }
  } catch {}
}

async function sendBattleChat(text) {
  if (!state.currentBattleId) return;
  await api(`/api/chat/battle/${encodeURIComponent(state.currentBattleId)}`, { method: "POST", body: JSON.stringify({ message: String(text || "") }) });
  await pollBattleChat();
}

function ranksOptionsHtml(selectedId) {
  const list = Array.isArray(state.ranks) ? state.ranks : [];
  if (!list.length) return `<option value="1">${trText("Новобранец", "Recruit")}</option>`;
  return list.map((r) => {
    const id = Number(r.id || 1);
    const name = trRankName(String(r.name || `Rank ${id}`));
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
  const cov = qs("lobbyCoverMap");
  const mode = qs("lobbyPvpMode");
  const dmWrap = qs("lobbyDeathmatchOptions");
  const dmSec = qs("lobbyMatchSeconds");
  const dmKills = qs("lobbyTargetKills");
  const noStats = qs("lobbyNoStatsUpdate");
  if (!modal || !name || !allow || !minSel || !maxSel || !rangeWrap) return;
  name.value = "";
  allow.checked = true;
  rangeWrap.style.opacity = "0.45";
  rangeWrap.style.pointerEvents = "none";
  minSel.innerHTML = ranksOptionsHtml(1);
  maxSel.innerHTML = ranksOptionsHtml(31);
  if (cov) cov.value = "random";
  if (mode) mode.value = "classic";
  if (dmWrap) dmWrap.style.display = "none";
  if (dmSec) dmSec.value = "120";
  if (dmKills) dmKills.value = "5";
  if (noStats) noStats.checked = false;
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

function rankImageUrlFromId(rankId) {
  const id = Math.max(1, Math.min(31, Number(rankId) || 1));
  return `/images/rank${id}.png`;
}

/** Лобби: звание поверх премиум-ленты (как в профиле), компактные размеры. */
function lobbyCreatorRankRowHtml(lb) {
  const raw = lb?.creator_rank_image_url ? String(lb.creator_rank_image_url) : rankImageUrlFromId(1);
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const url = absUrl(path);
  const prem = Boolean(lb?.creator_is_premium);
  const premSrc = absUrl(PREMIUM_BADGE_PATH);
  const rankImg = `<img class="battleLobbyRankIcon rankIconFront" src="${url}" alt="" loading="lazy">`;
  if (prem) {
    return `<span class="battleLobbyRankStack rankPremiumStack battleLobbyRankPremium rankPremiumStack--hasPremium">
      <img class="premiumBadgeLayer" src="${premSrc}" alt="">
      ${rankImg}
    </span>`;
  }
  return `<span class="battleLobbyRankStack rankPremiumStack battleLobbyRankPremium">${rankImg}</span>`;
}

function lobbyRankRangeCaption(lb) {
  if (!lb) return "Все звания";
  if (lb.allow_all_ranks) return "Все звания";
  const a = String(lb.min_rank_name || "—").trim();
  const b = String(lb.max_rank_name || "—").trim();
  if (a && b && a === b) return a;
  if (a && b) return `${a} — ${b}`;
  return "—";
}

function lobbyRankRangeStripHtml(lb) {
  let ids;
  if (lb.allow_all_ranks) {
    ids = [1, 31];
  } else {
    const minId = Math.max(1, Math.min(31, Number(lb.min_rank_id) || 1));
    const maxId = Math.max(1, Math.min(31, Number(lb.max_rank_id) || 31));
    ids = minId === maxId ? [minId] : [minId, maxId];
  }
  const imgs = ids.map(
    (id) => `<img class="battleLobbyStripIcon" src="${absUrl(rankImageUrlFromId(id))}" alt="" loading="lazy">`,
  );
  if (ids.length === 2) {
    return `${imgs[0]}<span class="battleLobbyRangeDash" aria-hidden="true">—</span>${imgs[1]}`;
  }
  return imgs[0];
}

function lobbyCardHtml(lb) {
  const title = escapeHtml(String(lb.name || "Бой"));
  const creator = escapeHtml(String(lb.creator_name || "Игрок"));
  const time = Math.max(0, Math.floor(Number(lb.expires_in || 0)));
  const expiresAt = Date.now() + time * 1000;
  const rankStrip = lobbyRankRangeStripHtml(lb);
  const mapBrief = escapeHtml(lobbyCoverMapCaption(lb));
  const mode = String(lb?.pvp_mode || "classic");
  const modeBrief = mode === "deathmatch"
    ? `Режим: DM • ${Number(lb?.target_kills || 5)} килл. • ${Number(lb?.match_seconds || 120)}с`
    : "Режим: классический";
  const statsTag = lb?.no_stats_update
    ? `<span class="battleLobbyTag">📊 Стата: выкл</span>`
    : `<span class="battleLobbyTag">📊 Стата: вкл</span>`;
  return `<button class="battleLobbyCard" type="button" data-lobby="${String(lb.lobby_id || "")}">
    <div class="battleLobbyName">${title}</div>
    <div class="battleLobbyMapBrief">${mapBrief}</div>
    <div class="battleLobbyMapBrief">${escapeHtml(modeBrief)}</div>
    <div class="battleLobbyMeta">
      <span class="battleLobbyTag battleLobbyCreatorTag">${lobbyCreatorRankRowHtml(lb)}<span class="battleLobbyCreatorName">${creator}</span></span>
      <span class="battleLobbyTag battleLobbyRangeTag">${rankStrip}</span>
      ${statsTag}
      <span class="battleLobbyTag battleLobbyTimerTag" data-expires-at="${expiresAt}">⏳ ${time}с</span>
    </div>
  </button>`;
}

function lobbyStaticSig(lb) {
  if (!lb) return "";
  return [
    lb.lobby_id,
    lb.name,
    lb.creator_id,
    lb.creator_name,
    lb.creator_rank_image_url,
    lb.creator_is_premium ? 1 : 0,
    lb.allow_all_ranks ? 1 : 0,
    lb.min_rank_id,
    lb.max_rank_id,
    lb.cover_map,
    lb.pvp_mode,
    lb.match_seconds,
    lb.target_kills,
  ].join("\x1f");
}

function lobbyCoverMapCaption(lb) {
  const v = String(lb?.cover_map || "random").toLowerCase();
  if (v === "with") return "Карта: с укрытиями";
  if (v === "without") return "Карта: без укрытий";
  return "Карта: случайная";
}

function lobbiesContentKey(lobbies) {
  const arr = [...(lobbies || [])].sort((a, b) => String(a.lobby_id).localeCompare(String(b.lobby_id)));
  return arr.map(lobbyStaticSig).join("|");
}

function tickLobbyTimersDom() {
  let removedAny = false;
  document.querySelectorAll(".battleLobbyTimerTag[data-expires-at]").forEach((el) => {
    const exp = Number(el.dataset.expiresAt);
    if (!Number.isFinite(exp)) return;
    const s = Math.max(0, Math.floor((exp - Date.now()) / 1000));
    el.textContent = `⏳ ${s}с`;
    if (s <= 0) {
      const card = el.closest("button.battleLobbyCard");
      if (card) {
        removedAny = true;
        try { card.remove(); } catch {}
      }
    }
  });
  if (removedAny) {
    // Force refresh to sync with server cleanup.
    state.lastLobbiesFetchAt = 0;
    void refreshLobbies(true);
  }
}

function ensureLobbyTicker() {
  if (state.lobbyTicker) return;
  // Lightweight ticker: only updates countdown text + auto-removes expired cards.
  state.lobbyTicker = window.setInterval(() => {
    tickLobbyTimersDom();
  }, 450);
}

function stopLobbyTicker() {
  if (!state.lobbyTicker) return;
  window.clearInterval(state.lobbyTicker);
  state.lobbyTicker = null;
}

function startLobbiesPolling() {
  // Disabled: background polling was causing Battles tab to constantly rerender for some users.
  return;
}

function stopLobbiesPolling() {
  if (!state.lobbiesPollTimer) return;
  window.clearInterval(state.lobbiesPollTimer);
  state.lobbiesPollTimer = null;
}

function patchLobbyTimersOnly() {
  const list = qs("battleLobbiesList");
  if (!list) return;
  for (const lb of state.lobbies || []) {
    const id = String(lb.lobby_id || "");
    const btn = list.querySelector(`button.battleLobbyCard[data-lobby="${CSS.escape(id)}"]`);
    const el = btn?.querySelector(".battleLobbyTimerTag");
    if (!el) continue;
    const t = Math.max(0, Math.floor(Number(lb.expires_in || 0)));
    const exp = Date.now() + t * 1000;
    el.dataset.expiresAt = String(exp);
    el.textContent = `⏳ ${t}с`;
  }
  tickLobbyTimersDom();
}

function renderLobbies() {
  const section = qs("battleLobbiesSection");
  const list = qs("battleLobbiesList");
  const createBtnWrap = qs("createLobbyBtn")?.closest(".battleLobbyCreateWrap");
  if (!section || !list) return;
  const modesVisible = (qs("battleModesGrid")?.style.display || "grid") !== "none";
  const botCardVisible = (qs("battleBotCard")?.style.display || "none") !== "none";
  const pvpCardVisible = (qs("battlePlayerCard")?.style.display || "none") !== "none";
  const inArena = (qs("battleArena")?.style.display || "none") !== "none" || Boolean(state.webBattleActive);
  const show = modesVisible && !inArena && !botCardVisible && !pvpCardVisible;
  if (createBtnWrap) createBtnWrap.style.display = show ? "flex" : "none";
  section.style.display = show ? "block" : "none";
  if (!show) {
    stopLobbyTicker();
    return;
  }
  const lobbies = Array.isArray(state.lobbies) ? state.lobbies : [];
  if (!lobbies.length) {
    stopLobbyTicker();
    list.innerHTML = `<div class="leadersEmpty" style="grid-column:1/-1;">${tr("lobby_empty")}</div>`;
    return;
  }
  list.innerHTML = lobbies.map(lobbyCardHtml).join("");
  ensureLobbyTicker();
  tickLobbyTimersDom();
}

function syncPendingHostLobbyAfterListFetch(next) {
  if (!state.pendingHostLobbyId) return;
  const arr = Array.isArray(next) ? next : [];
  const still = arr.some((lb) => String(lb.lobby_id || "") === String(state.pendingHostLobbyId));
  if (still) {
    state.pendingHostLobbyMissingSince = 0;
    return;
  }
  // Lobby may disappear exactly when opponent joins; try entering battle first.
  if (!state.pendingHostLobbyMissingSince) state.pendingHostLobbyMissingSince = Date.now();
  void battleTryEnterFromLobbyHost();
  // Safety: clear stale pending state after a timeout.
  if (Date.now() - Number(state.pendingHostLobbyMissingSince || 0) > 30000) {
    state.pendingHostLobbyId = null;
    state.pendingHostLobbyMissingSince = 0;
  }
}

async function refreshLobbies(force = false) {
  // Throttle to avoid constant rerenders/spinner in "Бои" tab.
  // Timers are updated locally by tickLobbyTimersDom().
  const now = Date.now();
  if (!force && now - Number(state.lastLobbiesFetchAt || 0) < 6000) {
    return;
  }
  state.lastLobbiesFetchAt = now;
  try {
    const data = await api("/api/battle/lobbies/list");
    const next = data?.lobbies || [];
    const prev = state.lobbies || [];
    if (prev.length && next.length && lobbiesContentKey(prev) === lobbiesContentKey(next)) {
      state.lobbies = next;
      syncPendingHostLobbyAfterListFetch(next);
      patchLobbyTimersOnly();
      return;
    }
    state.lobbies = next;
    syncPendingHostLobbyAfterListFetch(next);
    renderLobbies();
  } catch {
    state.lobbies = [];
    if (state.pendingHostLobbyId) void battleTryEnterFromLobbyHost();
    renderLobbies();
  }
}

async function createLobbyFromModal() {
  const name = String(qs("lobbyNameInput")?.value || "").trim();
  const allow = Boolean(qs("lobbyAllowAllRanks")?.checked);
  const minId = Number(qs("lobbyMinRank")?.value || 1);
  const maxId = Number(qs("lobbyMaxRank")?.value || 31);
  const noStatsUpdate = Boolean(qs("lobbyNoStatsUpdate")?.checked);
  let coverMap = String(qs("lobbyCoverMap")?.value || "random").trim().toLowerCase();
  if (!["random", "with", "without"].includes(coverMap)) coverMap = "random";
  let pvpMode = String(qs("lobbyPvpMode")?.value || "classic").trim().toLowerCase();
  if (!["classic", "deathmatch"].includes(pvpMode)) pvpMode = "classic";
  const matchSecondsRaw = Number(qs("lobbyMatchSeconds")?.value || 120);
  const targetKillsRaw = Number(qs("lobbyTargetKills")?.value || 5);
  const matchSeconds = Number.isFinite(matchSecondsRaw) ? Math.max(60, Math.min(600, Math.floor(matchSecondsRaw))) : 120;
  const targetKills = Number.isFinite(targetKillsRaw) ? Math.max(1, Math.min(30, Math.floor(targetKillsRaw))) : 5;
  const created = await api("/api/battle/lobbies/create", {
    method: "POST",
    body: JSON.stringify({
      name,
      allow_all_ranks: allow,
      min_rank_id: allow ? null : minId,
      max_rank_id: allow ? null : maxId,
      cover_map: coverMap,
      no_stats_update: noStatsUpdate,
      pvp_mode: pvpMode,
      match_seconds: pvpMode === "deathmatch" ? matchSeconds : null,
      target_kills: pvpMode === "deathmatch" ? targetKills : null,
    }),
  });
  const lid = String(created?.lobby?.lobby_id || "").trim();
  state.pendingHostLobbyId = lid || null;
  state.pendingHostLobbyMissingSince = 0;
  closeCreateLobbyModal();
  await refreshLobbies(true);
  clearError();
}

function openJoinLobbyModal(lb) {
  const modal = qs("joinLobbyModal");
  if (!modal) return;
  state.joinLobbyId = String(lb.lobby_id || "");
  const cname = String(lb.creator_name || "Игрок");
  qs("joinLobbyLabel").textContent = `Вступить в бой игрока ${cname}?`;
  const hint = qs("joinLobbyBattleHint");
  if (hint) {
    const title = escapeHtml(String(lb.name || "Бой"));
    const mapLine = escapeHtml(lobbyCoverMapCaption(lb));
    hint.innerHTML = `${title}<br /><span class="joinLobbyMapHint">${mapLine}</span>`;
  }
  const nick = qs("joinLobbyCreatorName");
  if (nick) nick.textContent = cname;
  const meta = qs("joinLobbyRankMeta");
  if (meta) {
    const cap = lobbyRankRangeCaption(lb);
    meta.innerHTML = `<span class="joinLobbyRankIconsInline">${lobbyRankRangeStripHtml(lb)}</span><span class="joinLobbyRankCap">${escapeHtml(cap)}</span>`;
  }
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
  coverCells = [],
  showPlayerHint = false,
) {
  const map = qs("battleMap");
  if (!map) return;
  const size = Number(mapSize || 5);
  map.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  const coverSet = new Set(
    (Array.isArray(coverCells) ? coverCells : []).map((p) => `${Number(p[0])},${Number(p[1])}`),
  );
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
          marker.textContent = tr("battle_you");
        }
        cell.appendChild(marker);
        if (showPlayerHint) {
          const hint = document.createElement("div");
          hint.className = "battlePlayerHintArrow";
          hint.setAttribute("aria-hidden", "true");
          hint.textContent = "⬇";
          cell.appendChild(hint);
        }
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
          marker.textContent = tr("battle_op");
        }
        cell.appendChild(marker);
      } else if (coverSet.has(`${r},${c}`)) {
        cell.classList.add("isCover");
        cell.innerHTML = '<span class="battleCoverMark" aria-hidden="true">▣</span>';
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
    log.innerHTML = `<div class="battleLogItem">${tr("battle_no_events")}</div>`;
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

function battleFinishReasonText(st) {
  const reason = String(st?.finish_reason || "");
  if (reason === "inactive_kick") {
    return st?.winner === "player"
      ? "Победа: противник был выкинут за неактив."
      : "Поражение: вы были выкинуты за неактив.";
  }
  if (reason === "surrender") {
    return st?.winner === "player"
      ? "Победа: противник сдался."
      : "Поражение: вы сдались.";
  }
  return st?.winner === "player" ? "Противник уничтожен в бою." : "Ваш танк уничтожен в бою.";
}

function hidePvpInviteModal() {
  const modal = qs("pvpInviteModal");
  if (modal) modal.style.display = "none";
  if (state.inviteCountdownTimer) {
    clearInterval(state.inviteCountdownTimer);
    state.inviteCountdownTimer = null;
  }
  state.activeInviteExpireAt = 0;
  state.activeInviteId = null;
}

function startInviteCountdown() {
  const timeEl = qs("pvpInviteTime");
  if (!timeEl) return;
  if (state.inviteCountdownTimer) {
    clearInterval(state.inviteCountdownTimer);
    state.inviteCountdownTimer = null;
  }
  const tick = () => {
    if (!state.activeInviteExpireAt) {
      timeEl.textContent = "0 сек";
      return;
    }
    const left = Math.max(0, Math.ceil((state.activeInviteExpireAt - Date.now()) / 1000));
    timeEl.textContent = `${left} сек`;
    if (left <= 0 && state.inviteCountdownTimer) {
      clearInterval(state.inviteCountdownTimer);
      state.inviteCountdownTimer = null;
      hidePvpInviteModal();
    }
  };
  tick();
  state.inviteCountdownTimer = setInterval(tick, 250);
}

async function openInviteModal(inviteId) {
  if (!inviteId) return;
  state.activeInviteId = inviteId;
  let info;
  try {
    info = await api(`/api/battle/player/invites/by-id/${encodeURIComponent(inviteId)}`);
  } catch {
    state.activeInviteId = null;
    return;
  }
  const modal = qs("pvpInviteModal");
  if (!modal) {
    state.activeInviteId = null;
    return;
  }
  void playPurchaseSound();
  const inviterName = escapeHtml(String(info.inviter_name || "Игрок"));
  const inviterRank = String(info.inviter_rank_image_url || "");
  const invPrem = Boolean(info.inviter_has_premium);
  const invBg = withCacheBust(absUrl(PREMIUM_BADGE_PATH));
  const invStack = inviterRank
    ? (invPrem
      ? `<span class="battleRankPremiumCol rankPremiumStack--hasPremium"><img class="premiumBadgeLayer" src="${invBg}" alt=""><img class="battleRankIcon" src="${absUrl(inviterRank)}" alt="rank"></span>`
      : `<span class="battleRankPremiumCol"><img class="battleRankIcon" src="${absUrl(inviterRank)}" alt="rank"></span>`)
    : "";
  qs("pvpInviteName").innerHTML = `${invStack}${inviterName}`;
  state.activeInviteExpireAt = Date.now() + (Math.max(0, Number(info.expires_in || 0)) * 1000);
  startInviteCountdown();
  modal.style.display = "flex";
}

async function updateOutgoingInviteState() {
  const sendBtn = qs("sendPvpInviteBtn");
  const cancelBtn = qs("cancelPvpInviteBtn");
  const hint = qs("pvpInviteHint");
  if (!sendBtn || !cancelBtn) return;
  const prevOutgoingId = state.outgoingInviteId;
  try {
    const data = await api("/api/battle/player/invites/outgoing");
    const inv = data?.invite || null;
    state.outgoingInviteId = inv?.invite_id || null;
    const hasOutgoing = Boolean(state.outgoingInviteId);
    sendBtn.disabled = hasOutgoing;
    cancelBtn.style.display = hasOutgoing ? "block" : "none";
    if (hasOutgoing && hint) hint.textContent = `Приглашение активно (${Math.max(0, Number(inv.expires_in || 0))} сек).`;
    if (!hasOutgoing && hint && hint.textContent.includes("Приглашение активно")) hint.textContent = "";
    // Исходящее приглашение пропало (приняли / отменили / истекло) — один раз подтянуть бой, без спама poll.
    if (prevOutgoingId && !state.outgoingInviteId) {
      void battleFetchState();
    }
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
      const low = String(notice.message || "").toLowerCase();
      if (low.includes("приглашение в бой от") || low.includes("открой вкладку «бои»")) return;
      // Always toast normal notices (turn changes, invite decline/cancel/expire, etc).
      if (low.includes("заблок") || low.includes("ban") || low.includes("запрет") || low.includes("доступ") || low.includes("ошиб")) {
        setError(String(notice.message));
      } else {
        showToast(String(notice.message), { title: tr("notice_title"), ms: 3200 });
      }
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
  state.damageAcc ??= { player: 0, bot: 0 };
  state.damageAcc[side] = Math.max(0, Number(state.damageAcc[side] || 0)) + dmg;
  el.textContent = `-${state.damageAcc[side]} ${tr("damage_unit")}`;
  el.style.display = "inline-flex";
  el.classList.add("isShow");
  const prevTimer = state.damageHintTimers[side];
  if (prevTimer) clearTimeout(prevTimer);
  state.damageHintTimers[side] = setTimeout(() => {
    el.classList.remove("isShow");
    el.style.display = "none";
    state.damageHintTimers[side] = null;
    if (state.damageAcc) state.damageAcc[side] = 0;
  }, 1100);
}

function showMarkerDamage(side, amount) {
  const dmg = Math.max(0, Number(amount || 0));
  if (!dmg) return;
  state.markerDamageAcc ??= { player: 0, bot: 0 };
  state.markerDamageAcc[side] = Math.max(0, Number(state.markerDamageAcc[side] || 0)) + dmg;
  const marker = document.querySelector(`.battleMarker.${side === "player" ? "isPlayer" : "isBot"}`);
  if (!marker) return;
  marker.querySelector(".battleMarkerDamage")?.remove();
  const badge = document.createElement("div");
  badge.className = "battleMarkerDamage";
  badge.textContent = `-${state.markerDamageAcc[side]}`;
  marker.appendChild(badge);
  const prev = state.markerDamageTimers[side];
  if (prev) clearTimeout(prev);
  state.markerDamageTimers[side] = setTimeout(() => {
    badge.remove();
    state.markerDamageTimers[side] = null;
    if (state.markerDamageAcc) state.markerDamageAcc[side] = 0;
  }, 900);
}

function startCooldownTicker() {
  if (state.battleCooldownTimer) return;
  state.battleCooldownTimer = setInterval(() => {
    const st = state.battleLastState;
    const cd = qs("battleCooldown");
    if (!cd) return;
    const remaining = Number(st?.cooldown_remaining || 0);
    cd.textContent = remaining > 0 ? `${tr("battle_cooldown")}: ${remaining}s` : "";
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
    title.textContent = tr("battles_title_modes");
    return;
  }
  title.textContent = isPvp ? tr("battles_title_pvp") : tr("battles_title_bot");
}

function showBattleLoadingOverlay(visible) {
  const el = qs("battleLoadingOverlay");
  if (!el) return;
  const v = Boolean(visible);
  el.style.display = v ? "flex" : "none";
  el.setAttribute("aria-hidden", v ? "false" : "true");
}

/** Сетка режимов + лобби: арена и подкарточки режимов скрыты. */
function exitBattleArenaToModes() {
  const arena = qs("battleArena");
  const modes = qs("battleModesGrid");
  const botCard = qs("battleBotCard");
  const pvpCard = qs("battlePlayerCard");
  if (arena) arena.style.display = "none";
  if (botCard) botCard.style.display = "none";
  if (pvpCard) pvpCard.style.display = "none";
  if (modes) modes.style.display = "grid";
  setBattlesTitle(false);
  renderLobbies();
}

function resetBattleUI() {
  exitBattleArenaToModes();
  const surrenderBtn = qs("battleSurrenderBtn");
  if (surrenderBtn) surrenderBtn.disabled = false;
  stopBattlePolling();
  lockMainTabs(false);
  setBattlesTitle(false);
  state.webBattleActive = false;
  state.currentBattleId = null;
  state.battleChatAfterId = 0;
  const battleChatList = qs("battleChatList");
  if (battleChatList) battleChatList.innerHTML = "";
  const battleChatWrap = qs("battleChatWrap");
  if (battleChatWrap) battleChatWrap.style.display = "none";
  state.rankUpModalBattleId = null;
  state.battleOutcomeModalBattleId = null;
  state.battleAmbientStoppedForBattleId = null;
  state.battleResultAckBattleId = null;
  state.battleResultClosing = false;
  state.battleAutoCloseResultId = null;
  state.battleMapSignature = "";
  if (state.battleMusicDelayTimer) {
    clearTimeout(state.battleMusicDelayTimer);
    state.battleMusicDelayTimer = null;
  }
  state.battleMusicStartedForId = null;
  showBattleLoadingOverlay(false);
  if (state.battleHintHideTimer) {
    clearTimeout(state.battleHintHideTimer);
    state.battleHintHideTimer = null;
  }
  state.battleHintBattleId = null;
  state.battlePlayerHintUntil = 0;
  state.lastLobbiesFetchAt = 0;
  void refreshLobbies();
}

function showBattleResultModal(win, reasonText = "", battleId = "") {
  const modal = qs("battleResultModal");
  const title = qs("battleResultTitle");
  const banner = qs("battleResultBanner");
  const icon = qs("battleResultIcon");
  const text = qs("battleResultText");
  if (!modal || !title || !banner) return;
  const bid = String(battleId || "");
  if (bid && state.battleResultShownBattleId === bid && modal.style.display === "flex") return;
  if (bid) state.battleResultShownBattleId = bid;
  const isWin = Boolean(win);
  title.textContent = isWin ? tr("battle_victory") : tr("battle_defeat");
  banner.classList.toggle("isLose", !isWin);
  if (icon) icon.textContent = isWin ? "🏆" : "💥";
  if (text) {
    text.textContent = String(reasonText || (isWin
      ? "Ты уничтожил соперника! Отличный бой. Нажми вне окна, чтобы продолжить."
      : "Бой проигран, но это опыт. Нажми вне окна, чтобы вернуться и попробовать снова."));
  }
  modal.style.display = "flex";
  modal.classList.remove("isOpen");
  requestAnimationFrame(() => {
    modal.classList.add("isOpen");
  });
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
  if (state.battleResultClosing) return;
  state.battleResultClosing = true;
  const battleId = String(state.currentBattleId || state.battleLastState?.battle_id || "");
  if (battleId) state.battleResultAckBattleId = battleId;
  const modal = qs("battleResultModal");
  if (modal) {
    modal.classList.remove("isOpen");
    window.setTimeout(() => { try { modal.style.display = "none"; } catch {} }, 240);
  }
  // Tell server to drop finished battle so a new one can start immediately.
  try {
    await apiKeepalive("/api/battle/ack", { method: "POST" });
  } catch {}
  // Soft reset: clear battle UI/state without full page reload.
  state.battleLastState = null;
  state.battleAutoCloseResultId = null;
  resetBattleUI();
  if (state.token) {
    try { await refreshAll(); } catch (e) { setError(prettyError(e)); }
  }
}

async function battlePollOnce() {
  try {
    const st = await api("/api/battle/state");
    renderBattleState(st);
    if (st.active && !st.game_over) startBattlePolling();
  } catch {}
}

/** Создатель лобби: соперник зашёл — бой активен на сервере, но webBattleActive ещё false; без полного render при ожидании. */
async function battleTryEnterFromLobbyHost() {
  if (!state.pendingHostLobbyId || state.webBattleActive) return;
  try {
    const st = await api("/api/battle/state");
    if (!st?.active) return;
    state.pendingHostLobbyId = null;
    state.pendingHostLobbyMissingSince = 0;
    if (state.activeTab !== "battles") await showTab("battles", { force: true });
    renderBattleState(st);
    if (!st.game_over) startBattlePolling();
  } catch {}
}

function startBattlePolling() {
  if (state.battlePollTimer) return;
  state.battlePollTimer = setInterval(() => {
    void battlePollOnce();
  }, 350);
}

function stopBattlePolling() {
  if (!state.battlePollTimer) return;
  clearInterval(state.battlePollTimer);
  state.battlePollTimer = null;
}

function renderBattleState(st) {
  if (!st) return;
  const prev = state.battleLastState;
  const prevBattleId = state.currentBattleId;
  state.battleLastState = st;

  if (st.active !== true) {
    exitBattleArenaToModes();
    stopBattlePolling();
    lockMainTabs(false);
    state.webBattleActive = false;
    state.currentBattleId = null;
    state.battleChatAfterId = 0;
    const battleChatList = qs("battleChatList");
    if (battleChatList) battleChatList.innerHTML = "";
    const battleChatWrap = qs("battleChatWrap");
    if (battleChatWrap) battleChatWrap.style.display = "none";
    state.battleMapSignature = "";
    state.battleAmbientStoppedForBattleId = null;
    state.battleResultAckBattleId = null;
    state.battleResultClosing = false;
    if (state.battleMusicDelayTimer) {
      clearTimeout(state.battleMusicDelayTimer);
      state.battleMusicDelayTimer = null;
    }
    state.battleMusicStartedForId = null;
    state.paladinDashMode = false;
    showBattleLoadingOverlay(false);
    if (state.battleHintHideTimer) {
      clearTimeout(state.battleHintHideTimer);
      state.battleHintHideTimer = null;
    }
    state.battleHintBattleId = null;
    state.battlePlayerHintUntil = 0;
    void stopBattleAmbient();
    return;
  }

  state.activeInviteId = null;
  state.pendingHostLobbyId = null;
  hidePvpInviteModal();
  if (st.battle_id) {
    const nextBattleId = String(st.battle_id);
    state.currentBattleId = nextBattleId;
    if (prevBattleId && prevBattleId !== nextBattleId) {
      state.battleChatAfterId = 0;
      const battleChatList = qs("battleChatList");
      if (battleChatList) battleChatList.innerHTML = "";
      state.rankUpModalBattleId = null;
      state.battleOutcomeModalBattleId = null;
      state.battleAmbientStoppedForBattleId = null;
      state.battleResultAckBattleId = null;
      state.battleResultClosing = false;
      if (state.battleHintHideTimer) {
        clearTimeout(state.battleHintHideTimer);
        state.battleHintHideTimer = null;
      }
      state.battleHintBattleId = null;
      state.battlePlayerHintUntil = 0;
    }
  }
  const battleChatWrap = qs("battleChatWrap");
  if (battleChatWrap) battleChatWrap.style.display = "block";
  const modes = qs("battleModesGrid");
  const botCard = qs("battleBotCard");
  const pvpCard = qs("battlePlayerCard");
  const arena = qs("battleArena");
  if (modes) modes.style.display = "none";
  if (botCard) botCard.style.display = "none";
  if (pvpCard) pvpCard.style.display = "none";
  if (arena) arena.style.display = "block";
  setBattlesTitle(true, Boolean(st.is_pvp));
  // Hide "create battle" immediately when entering arena.
  renderLobbies();

  if (st.active && !st.game_over) {
    const bid = String(st.battle_id || "");
    if (bid && state.battleHintBattleId !== bid) {
      state.battleHintBattleId = bid;
      state.battlePlayerHintUntil = Date.now() + 5000;
      if (state.battleHintHideTimer) clearTimeout(state.battleHintHideTimer);
      state.battleHintHideTimer = window.setTimeout(() => {
        state.battleHintHideTimer = null;
        state.battlePlayerHintUntil = 0;
        state.battleMapSignature = "";
        const lasts = state.battleLastState;
        if (lasts?.active && !lasts.game_over) {
          const noHintSig = JSON.stringify([
            lasts.map_size,
            lasts.player_pos,
            lasts.bot_pos,
            lasts.player_tank_image_url,
            lasts.bot_tank_image_url,
            Boolean(lasts.aiming),
            Boolean(lasts.opponent_aiming),
            lasts.cover_cells || [],
            0,
          ]);
          state.battleMapSignature = noHintSig;
          renderBattleMap(
            lasts.map_size,
            lasts.player_pos,
            lasts.bot_pos,
            lasts.player_tank_image_url,
            lasts.bot_tank_image_url,
            Boolean(lasts.aiming),
            Boolean(lasts.opponent_aiming),
            lasts.cover_cells || [],
            false,
          );
        }
      }, 5000);
    }
  }

  const showTankHint = Boolean(st.active && !st.game_over && Date.now() < state.battlePlayerHintUntil);
  const mapSig = JSON.stringify([
    st.map_size,
    st.player_pos,
    st.bot_pos,
    st.player_tank_image_url,
    st.bot_tank_image_url,
    Boolean(st.aiming),
    Boolean(st.opponent_aiming),
    st.cover_cells || [],
    showTankHint ? 1 : 0,
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
      st.cover_cells || [],
      showTankHint,
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
    const dmMark = st.pvp_mode === "deathmatch" ? ` • Киллы: ${Number(st.player_kills || 0)}` : "";
    pH.textContent = `🛡 ${st.player_hull_name || state.profile?.hull || "—"}${dmMark}${turnMark}`;
  }
  const bW = qs("battleBotWeapon");
  if (bW) bW.textContent = `🔫 ${st.bot_weapon_name || "—"}`;
  const aimState = qs("battleAimState");
  if (aimState) {
    aimState.style.display = st.aiming ? "inline-flex" : "none";
    aimState.classList.toggle("isActive", Boolean(st.aiming));
  }
  const premSrc = absUrl(state.profile?.premium_badge_url || PREMIUM_BADGE_PATH);
  const playerTitle = qs("battlePlayerTitle");
  if (playerTitle) {
    if (st.is_pvp) {
      const pName = escapeHtml(String(st.player_name || state.profile?.name || state.viewerName || "Игрок"));
      const pRank = String(st.player_rank_image_url || state.profile?.rank_image_url || "");
      const pStack = pRank
        ? (st.player_has_premium
          ? `<span class="battleRankPremiumCol rankPremiumStack--hasPremium"><img class="premiumBadgeLayer" src="${premSrc}" alt=""><img class="battleRankIcon" src="${absUrl(pRank)}" alt="rank"></span>`
          : `<span class="battleRankPremiumCol"><img class="battleRankIcon" src="${absUrl(pRank)}" alt="rank"></span>`)
        : "";
      playerTitle.innerHTML = `${pStack}${pName}`;
    } else {
      playerTitle.textContent = "ВАШ ТАНК";
    }
  }
  const oppTitle = qs("battleOpponentTitle");
  if (oppTitle) {
    if (st.is_pvp) {
      const oName = escapeHtml(String(st.opponent_name || "Соперник"));
      const oRank = String(st.opponent_rank_image_url || "");
      const oStack = oRank
        ? (st.opponent_has_premium
          ? `<span class="battleRankPremiumCol rankPremiumStack--hasPremium"><img class="premiumBadgeLayer" src="${premSrc}" alt=""><img class="battleRankIcon" src="${absUrl(oRank)}" alt="rank"></span>`
          : `<span class="battleRankPremiumCol"><img class="battleRankIcon" src="${absUrl(oRank)}" alt="rank"></span>`)
        : "";
      oppTitle.innerHTML = `${oStack}${oName}`;
    } else {
      oppTitle.textContent = "ПРОТИВНИК";
    }
  }
  const bH = qs("battleBotHull");
  if (bH) {
    const enemyTurn = st.is_pvp ? (!st.is_player_turn ? " • Ходит сейчас" : "") : "";
    const dmEnemy = st.pvp_mode === "deathmatch" ? ` • Киллы: ${Number(st.opponent_kills || 0)}` : "";
    bH.textContent = `🛡 ${st.bot_hull_name || "—"}${dmEnemy}${enemyTurn}`;
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
  const palBtn = qs("battlePaladinStepBtn");
  if (palBtn) {
    const hullName = String(st.player_hull_name || "").toLowerCase();
    const isPaladin = hullName.includes("паладин");
    palBtn.style.display = isPaladin ? "block" : "none";
    if (!isPaladin) state.paladinDashMode = false;
    palBtn.textContent = state.paladinDashMode ? "Ход: рывок x2" : "Ход: 1 клетка";
    palBtn.disabled = Boolean(st.cooldown_remaining > 0) || isLockedByTurn || Boolean(st.game_over);
  }

  state.webBattleActive = Boolean(st.active) && !Boolean(st.game_over);
  startCooldownTicker();
  if (state.webBattleActive) {
    lockMainTabs(true);
    startBattlePolling();
    const bid = String(st.battle_id || "");
    if (bid && state.battleMusicStartedForId !== bid) {
      if (state.battleMusicDelayTimer) {
        clearTimeout(state.battleMusicDelayTimer);
        state.battleMusicDelayTimer = null;
      }
      state.battleMusicStartedForId = bid;
      showBattleLoadingOverlay(true);
      state.battleMusicDelayTimer = window.setTimeout(() => {
        state.battleMusicDelayTimer = null;
        showBattleLoadingOverlay(false);
        if (String(state.currentBattleId || "") === bid && state.webBattleActive && state.bgMusicEnabled) {
          void startBattleAmbient();
        }
      }, 1600);
    }
  }

  const turn = qs("battleTurnTimer");
  if (turn) {
    if (st.is_pvp) {
      if (st.pvp_mode === "deathmatch") {
        turn.textContent = `DM: ${Number(st.player_kills || 0)}:${Number(st.opponent_kills || 0)} • ${Math.max(0, Number(st.pvp_time_left || 0))}с`;
      } else {
        turn.textContent = "";
      }
    } else {
      const t = Number(st.turn_remaining || 0);
      turn.textContent = t > 0 ? `Время хода: ${t}с` : "";
    }
  }

  if (st.game_over) {
    const battleId = String(st.battle_id || "");
    if (battleId && state.battleAmbientStoppedForBattleId !== battleId) {
      state.battleAmbientStoppedForBattleId = battleId;
      void stopBattleAmbient();
    }
    if (state.battleMusicDelayTimer) {
      clearTimeout(state.battleMusicDelayTimer);
      state.battleMusicDelayTimer = null;
    }
    if (state.battleHintHideTimer) {
      clearTimeout(state.battleHintHideTimer);
      state.battleHintHideTimer = null;
    }
    state.battleHintBattleId = null;
    state.battlePlayerHintUntil = 0;
    state.battleMusicStartedForId = null;
    showBattleLoadingOverlay(false);
    state.webBattleActive = false;
    stopCooldownTicker();
    lockMainTabs(false);
    if (aimBtn) aimBtn.disabled = true;
    const surrenderBtn = qs("battleSurrenderBtn");
    if (surrenderBtn) surrenderBtn.disabled = true;
    if (state.battleResultAckBattleId === battleId || state.battleResultClosing) return;
    if (st.rank_up) {
      if (state.rankUpModalBattleId !== battleId) {
        state.rankUpModalBattleId = battleId;
        showRankUpModal(st);
      }
    } else if (state.battleOutcomeModalBattleId !== battleId) {
      state.battleOutcomeModalBattleId = battleId;
      showBattleResultModal(st.winner === "player", battleFinishReasonText(st), battleId);
    }
    if (st.pvp_mode === "deathmatch" && battleId && state.battleAutoCloseResultId !== battleId) {
      state.battleAutoCloseResultId = battleId;
      window.setTimeout(() => {
        if (String(state.currentBattleId || "") !== battleId) return;
        if (!state.battleLastState?.game_over) return;
        void hideBattleResultModal();
      }, 2200);
    }
  } else {
    const activeBattleId = String(st.battle_id || "");
    if (state.battleOutcomeModalBattleId && state.battleOutcomeModalBattleId !== activeBattleId) {
      state.battleOutcomeModalBattleId = null;
    }
    if (state.rankUpModalBattleId && state.rankUpModalBattleId !== activeBattleId) {
      state.rankUpModalBattleId = null;
    }
    const surrenderBtn = qs("battleSurrenderBtn");
    if (surrenderBtn) surrenderBtn.disabled = false;
  }
}

async function battleFetchState() {
  const st = await api("/api/battle/state");
  if (st.active && state.activeTab !== "battles") {
    await showTab("battles", { force: true });
  }
  renderBattleState(st);
  if (st.active && !st.game_over) startBattlePolling();
  return st;
}

async function battleStartBot() {
  const st = await api("/api/battle/bot/start", { method: "POST" });
  await showTab("battles", { force: true });
  renderBattleState(st);
}

async function battleSendAction(action, direction = null) {
  const payload = { action, ...(direction ? { direction } : {}) };
  if (action === "move") payload.paladin_dash = Boolean(state.paladinDashMode);
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
  qs("questsList")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-quest-claim]");
    if (!btn) return;
    const questId = String(btn.getAttribute("data-quest-claim") || "").trim();
    if (!questId) return;
    btn.disabled = true;
    try {
      state.quests = await api("/api/quests/daily/claim", {
        method: "POST",
        body: JSON.stringify({ quest_id: questId }),
      });
      state.profile = await api("/api/profile/me");
      renderHud();
      renderQuests();
      showToast("Награда за квест получена.", { title: "КВЕСТЫ", ms: 2200 });
    } catch (err) {
      setError(prettyError(err));
    } finally {
      btn.disabled = false;
    }
  });

  // Settings sub-tabs
  qs("settingsTabs")?.addEventListener("click", (e) => {
    const b = e.target.closest(".subTab");
    if (!b) return;
    const key = String(b.dataset.settings || "privacy");
    if (!["privacy", "chat"].includes(key)) return;
    state.settingsTab = key;
    renderSettings();
  });

  async function saveSettingsPrivacy() {
    const payload = {
      block_battle_invites: Boolean(qs("setBlockInvites")?.checked),
      invites_allowlist: parseAllowlistInput(qs("setInvitesAllowlist")?.value || ""),
      show_avatar: Boolean(qs("setShowAvatar")?.checked),
    };
    try {
      state.settings = await api("/api/settings", { method: "POST", body: JSON.stringify(payload) });
      renderSettings();
      showToast("Настройки сохранены.", { title: "НАСТРОЙКИ", ms: 2200 });
    } catch (e) {
      showToast(prettyError(e), { title: "ОШИБКА", ms: 2600 });
    }
  }
  async function saveSettingsChat() {
    const payload = {
      chat_visibility: String(qs("setChatVisibility")?.value || "on"),
    };
    try {
      state.settings = await api("/api/settings", { method: "POST", body: JSON.stringify(payload) });
      renderSettings();
      showToast("Настройки сохранены.", { title: "НАСТРОЙКИ", ms: 2200 });
    } catch (e) {
      showToast(prettyError(e), { title: "ОШИБКА", ms: 2600 });
    }
  }
  qs("settingsSaveBtn")?.addEventListener("click", saveSettingsPrivacy);
  qs("settingsSaveBtn2")?.addEventListener("click", saveSettingsChat);

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
  qs("lobbyPvpMode")?.addEventListener("change", () => {
    const mode = String(qs("lobbyPvpMode")?.value || "classic").toLowerCase();
    const dm = qs("lobbyDeathmatchOptions");
    if (dm) dm.style.display = mode === "deathmatch" ? "grid" : "none";
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
      await refreshLobbies(true);
      await battleFetchState();
      clearError();
    } catch (e) {
      setError(prettyError(e));
      await refreshLobbies(true);
    } finally {
      btn.disabled = false;
    }
  });

  // Global chat
  qs("globalChatForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = qs("globalChatInput");
    const btn = qs("globalChatSend");
    const text = String(input?.value || "").trim();
    if (!text) return;
    if (btn) btn.disabled = true;
    try {
      await sendGlobalChat(text);
      if (input) input.value = "";
    } catch (err) {
      setError(prettyError(err));
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  // Report buttons in chats (delegated)
  const onReportClick = (e) => {
    const btn = e.target.closest(".chatFlagBtn");
    if (!btn) return;
    const scope = String(btn.getAttribute("data-report-scope") || "");
    const msgId = Number(btn.getAttribute("data-report-id") || 0);
    const battleId = String(btn.getAttribute("data-report-battle") || "");
    if (!msgId || !["global", "battle"].includes(scope)) return;
    showConfirmModal({
      title: "ЖАЛОБА",
      label: "Отправить жалобу на это сообщение?",
      icon: "⚑",
      name: `Сообщение #${msgId}`,
      meta: scope === "battle" ? "Чат боя" : "Общий чат",
      onOk: async () => {
        hideConfirmModal();
        try {
          await api("/api/chat/report", {
            method: "POST",
            body: JSON.stringify({ scope, message_id: msgId, battle_id: battleId || null }),
          });
          showToast("Жалоба отправлена администраторам.", { title: "ЖАЛОБА", ms: 2200 });
        } catch (err) {
          setError(prettyError(err));
        }
      },
    });
  };
  qs("globalChatList")?.addEventListener("click", onReportClick);
  qs("battleChatList")?.addEventListener("click", onReportClick);

  qs("confirmCancelBtn")?.addEventListener("click", hideConfirmModal);
  qs("confirmModal")?.addEventListener("click", (e) => { if (e.target === qs("confirmModal")) hideConfirmModal(); });
  qs("confirmOkBtn")?.addEventListener("click", async () => {
    const fn = state.confirmOnOk;
    if (!fn) return hideConfirmModal();
    try { await fn(); } catch {}
  });

  // Battle chat
  qs("battleChatForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = qs("battleChatInput");
    const btn = qs("battleChatSend");
    const text = String(input?.value || "").trim();
    if (!text) return;
    if (btn) btn.disabled = true;
    try {
      await sendBattleChat(text);
      if (input) input.value = "";
    } catch (err) {
      setError(prettyError(err));
    } finally {
      if (btn) btn.disabled = false;
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
      qs("garageHint").textContent = trText("Сначала разблокируй этот предмет.", "Unlock this item first.");
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
      qs("garageHint").textContent = `${trText("Ошибка", "Error")}: ${prettyError(e)}`;
      setError(prettyError(e));
    }
  });
  qs("openContainerBtn")?.addEventListener("click", async () => {
    const btn = qs("openContainerBtn");
    btn.disabled = true;
    try {
      const result = await api("/api/containers/open", { method: "POST" });
      await showRewardModal(result);
      const [profile, containersInfo] = await Promise.all([
        api("/api/profile/me"),
        api("/api/containers"),
      ]);
      state.profile = profile;
      state.containersInfo = containersInfo;
      renderHud();
      renderContainers();
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
        setError(trText("Введите промокод.", "Enter promo code."));
        return;
      }
      promoBtn.disabled = true;
      try {
        const res = await api("/api/promo/redeem", {
          method: "POST",
          body: JSON.stringify({ code }),
        });
        qs("promoResult").textContent = String(res.message || trText("Промокод успешно активирован.", "Promo code activated successfully."));

        // Show a purchase-like modal for promo rewards
        const rewardType = String(res.reward_type || "").toLowerCase();
        const rewardKey = String(res.reward_key || "");
        const rewardAmount = Number(res.reward_amount || 0);
        let rewardName = trText("Награда", "Reward");
        let rewardValue = "";
        if (rewardType === "crystals") {
          rewardName = trText("Кристаллы", "Crystals");
          rewardValue = `x${rewardAmount}`;
        } else if (rewardType === "containers") {
          rewardName = trText("Контейнеры", "Containers");
          rewardValue = `x${rewardAmount}`;
        } else if (rewardType === "unlock") {
          rewardName = trText("Разблокировка", "Unlock");
          rewardValue = itemName(rewardKey) || rewardKey || trText("Предмет", "Item");
        } else if (rewardType === "premium") {
          rewardName = "Premium";
          rewardValue = state.locale === "en" ? `${rewardAmount} d.` : `${rewardAmount} дн.`;
        }
        showPurchaseLikeModal({
          title: trText("ПРОМОКОД АКТИВИРОВАН", "PROMO CODE ACTIVATED"),
          label: trText("Вы получили:", "You received:"),
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
    renderLobbies();
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
    renderLobbies();
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
    renderLobbies();
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
    renderLobbies();
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
      if (hint) hint.textContent = trText("Введите @username игрока.", "Enter player's @username.");
      return;
    }
    btn.disabled = true;
    try {
      await api("/api/battle/player/invite", {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      await updateOutgoingInviteState();
      if (hint) hint.textContent = trText("Приглашение отправлено. Ждем ответ игрока (до 2 минут).", "Invitation sent. Waiting for response (up to 2 minutes).");
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
      if (hint) hint.textContent = trText("Приглашение отменено.", "Invitation canceled.");
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
  qs("battlePaladinStepBtn")?.addEventListener("click", () => {
    state.paladinDashMode = !state.paladinDashMode;
    const btn = qs("battlePaladinStepBtn");
    if (btn) btn.textContent = state.paladinDashMode ? trText("Ход: рывок x2", "Move: dash x2") : trText("Ход: 1 клетка", "Move: 1 cell");
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
      setError(trText("Вы отклонили приглашение в бой.", "You declined the battle invite."));
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
  state.locale = "ru";
  applyStaticI18n();
  state.questsSeenDayKey = loadSeenQuestDayKey();
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
    try { state.settings = await api("/api/settings"); renderSettings(); } catch {}
    await refreshLobbies();
    // Prime global chat
    state.globalChatAfterId = 0;
    qs("globalChatList") && (qs("globalChatList").innerHTML = "");
    if (String(state.settings?.chat_visibility || "on") === "on") await pollGlobalChat();
    await updateOutgoingInviteState();
    await pollIncomingInvite();
    await pollPendingNotice();
    if (!state.invitePollTimer) {
      state.invitePollTimer = setInterval(() => {
        void api("/api/session/ping", { method: "POST" }).catch(() => {});
        void updateOutgoingInviteState();
        void pollIncomingInvite();
        void pollPendingNotice();
        if (String(state.settings?.chat_visibility || "on") === "on") void pollGlobalChat();
        if (state.webBattleActive) void pollBattleChat();
        void syncQuestBadge();
        if (state.quests) {
          const before = Number(state.quests.reset_in_seconds || 0);
          const after = Math.max(0, before - 2.5);
          state.quests.reset_in_seconds = after;
          if (state.activeTab === "quests") renderQuests();
          if (before > 0 && after <= 0) {
            void syncQuestBadge(true);
          }
          if (after <= 0) {
            const nowMs = Date.now();
            if (nowMs - Number(state.lastQuestZeroForceAt || 0) >= 10000) {
              state.lastQuestZeroForceAt = nowMs;
              void syncQuestBadge(true);
            }
          }
        }
        if (state.activeTab === "battles" && !state.webBattleActive) {
          void refreshLobbies(true);
        }
        // Let inviter enter PvP without manual reload when invite gets accepted,
        // but don't constantly rerender battles UI off-tab.
        if (!state.webBattleActive && state.pendingHostLobbyId) {
          void battleTryEnterFromLobbyHost();
        }
      }, 2500);
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
