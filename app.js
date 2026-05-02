/* global Telegram */

const API_BASE_URL = String(window.API_BASE_URL || "").trim().replace(/\/+$/, "");
const MUSIC_STORAGE_KEY = "bg_music_enabled";
const MUSIC_VOLUME_STORAGE_KEY = "bg_music_volume";
const QUESTS_SEEN_DAY_KEY_STORAGE = "quests_seen_day_key";
const DEFAULT_MUSIC_VOLUME = 0.35;
const DEFAULT_MUSIC_ENABLED = true;
const LOCALES = ["ru", "en"];
const TAB_MUSIC = {
  profile: "/sounds/music/background_music.mp3",
  referrals: "/sounds/music/background_music.mp3",
  leaders: "/sounds/music/background_music.mp3",
  battles: "/sounds/music/battle_music.mp3",
  garage: "/sounds/music/garage_music.mp3",
  shop: "/sounds/music/shop_music.mp3",
  containers: "/sounds/music/background_music.mp3",
  quests: "/sounds/music/background_music.mp3",
  settings: "/sounds/music/background_music.mp3",
};
const PURCHASE_SOUND_PATH = "/sounds/notify.mp3";
const BATTLE_AMBIENT_PATH = "/sounds/ambient/space_ambient.mp3";
const CONTAINER_CLOSED_IMAGE = "/images/webapp/container.png";
const PREMIUM_CONTAINER_CLOSED_IMAGE = "/images/webapp/prem_container.png";
const PREMIUM_BADGE_PATH = "/images/webapp/premium_ribbon.png";
const CONTAINER_OPEN_IMAGES = {
  rare: "/images/webapp/contopen_rare.png",
  epic: "/images/webapp/contopen_epic.png",
  ultrarare: "/images/webapp/contopen_ultrarare.png",
  legendary: "/images/webapp/contopen_legendary.png",
};
const REWARD_ITEM_IMAGES = {
  crystals: "/images/webapp/crystals.png",
  premium: "/images/webapp/premium.png",
  railgun: "/images/webapp/railgun.png",
  shaft: "/images/webapp/shaft.png",
  thunder: "/images/webapp/thunder.png",
  ricochet: "/images/webapp/ricochet.png",
  molot: "/images/webapp/molot.png",
  titan: "/images/webapp/titan.png",
  paladin: "/images/webapp/paladin.png",
  dictator: "/images/webapp/dictator.png",
  module1: "/images/webapp/module1.png",
  module2: "/images/webapp/module2.png",
  module3: "/images/webapp/module3.png",
  module4: "/images/webapp/module4.png",
  module5: "/images/webapp/module5.png",
  module6: "/images/webapp/module6.png",
  module7: "/images/webapp/module7.png",
  module8: "/images/webapp/module8.png",
  module9: "/images/webapp/module9.png",
  module10: "/images/webapp/module10.png",
  module11: "/images/webapp/module11.png",
  module12: "/images/webapp/module12.png",
  module13: "/images/webapp/module13.png",
  module14: "/images/webapp/module14.png",
  module15: "/images/webapp/module15.png",
  module16: "/images/webapp/module16.png",
};
const MODULE_LOOT = [
  {
    key: "module1",
    type: "module",
    name: "Легкая бронепластина",
    name_en: "Light armor plate",
    chance: "0.70%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.module1,
    description: "Первое попадание по вам в бою получает -5 урона.",
    description_en: "The first hit you take in a battle deals 5 less damage.",
  },
  {
    key: "module2",
    type: "module",
    name: "Стабилизатор прицела",
    name_en: "Aim stabilizer",
    chance: "0.70%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.module2,
    description: "Если вы не двигались перед выстрелом, шанс попадания +8%.",
    description_en: "If you did not move before shooting, hit chance is increased by 8%.",
  },
  {
    key: "module3",
    type: "module",
    name: "Боевой регистратор",
    name_en: "Battle recorder",
    chance: "0.80%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.module3,
    description: "Дает небольшой бонус к опыту за бой: +5%, максимум +10 опыта.",
    description_en: "Grants a small battle XP bonus: +5%, capped at +10 XP.",
  },
  {
    key: "module4",
    type: "module",
    name: "Маневровые приводы",
    name_en: "Maneuver drives",
    chance: "0.80%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.module4,
    description: "После движения следующий входящий выстрел получает -5% к точности.",
    description_en: "After you move, the next incoming shot gets -5% accuracy.",
  },
  {
    key: "module5",
    type: "module",
    name: "Противоосколочная обшивка",
    name_en: "Anti-fragment lining",
    chance: "0.50%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.module5,
    description: "Дальний входящий урон на расстоянии 4+ снижается на 10%.",
    description_en: "Incoming long-range damage at distance 4+ is reduced by 10%.",
  },
  {
    key: "module6",
    type: "module",
    name: "Усиленный затвор",
    name_en: "Reinforced breech",
    chance: "0.50%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.module6,
    description: "После промаха ваш следующий выстрел получает +10% точности.",
    description_en: "After a miss, your next shot gets +10% accuracy.",
  },
  {
    key: "module7",
    type: "module",
    name: "Калиброванный боек",
    name_en: "Calibrated striker",
    chance: "0.50%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.module7,
    description: "Дает +6% к шансу критического попадания. Крит наносит +25% урона.",
    description_en: "Grants +6% critical hit chance. Critical hits deal +25% damage.",
  },
  {
    key: "module8",
    type: "module",
    name: "Адаптивная броня",
    name_en: "Adaptive armor",
    chance: "0.50%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.module8,
    description: "Когда HP впервые падает ниже 40%, следующий входящий удар режется на 25%.",
    description_en: "When HP first drops below 40%, the next incoming hit is reduced by 25%.",
  },
  {
    key: "module9",
    type: "module",
    name: "Дымовой генератор",
    name_en: "Smoke generator",
    chance: "0.70%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.module9,
    description: "Активируйте, чтобы следующий выстрел противника получил -15% точности.",
    description_en: "Activate to make the opponent's next shot lose 15% accuracy.",
  },
  {
    key: "module10",
    type: "module",
    name: "Аварийная защита",
    name_en: "Emergency guard",
    chance: "0.70%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.module10,
    description: "Активируется при HP 50% или ниже: восстанавливает 15 HP.",
    description_en: "Can be activated at 50% HP or lower: restores 15 HP.",
  },
  {
    key: "module11",
    type: "module",
    name: "Форсаж",
    name_en: "Afterburner",
    chance: "0.80%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.module11,
    description: "Следующее движение проходит на 2 клетки, но следующий выстрел получает -15% точности.",
    description_en: "Your next move travels 2 cells, but your next shot gets -15% accuracy.",
  },
  {
    key: "module12",
    type: "module",
    name: "Импульсный заряд",
    name_en: "Impulse charge",
    chance: "0.50%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.module12,
    description: "Следующий выстрел наносит +10 урона. Промах тратит заряд.",
    description_en: "Your next shot deals +10 damage. Missing still consumes the charge.",
  },
  {
    key: "module13",
    type: "module",
    name: "Тактический сканер",
    name_en: "Tactical scanner",
    chance: "0.50%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.module13,
    description: "Следующий выстрел получает +12% точности.",
    description_en: "Your next shot gets +12% accuracy.",
  },
  {
    key: "module14",
    type: "module",
    name: "Ремкомплект",
    name_en: "Repair kit",
    chance: "0.50%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.module14,
    description: "Восстанавливает до 25 HP, но не выше максимального HP.",
    description_en: "Restores up to 25 HP, not above max HP.",
  },
  {
    key: "module15",
    type: "module",
    name: "Критический боекомплект",
    name_en: "Critical ammo rack",
    chance: "0.65%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.module15,
    description: "Следующий выстрел получает +20% шанса крита. Крит наносит +25% урона.",
    description_en: "Your next shot gets +20% critical chance. Critical hits deal +25% damage.",
  },
  {
    key: "module16",
    type: "module",
    name: "Перегрузка орудия",
    name_en: "Weapon overload",
    chance: "0.65%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.module16,
    description: "Следующий выстрел получает +15 урона и +10% точности, после выстрела перезарядка дольше на 1 ход.",
    description_en: "Your next shot gets +15 damage and +10% accuracy, then reload is 1 turn longer.",
  },
];
const PREMIUM_MODULE_LOOT = MODULE_LOOT.map((item) => ({
  ...item,
  rarity: "legendary",
  chance: "1.88%",
  description: "Легендарный модуль.",
  description_en: "Legendary module.",
}));
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
    name_en: "Railgun",
    chance: "0.15%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.railgun,
    description: "Легендарная пушка с самым редким шансом выпадения.",
    description_en: "Legendary weapon with the rarest drop chance.",
  },
  {
    key: "shaft",
    type: "weapon",
    name: "Шафт",
    name_en: "Shaft",
    chance: "0.4%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.shaft,
    description: "Ультраредкая снайперская пушка для точных попаданий.",
    description_en: "Ultra-rare sniper weapon for precision shots.",
  },
  {
    key: "thunder",
    type: "weapon",
    name: "Гром",
    name_en: "Thunder",
    chance: "1.1%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.thunder,
    description: "Эпическая пушка с мощным уроном по площади.",
    description_en: "Epic weapon with powerful splash damage.",
  },
  {
    key: "ricochet",
    type: "weapon",
    name: "Рикошет",
    name_en: "Ricochet",
    chance: "0.2%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.ricochet,
    description: "Легендарная пушка с рикошетом от укрытий и стабильным уроном.",
    description_en: "Legendary weapon that ricochets off cover with stable damage.",
  },
  {
    key: "molot",
    type: "weapon",
    name: "Молот",
    name_en: "Molot",
    chance: "0.35%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.molot,
    description: "Ультраредкая пушка: вблизи огромный урон, вдали стабильные 10 урона.",
    description_en: "Ultra-rare weapon: huge close-range damage, at range deals stable 10 damage.",
  },
  {
    key: "titan",
    type: "hull",
    name: "Титан",
    name_en: "Titan",
    chance: "0.9%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.titan,
    description: "Эпический тяжелый корпус с 175 HP и высоким запасом прочности.",
    description_en: "Epic heavy hull with 175 HP and high durability.",
  },
  {
    key: "dictator",
    type: "hull",
    name: "Диктатор",
    name_en: "Dictator",
    chance: "0.6%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.dictator,
    description: "Эпический корпус с 150 HP без дополнительных способностей.",
    description_en: "Epic hull with 150 HP and no extra abilities.",
  },
  {
    key: "paladin",
    type: "hull",
    name: "Паладин",
    name_en: "Paladin",
    chance: "0.22%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.paladin,
    description: "Легендарный штурмовой корпус с щитом и увеличенной мобильностью.",
    description_en: "Legendary assault hull with a shield and increased mobility.",
  },
  ...MODULE_LOOT,
  {
    key: "crystals_1000",
    type: "crystals",
    name: "Кристаллы x1000",
    name_en: "Crystals x1000",
    chance: "2.25%",
    rarity: "epic",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Эпическая награда с крупной пачкой кристаллов.",
    description_en: "Epic reward with a big pack of crystals.",
  },
  {
    key: "crystals_10000",
    type: "crystals",
    name: "Кристаллы x10000",
    name_en: "Crystals x10000",
    chance: "0.3%",
    rarity: "ultrarare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Ультраредкая награда с огромным количеством кристаллов.",
    description_en: "Ultra-rare reward with a huge amount of crystals.",
  },
  {
    key: "crystals_20000",
    type: "crystals",
    name: "Кристаллы x20000",
    name_en: "Crystals x20000",
    chance: "0.03%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Легендарная кристальная награда с максимальной ценностью.",
    description_en: "Legendary crystal reward with maximum value.",
  },
  {
    key: "crystals_50",
    type: "crystals",
    name: "Кристаллы x50",
    name_en: "Crystals x50",
    chance: "15.58%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с небольшим количеством кристаллов.",
    description_en: "Rare reward with a small amount of crystals.",
  },
  {
    key: "crystals_100",
    type: "crystals",
    name: "Кристаллы x100",
    name_en: "Crystals x100",
    chance: "15.58%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда со средним количеством кристаллов.",
    description_en: "Rare reward with a medium amount of crystals.",
  },
  {
    key: "crystals_150",
    type: "crystals",
    name: "Кристаллы x150",
    name_en: "Crystals x150",
    chance: "15.58%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с хорошим количеством кристаллов.",
    description_en: "Rare reward with a decent amount of crystals.",
  },
  {
    key: "crystals_200",
    type: "crystals",
    name: "Кристаллы x200",
    name_en: "Crystals x200",
    chance: "15.58%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с крупной пачкой кристаллов.",
    description_en: "Rare reward with a large pack of crystals.",
  },
  {
    key: "crystals_250",
    type: "crystals",
    name: "Кристаллы x250",
    name_en: "Crystals x250",
    chance: "15.58%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с большим количеством кристаллов.",
    description_en: "Rare reward with a big amount of crystals.",
  },
  {
    key: "crystals_300",
    type: "crystals",
    name: "Кристаллы x300",
    name_en: "Crystals x300",
    chance: "15.58%",
    rarity: "rare",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Редкая награда с максимальным количеством кристаллов.",
    description_en: "Rare reward with the maximum amount of crystals.",
  },
];

const PREMIUM_CONTAINER_LOOT = [
  {
    key: "prem_crystals_5000",
    type: "crystals",
    name: "Кристаллы 5 000",
    name_en: "Crystals 5,000",
    chance: "2.5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Легендарный кристальный дроп.",
    description_en: "Legendary crystal drop.",
  },
  {
    key: "prem_crystals_10000",
    type: "crystals",
    name: "Кристаллы 10 000",
    name_en: "Crystals 10,000",
    chance: "2.5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Легендарный кристальный дроп.",
    description_en: "Legendary crystal drop.",
  },
  {
    key: "prem_crystals_15000",
    type: "crystals",
    name: "Кристаллы 15 000",
    name_en: "Crystals 15,000",
    chance: "2.5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Легендарный кристальный дроп.",
    description_en: "Legendary crystal drop.",
  },
  {
    key: "prem_crystals_20000",
    type: "crystals",
    name: "Кристаллы 20 000",
    name_en: "Crystals 20,000",
    chance: "2.5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.crystals,
    description: "Легендарный кристальный дроп.",
    description_en: "Legendary crystal drop.",
  },
  {
    key: "premium_1d",
    type: "premium",
    name: "Премиум 1 день",
    name_en: "Premium 1 day",
    chance: "20%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.premium,
    description: "Премиум подписка.",
    description_en: "Premium subscription.",
  },
  {
    key: "premium_3d",
    type: "premium",
    name: "Премиум 3 дня",
    name_en: "Premium 3 days",
    chance: "5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.premium,
    description: "Премиум подписка.",
    description_en: "Premium subscription.",
  },
  {
    key: "railgun",
    type: "weapon",
    name: "Рельса",
    name_en: "Railgun",
    chance: "1.5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.railgun,
    description: "Легендарная пушка.",
    description_en: "Legendary weapon.",
  },
  {
    key: "ricochet",
    type: "weapon",
    name: "Рикошет",
    name_en: "Ricochet",
    chance: "1.5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.ricochet,
    description: "Легендарная пушка.",
    description_en: "Legendary weapon.",
  },
  {
    key: "molot",
    type: "weapon",
    name: "Молот",
    name_en: "Molot",
    chance: "1.5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.molot,
    description: "Легендарная пушка.",
    description_en: "Legendary weapon.",
  },
  {
    key: "paladin",
    type: "hull",
    name: "Паладин",
    name_en: "Paladin",
    chance: "1.5%",
    rarity: "legendary",
    image: REWARD_ITEM_IMAGES.paladin,
    description: "Легендарный корпус.",
    description_en: "Legendary hull.",
  },
  ...PREMIUM_MODULE_LOOT,
];

function syncLootChancesFromApi(info) {
  if (!info || typeof info !== "object") return;
  const std = info.chances && typeof info.chances === "object" ? info.chances : null;
  const prem = info.premium_chances && typeof info.premium_chances === "object" ? info.premium_chances : null;

  if (std) {
    const stdMap = {
      railgun: "railgun",
      shaft: "shaft",
      thunder: "thunder",
      ricochet: "ricochet",
      molot: "molot",
      titan: "titan",
      dictator: "dictator",
      paladin: "paladin",
      crystals_1000: "crystals_1000",
      crystals_10000: "crystals_10000",
      crystals_20000: "crystals_20000",
      module1: "module1",
      module2: "module2",
      module3: "module3",
      module4: "module4",
      module5: "module5",
      module6: "module6",
      module7: "module7",
      module8: "module8",
      module9: "module9",
      module10: "module10",
      module11: "module11",
      module12: "module12",
      module13: "module13",
      module14: "module14",
      module15: "module15",
      module16: "module16",
    };
    CONTAINER_LOOT.forEach((item) => {
      const apiKey = stdMap[item.key];
      if (!apiKey) return;
      const val = Number(std[apiKey]);
      if (Number.isFinite(val) && val >= 0) {
        item.chance = `${val}%`;
      }
    });
    const small = Number(std.crystals_small);
    if (Number.isFinite(small) && small >= 0) {
      const eachSmall = (small / 6).toFixed(2);
      CONTAINER_LOOT.forEach((item) => {
        if (["crystals_50", "crystals_100", "crystals_150", "crystals_200", "crystals_250", "crystals_300"].includes(item.key)) {
          item.chance = `${eachSmall}%`;
        }
      });
    }
  }

  if (prem) {
    const premMap = {
      prem_crystals_5000: "crystals_5k",
      prem_crystals_10000: "crystals_10k",
      prem_crystals_15000: "crystals_15k",
      prem_crystals_20000: "crystals_20k",
      prem_crystals_25000: "crystals_25k",
      prem_crystals_30000: "crystals_30k",
      premium_1d: "premium_1d",
      premium_3d: "premium_3d",
      railgun: "railgun",
      ricochet: "ricochet",
      molot: "molot",
      paladin: "paladin",
      module1: "module1",
      module2: "module2",
      module3: "module3",
      module4: "module4",
      module5: "module5",
      module6: "module6",
      module7: "module7",
      module8: "module8",
      module9: "module9",
      module10: "module10",
      module11: "module11",
      module12: "module12",
      module13: "module13",
      module14: "module14",
      module15: "module15",
      module16: "module16",
    };
    PREMIUM_CONTAINER_LOOT.forEach((item) => {
      const apiKey = premMap[item.key];
      if (!apiKey) return;
      const val = Number(prem[apiKey]);
      if (Number.isFinite(val) && val >= 0) {
        item.chance = `${val}%`;
      }
    });
  }
}

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
  microUpgrades: null,
  modules: null,
  moduleImagePreloads: new Set(),
  modulePreloadQueue: [],
  modulePreloadTimer: null,
  modulePreloadIdleHandle: null,
  modulePreloadActive: false,
  containerKind: "standard", // standard | premium
  quests: null,
  activeTab: "profile",
  garageCategory: "weapon",
  shopCategory: "weapon",
  selectedWeapon: "smoky",
  selectedHull: "hunter",
  selectedModule: "module1",
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
  leaderboardLimit: 10,
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
  launchMode: "unknown",
  quickMatchController: null,
  quickMatchTimer: null,
  quickMatchStartedAt: 0,
  quickMatchSearching: false,
  quickMatchHideTimer: null,
  battleSearchActionsLocked: false,
};

const I18N = {
  ru: {
    tab_profile: "Профиль",
    tab_referrals: "Рефералы",
    tab_leaders: "Лидеры",
    tab_battles: "Бои",
    tab_garage: "Гараж",
    tab_shop: "Магазин",
    tab_containers: "Контейнеры",
    containers_premium: "Премиум",
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
    err_open_in_telegram: "Открой игру или мини-апп из Telegram.",
    err_initdata_missing: "Не получены данные запуска. Открой WebApp кнопкой из бота или игру через Play в Telegram.",
    battle_cooldown: "Кулдаун",
    battles_title_modes: "БЫСТРЫЙ БОЙ",
    battles_title_pvp: "БОЙ С ИГРОКОМ",
    battles_title_bot: "БОЙ С БОТОМ",
    battles_quick: "БЫСТРЫЙ БОЙ",
    battles_modes_title: "РЕЖИМЫ ИГРЫ",
    battles_or_create: "ИЛИ ЖЕ СОЗДАТЬ СВОЙ БОЙ",
    battles_training_bot: "ТРЕНИРОВКА С БОТОМ",
    battles_with_friend: "ИГРА С ДРУГОМ",
    battles_custom_create: "СОЗДАТЬ КАСТОМНЫЙ БОЙ",
    battles_custom_list: "КАСТОМНЫЕ БОИ",
    quick_match_title: "БЫСТРЫЙ БОЙ",
    quick_match_avg: "Среднее время ожидания",
    quick_match_current: "Текущее время ожидания",
    quick_match_status: "Поиск соперника",
    quick_match_cancel: "ОТМЕНА",
    battle_victory: "ПОБЕДА",
    battle_defeat: "ПОРАЖЕНИЕ",
    notice_title: "УВЕДОМЛЕНИЕ",
    warning: "ВНИМАНИЕ!",
    purchase_success_title: "ПОКУПКА ПРОИЗВЕДЕНА УСПЕШНО",
    purchase_success_label: "Вы приобрели:",
    item: "Предмет",
    damage_unit: "урона",
    lobby_empty: "Пока нет открытых боёв. Создай свой!",
    battle_no_events: "Событий пока нет.",
    battle_you: "YOU",
    battle_op: "OP",
    battle_your_tank: "ВАШ ТАНК",
    battle_opponent: "ПРОТИВНИК",
    battle_aim: "Прицел",
    paladin_step_1: "Ход: 1 клетка",
    confirm_label: "Вы уверены?",
    invite_time_default: "120 сек",
    loot_pick_item: "Выберите предмет из списка, чтобы посмотреть описание и шанс выпадения.",
    profile_rank: "Звание",
    profile_music_off: "Музыка выкл",
    profile_music_on: "Музыка вкл",
    profile_my_tank: "Мой танк",
    stat_battles: "Бои",
    stat_wins: "Победы",
    stat_losses: "Поражения",
    stat_exp: "Опыт",
    stat_premium: "Премиум",
    stat_premium_inactive: "Неактивен",
    stat_winrate: "Винрейт",
    ref_title: "РЕФЕРАЛЬНАЯ СИСТЕМА",
    ref_hint: "Приглашай друзей: +80💎 и +1📦 за каждого, этапные бонусы на 3/7/12/20.",
    ref_hero_title: "Приглашай друзей и забирай награды",
    ref_hero_sub: "Делись ссылкой, отслеживай прогресс и получай бонусы за этапы.",
    ref_stat_invited: "Приглашено",
    ref_stat_rewarded: "Награждено",
    ref_stat_slots: "Осталось слотов",
    ref_link_title: "Твоя реферальная ссылка",
    ref_reward_each_you_title: "За каждого реферала (вам)",
    ref_reward_each_you_desc: "+80 кристаллов и +1 контейнер",
    ref_reward_each_friend_title: "Новому игроку",
    ref_reward_each_friend_desc: "+1 контейнер за вход по вашей ссылке",
    ref_reward_milestone_title: "Этапные бонусы",
    ref_reward_milestone_desc: "Премиум и премиум контейнеры на ключевых этапах",
    ref_milestones_title: "Этапы наград",
    ref_milestone_done: "Получено",
    ref_milestone_next: "Следующая цель",
    ref_milestone_locked: "Не достигнуто",
    ref_copy: "Копировать ссылку",
    ref_copy_ok: "Ссылка скопирована",
    global_chat_title: "ОБЩИЙ ЧАТ",
    global_chat_subtitle: "Пиши сообщения всем игрокам",
    global_chat_placeholder: "Написать в общий чат...",
    send: "Отправить",
    garage_weapons: "Пушки",
    garage_hulls: "Корпуса",
    garage_modules: "Модули",
    garage_pick_item: "Выберите пушку или корпус",
    equip: "Установить",
    leaders_top_players: "ТОП ИГРОКИ",
    leaders_top_sub: "Опыт • Победы • Бои",
    leaders_table_title: "ТАБЛИЦА ЛИДЕРОВ",
    leaders_table_sub: "Лучшие игроки сервера",
    sort_exp: "Опыт",
    sort_wins: "Победы",
    leaders_head_player: "Игрок",
    leaders_head_exp: "Опыт",
    leaders_head_battles: "Бои",
    leaders_you_pos: "Твоя позиция",
    battles_create: "Создать бой",
    battles_modes_aria: "Режимы боев",
    battles_open: "Открытые бои",
    start_battle: "Начать бой",
    back: "Назад",
    send_invite: "Отправить приглашение",
    cancel_invite: "Отменить приглашение",
    battle_loading: "ЗАГРУЗКА БОЯ…",
    surrender: "Сдаться",
    aim_active: "🎯 Прицел активен",
    battle_map_aria: "Карта боя",
    move_up: "Вверх",
    move_left: "Влево",
    move_down: "Вниз",
    move_right: "Вправо",
    fire: "Огонь",
    hotkeys_hint: "ПК: WASD/стрелки - движение, F - огонь, G - прицел",
    battle_chat_title: "ЧАТ БОЯ",
    battle_chat_placeholder: "Сообщение...",
    ok: "ОК",
    shop_cat_weapon: "Пушки",
    shop_cat_weapon_meta: "Боевые орудия за кристаллы",
    shop_cat_hull: "Корпуса",
    shop_cat_hull_meta: "Платформы под разные стили игры",
    shop_cat_premium: "Премиум подписка",
    shop_cat_premium_meta: "Stars или альтернатива за кристаллы",
    shop_cat_premium_containers: "Премиум контейнеры",
    shop_cat_premium_containers_meta: "Легендарный дроп за Stars",
    shop_cat_promo: "Промокоды",
    shop_cat_promo_meta: "Активация бонусных кодов",
    shop_menu_label: "Витрина",
    shop_menu_note: "Выбери раздел и оффер.",
    shop_offers: "Предложения",
    promo_title: "Активировать промокод",
    promo_note: "Промокоды вводятся только в веб‑магазине.",
    containers_standard: "Обычный",
    open_container: "Открыть контейнер",
    view_rewards: "Посмотреть содержимое контейнера",
    refresh: "Обновить",
    settings_title: "НАСТРОЙКИ",
    settings_privacy_tab: "Приватность",
    settings_chat_tab: "Чат",
    settings_privacy_title: "Приватность",
    settings_language: "Язык",
    lang_ru: "Русский",
    lang_en: "English",
    settings_block_invites: "Приглашения: запретить другим приглашать меня в бой",
    settings_allowlist_label: "Исключения по username (через запятую):",
    settings_show_avatar: "Аватар: показывать мой аватар всем",
    save: "Сохранить",
    settings_chat_title: "Чат",
    settings_chat_visibility: "Видимость чата",
    chat_vis_on: "Вкл (все чаты)",
    chat_vis_battle_only: "Только в боях",
    chat_vis_off: "Выкл (никакие чаты)",
    settings_chat_note: "Если чат выключен, соперник не сможет писать вам в чат боя.",
    reward_opened: "Контейнер открыт",
    close: "Закрыть",
    error_default: "Произошла ошибка.",
    battle_result_default: "Сражение завершено. Нажмите вне окна, чтобы продолжить.",
    surrender_title: "СДАТЬСЯ?",
    surrender_label: "Ты точно хочешь завершить бой поражением?",
    cancel: "Отмена",
    confirm: "Подтвердить",
    pvp_invite_title: "ПРИГЛАШЕНИЕ В БОЙ",
    pvp_invite_label: "Вас пригласили в PvP бой.",
    decline: "Отказаться",
    play: "Играть",
    rankup_title: "НОВОЕ ЗВАНИЕ!",
    rankup_gift: "Подарок: <b>+5 контейнеров</b>",
    lobby_create_title: "СОЗДАТЬ БОЙ",
    lobby_create_label: "Настрой бой и жди соперника (3 минуты).",
    lobby_name_placeholder: "Название боя",
    allow_all_ranks: "Разрешить все звания",
    cover_map_label: "Выбор карты",
    cover_map_aria: "Тип карты",
    cover_random: "Случайная (с укрытиями или без)",
    cover_with: "С укрытиями",
    cover_without: "Без укрытий",
    pvp_mode_label: "Режим боя",
    pvp_mode_aria: "Режим боя",
    pvp_classic: "Классический (на выбывание)",
    pvp_deathmatch: "Deathmatch (по киллам и таймеру)",
    match_seconds_label: "⏱ Время матча (сек)",
    target_kills_label: "🎯 Лимит фрагов",
    no_stats: "Без изменения статистики и наград после боя",
    create: "Создать",
    join_lobby_title: "ВСТУПИТЬ В БОЙ?",
    join_lobby_label: "Вы хотите вступить в бой?",
    join: "Вступить",
    loot_sidebar: "Награды контейнера",
    loot_title: "ВОЗМОЖНЫЕ НАГРАДЫ",
    loot_all: "Все",
    loot_rare: "Редкие",
    loot_epic: "Эпические",
    loot_ultrarare: "Ультраредкие",
    loot_legendary: "Легендарные",
  },
  en: {
    tab_profile: "Profile",
    tab_referrals: "Referrals",
    tab_leaders: "Leaders",
    tab_battles: "Battles",
    tab_garage: "Garage",
    tab_shop: "Shop",
    tab_containers: "Containers",
    containers_premium: "Premium",
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
    err_open_in_telegram: "Open this game or mini app from Telegram.",
    err_initdata_missing: "Launch data is missing. Open the WebApp from the bot button or the game via Play in Telegram.",
    battle_cooldown: "Cooldown",
    battles_title_modes: "QUICK BATTLE",
    battles_title_pvp: "BATTLE VS PLAYER",
    battles_title_bot: "BATTLE VS BOT",
    battles_quick: "QUICK BATTLE",
    battles_modes_title: "GAME MODES",
    battles_or_create: "OR CREATE YOUR OWN BATTLE",
    battles_training_bot: "TRAINING VS BOT",
    battles_with_friend: "PLAY WITH A FRIEND",
    battles_custom_create: "CREATE CUSTOM BATTLE",
    battles_custom_list: "CUSTOM BATTLES",
    quick_match_title: "QUICK BATTLE",
    quick_match_avg: "Average waiting time",
    quick_match_current: "Current waiting time",
    quick_match_status: "Searching for opponent",
    quick_match_cancel: "CANCEL",
    battle_victory: "VICTORY",
    battle_defeat: "DEFEAT",
    notice_title: "NOTICE",
    warning: "WARNING!",
    purchase_success_title: "PURCHASE SUCCESSFUL",
    purchase_success_label: "You purchased:",
    item: "Item",
    damage_unit: "damage",
    lobby_empty: "No open battles yet. Create yours!",
    battle_no_events: "No events yet.",
    battle_you: "YOU",
    battle_op: "OP",
    battle_your_tank: "YOUR TANK",
    battle_opponent: "OPPONENT",
    battle_aim: "Aim",
    paladin_step_1: "Move: 1 tile",
    confirm_label: "Are you sure?",
    invite_time_default: "120s",
    loot_pick_item: "Select an item to see its description and drop chance.",
    profile_rank: "Rank",
    profile_music_off: "Music off",
    profile_music_on: "Music on",
    profile_my_tank: "My tank",
    stat_battles: "Battles",
    stat_wins: "Wins",
    stat_losses: "Losses",
    stat_exp: "Exp",
    stat_premium: "Premium",
    stat_premium_inactive: "Inactive",
    stat_winrate: "Winrate",
    ref_title: "REFERRAL SYSTEM",
    ref_hint: "Invite friends: +80💎 and +1📦 each, milestone bonuses at 3/7/12/20.",
    ref_hero_title: "Invite friends and claim rewards",
    ref_hero_sub: "Share your link, track progress, unlock milestone bonuses.",
    ref_stat_invited: "Invited",
    ref_stat_rewarded: "Rewarded",
    ref_stat_slots: "Slots left",
    ref_link_title: "Your referral link",
    ref_reward_each_you_title: "Per referral (you)",
    ref_reward_each_you_desc: "+80 crystals and +1 container",
    ref_reward_each_friend_title: "For new player",
    ref_reward_each_friend_desc: "+1 container for joining via your link",
    ref_reward_milestone_title: "Milestone rewards",
    ref_reward_milestone_desc: "Premium and premium containers on key milestones",
    ref_milestones_title: "Reward milestones",
    ref_milestone_done: "Claimed",
    ref_milestone_next: "Next goal",
    ref_milestone_locked: "Locked",
    ref_copy: "Copy link",
    ref_copy_ok: "Link copied",
    global_chat_title: "GLOBAL CHAT",
    global_chat_subtitle: "Chat with all players",
    global_chat_placeholder: "Write to global chat...",
    send: "Send",
    garage_weapons: "Weapons",
    garage_hulls: "Hulls",
    garage_modules: "Modules",
    garage_pick_item: "Select a weapon or a hull",
    equip: "Equip",
    leaders_top_players: "TOP PLAYERS",
    leaders_top_sub: "Experience • Wins • Battles",
    leaders_table_title: "LEADERBOARD",
    leaders_table_sub: "Best players on the server",
    sort_exp: "Experience",
    sort_wins: "Wins",
    leaders_head_player: "Player",
    leaders_head_exp: "Experience",
    leaders_head_battles: "Battles",
    leaders_you_pos: "Your position",
    battles_create: "Create battle",
    battles_modes_aria: "Battle modes",
    battles_open: "Open battles",
    start_battle: "Start battle",
    back: "Back",
    send_invite: "Send invite",
    cancel_invite: "Cancel invite",
    battle_loading: "LOADING BATTLE…",
    surrender: "Surrender",
    aim_active: "🎯 Aim active",
    battle_map_aria: "Battle map",
    move_up: "Up",
    move_left: "Left",
    move_down: "Down",
    move_right: "Right",
    fire: "Fire",
    hotkeys_hint: "PC: WASD/arrows - move, F - fire, G - aim",
    battle_chat_title: "BATTLE CHAT",
    battle_chat_placeholder: "Message...",
    ok: "OK",
    shop_cat_weapon: "Weapons",
    shop_cat_weapon_meta: "Crystal weapon offers",
    shop_cat_hull: "Hulls",
    shop_cat_hull_meta: "Hull platforms for different playstyles",
    shop_cat_premium: "Premium subscription",
    shop_cat_premium_meta: "Stars or crystal alternative",
    shop_cat_premium_containers: "Premium containers",
    shop_cat_premium_containers_meta: "Legendary-only drop for Stars",
    shop_cat_promo: "Promo codes",
    shop_cat_promo_meta: "Activate bonus codes",
    shop_menu_label: "Showcase",
    shop_menu_note: "Pick a section and offer.",
    shop_offers: "Offers",
    promo_title: "Activate promo code",
    promo_note: "Promo codes can only be entered in the web shop.",
    containers_standard: "Standard",
    open_container: "Open container",
    view_rewards: "View container rewards",
    refresh: "Refresh",
    settings_title: "SETTINGS",
    settings_privacy_tab: "Privacy",
    settings_chat_tab: "Chat",
    settings_privacy_title: "Privacy",
    settings_language: "Language",
    lang_ru: "Russian",
    lang_en: "English",
    settings_block_invites: "Invites: block others from inviting me to a battle",
    settings_allowlist_label: "Username exceptions (comma-separated):",
    settings_show_avatar: "Avatar: show my avatar to everyone",
    save: "Save",
    settings_chat_title: "Chat",
    settings_chat_visibility: "Chat visibility",
    chat_vis_on: "On (all chats)",
    chat_vis_battle_only: "Battle only",
    chat_vis_off: "Off (no chats)",
    settings_chat_note: "If chat is disabled, the opponent won't be able to message you in battle chat.",
    reward_opened: "Container opened",
    close: "Close",
    error_default: "An error occurred.",
    battle_result_default: "Battle finished. Tap outside the window to continue.",
    surrender_title: "SURRENDER?",
    surrender_label: "Are you sure you want to end the battle with a defeat?",
    cancel: "Cancel",
    confirm: "Confirm",
    pvp_invite_title: "BATTLE INVITE",
    pvp_invite_label: "You've been invited to a PvP battle.",
    decline: "Decline",
    play: "Play",
    rankup_title: "NEW RANK!",
    rankup_gift: "Gift: <b>+5 containers</b>",
    lobby_create_title: "CREATE BATTLE",
    lobby_create_label: "Set up the battle and wait for an opponent (3 minutes).",
    lobby_name_placeholder: "Battle name",
    allow_all_ranks: "Allow all ranks",
    cover_map_label: "Map selection",
    cover_map_aria: "Map type",
    cover_random: "Random (with/without cover)",
    cover_with: "With cover",
    cover_without: "No cover",
    pvp_mode_label: "Battle mode",
    pvp_mode_aria: "Battle mode",
    pvp_classic: "Classic (elimination)",
    pvp_deathmatch: "Deathmatch (kills + timer)",
    match_seconds_label: "⏱ Match time (sec)",
    target_kills_label: "🎯 Kill limit",
    no_stats: "No stats/rewards updates after battle",
    create: "Create",
    join_lobby_title: "JOIN BATTLE?",
    join_lobby_label: "Do you want to join the battle?",
    join: "Join",
    loot_sidebar: "Container rewards",
    loot_title: "POSSIBLE REWARDS",
    loot_all: "All",
    loot_rare: "Rare",
    loot_epic: "Epic",
    loot_ultrarare: "Ultra-rare",
    loot_legendary: "Legendary",
  },
};

function tr(key) {
  const loc = LOCALES.includes(state.locale) ? state.locale : "en";
  return (I18N[loc] && I18N[loc][key]) || I18N.en[key] || key;
}

function applyStaticI18n() {
  try { document.body && (document.body.dataset.locale = state.locale === "ru" ? "ru" : "en"); } catch {}
  // Text nodes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = String(el.getAttribute("data-i18n") || "");
    if (!key) return;
    el.textContent = tr(key);
  });
  // HTML nodes (use only for trusted static markup)
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = String(el.getAttribute("data-i18n-html") || "");
    if (!key) return;
    el.innerHTML = tr(key);
  });
  // Placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = String(el.getAttribute("data-i18n-placeholder") || "");
    if (!key) return;
    el.setAttribute("placeholder", tr(key));
  });
  // aria-label
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = String(el.getAttribute("data-i18n-aria") || "");
    if (!key) return;
    el.setAttribute("aria-label", tr(key));
  });
  // title attribute
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = String(el.getAttribute("data-i18n-title") || "");
    if (!key) return;
    el.setAttribute("title", tr(key));
  });
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
  try {
    const loc = state.locale === "ru" ? "ru" : "en";
    if (document.body) document.body.dataset.locale = loc;
    if (document.documentElement) document.documentElement.lang = loc;
  } catch {}
  // Tabs
  document.querySelectorAll(".mainTab").forEach((btn) => {
    const tab = String(btn.dataset.tab || "");
    const map = {
      profile: "tab_profile",
      referrals: "tab_referrals",
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

  // Generic static i18n by attributes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (el.classList.contains("mainTab")) return; // handled above to preserve quests badge node
    const key = String(el.getAttribute("data-i18n") || "").trim();
    if (!key) return;
    el.textContent = tr(key);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = String(el.getAttribute("data-i18n-html") || "").trim();
    if (!key) return;
    el.innerHTML = tr(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = String(el.getAttribute("data-i18n-placeholder") || "").trim();
    if (!key) return;
    el.setAttribute("placeholder", tr(key));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = String(el.getAttribute("data-i18n-aria") || "").trim();
    if (!key) return;
    el.setAttribute("aria-label", tr(key));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = String(el.getAttribute("data-i18n-title") || "").trim();
    if (!key) return;
    el.setAttribute("title", tr(key));
  });
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
const SHOP_CATEGORY_LABELS = {
  weapon: "Пушки",
  hull: "Корпуса",
  premium: "Премиум подписка",
  premium_containers: "Премиум контейнеры",
  promo: "Промокоды",
};
const SHOP_CATEGORY_LABELS_EN = {
  weapon: "Weapons",
  hull: "Hulls",
  premium: "Premium subscription",
  premium_containers: "Premium containers",
  promo: "Promo codes",
};
const SHOP_PREMIUM_META = {
  premium_1d: {
    title: "ПРЕМИУМ НА 1 ДЕНЬ",
    title_en: "PREMIUM FOR 1 DAY",
    subtitle: "Ускоряй прогресс, усиливай награды и продлевай подписку без ограничений.",
    subtitle_en: "Boost progress, improve rewards, and extend your subscription.",
    duration: "1 день",
    duration_en: "1 day",
    accent: "Быстрый старт",
    accent_en: "Quick start",
    icon: "👑",
  },
  premium_3d: {
    title: "ПРЕМИУМ НА 3 ДНЯ",
    title_en: "PREMIUM FOR 3 DAYS",
    subtitle: "Оптимальный вариант на несколько игровых сессий подряд.",
    subtitle_en: "Best choice for several play sessions.",
    duration: "3 дня",
    duration_en: "3 days",
    accent: "Популярный выбор",
    accent_en: "Popular choice",
    icon: "💎",
  },
  premium_10d: {
    title: "ПРЕМИУМ НА 10 ДНЕЙ",
    title_en: "PREMIUM FOR 10 DAYS",
    subtitle: "Максимальная выгода для активной игры и длинная суммируемая подписка.",
    subtitle_en: "Maximum value for active play and a long stackable subscription.",
    duration: "10 дней",
    duration_en: "10 days",
    accent: "Максимум выгоды",
    accent_en: "Best value",
    icon: "⚡",
  },
};

function premiumMetaText(meta, key) {
  if (!meta) return "";
  const enKey = `${key}_en`;
  const val = state.locale === "en" ? (meta[enKey] || meta[key] || "") : (meta[key] || "");
  return String(val || "");
}

function shopCategoryLabel(category) {
  if (state.locale === "en") return SHOP_CATEGORY_LABELS_EN[category] || category;
  return SHOP_CATEGORY_LABELS[category] || category;
}

function shopShowcaseConfig(category, itemCount = 0) {
  const configs = {
    weapon: {
      eyebrow: "ARSENAL",
      title: trText("Боевые пушки", "Combat weapons"),
      subtitle: trText(
        "Подбирай вооружение за кристаллы и усиливай сборку под свой стиль боя.",
        "Choose crystal-priced weapons and sharpen your build for your playstyle."
      ),
      stats: [
        [trText("Валюта", "Currency"), "💎"],
        [trText("Позиций", "Items"), String(itemCount)],
        [trText("Фокус", "Focus"), trText("Урон и дальность", "Damage and range")],
      ],
    },
    hull: {
      eyebrow: "HANGAR",
      title: trText("Корпуса и броня", "Hulls and armor"),
      subtitle: trText(
        "Собирай платформу под скорость, выживаемость и особые тактики.",
        "Build around speed, durability, and special tactical perks."
      ),
      stats: [
        [trText("Валюта", "Currency"), "💎"],
        [trText("Позиций", "Items"), String(itemCount)],
        [trText("Фокус", "Focus"), trText("HP и мобильность", "HP and mobility")],
      ],
    },
    premium: {
      eyebrow: "PRIME",
      title: trText("Премиум доступ", "Premium access"),
      subtitle: trText(
        "Продлевай подписку через Stars или активируй альтернативу за кристаллы.",
        "Extend premium with Stars or activate the crystal alternative."
      ),
      stats: [
        [trText("Оплата", "Payment"), trText("⭐ Stars + 💎", "⭐ Stars + 💎")],
        [trText("Офферов", "Offers"), String(itemCount)],
        [trText("Фокус", "Focus"), trText("Срок суммируется", "Stackable duration")],
      ],
    },
    premium_containers: {
      eyebrow: "LEGEND",
      title: trText("Премиум контейнеры", "Premium containers"),
      subtitle: trText(
        "Отдельная витрина с легендарным дропом и покупкой только за Stars.",
        "A dedicated showcase with legendary-only drops, available for Stars."
      ),
      stats: [
        [trText("Оплата", "Payment"), "⭐ Stars"],
        [trText("Дроп", "Loot"), trText("Только легендарный", "Legendary only")],
        [trText("Фокус", "Focus"), trText("Топ-награды", "Top-tier rewards")],
      ],
    },
    promo: {
      eyebrow: "ACCESS",
      title: trText("Промокоды и бонусы", "Promo codes and bonuses"),
      subtitle: trText(
        "Активируй коды, чтобы получать награды и открывать редкие предметы.",
        "Activate codes to claim rewards and unlock rare items."
      ),
      stats: [
        [trText("Режим", "Mode"), trText("Активация кода", "Code activation")],
        [trText("Награда", "Reward"), trText("Бонусы и unlocks", "Bonuses and unlocks")],
        [trText("Где", "Where"), trText("Веб-магазин", "Web shop")],
      ],
    },
  };
  return configs[category] || {
    eyebrow: "SHOP",
    title: trText("Предложения", "Offers"),
    subtitle: trText("Выбирай раздел магазина и усиливай сборку танка.", "Choose a shop section and upgrade your build."),
    stats: [
      [trText("Раздел", "Section"), shopCategoryLabel(category)],
      [trText("Позиций", "Items"), String(itemCount)],
    ],
  };
}

function renderShopShowcase(category, items) {
  const cfg = shopShowcaseConfig(category, Array.isArray(items) ? items.length : 0);
  const eyebrow = qs("shopShowcaseEyebrow");
  const title = qs("shopShowcaseTitle");
  const subtitle = qs("shopShowcaseSubtitle");
  const meta = qs("shopShowcaseMeta");
  if (eyebrow) eyebrow.textContent = cfg.eyebrow;
  if (title) title.textContent = cfg.title;
  if (subtitle) subtitle.textContent = cfg.subtitle;
  if (meta) {
    meta.innerHTML = (cfg.stats || [])
      .map(([label, value]) => `
        <div class="shopShowcaseStat">
          <span class="shopShowcaseStatLabel">${escapeHtml(String(label || ""))}</span>
          <span class="shopShowcaseStatValue">${escapeHtml(String(value || ""))}</span>
        </div>
      `)
      .join("");
  }
}
const DESCRIPTIONS = {
  smoky: "Базовая пушка со стабильным уроном.",
  railgun: "Дальнобойная пушка с высоким уроном.",
  shaft: "Снайперская пушка для точных попаданий.",
  thunder: "Мощный залп по площади.",
  ricochet: "Сбалансированная скорострельная пушка.",
  molot: "Вблизи почти гарантированно попадает и наносит огромный урон, вдали наносит 10 урона.",
  hunter: "Универсальный корпус для баланса скорости и брони.",
  titan: "Тяжелый корпус с 175 HP и повышенной прочностью.",
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
  titan: "Heavy hull with 175 HP and increased durability.",
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
  const mod = moduleByKey(key);
  if (mod?.name) return String(mod.name);
  return state.locale === "en" ? (NAMES_EN[key] || NAMES[key] || key) : (NAMES[key] || key);
}
function itemKeyFromAnyName(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  const low = v.toLowerCase();
  if (NAMES[low] || NAMES_EN[low]) return low;
  for (const [k, n] of Object.entries(NAMES)) {
    if (String(n || "").toLowerCase() === low) return k;
  }
  for (const [k, n] of Object.entries(NAMES_EN)) {
    if (String(n || "").toLowerCase() === low) return k;
  }
  return "";
}
function localizedItemName(rawOrKey) {
  const key = itemKeyFromAnyName(rawOrKey);
  return key ? itemName(key) : String(rawOrKey || "—");
}
function itemDescription(key) {
  const mod = moduleByKey(key);
  if (mod?.description) return String(mod.description);
  return state.locale === "en" ? (DESCRIPTIONS_EN[key] || DESCRIPTIONS[key] || "") : (DESCRIPTIONS[key] || "");
}
function itemLockedHint(key) {
  const mod = moduleByKey(key);
  if (mod) {
    if (!mod.available) {
      const rank = mod.rank_name ? trRankName(String(mod.rank_name)) : String(mod.rank_required || "");
      return state.locale === "en" ? `Required rank: ${rank}` : `Требуется звание: ${rank}`;
    }
    return state.locale === "en" ? `Price: ${Number(mod.price || 0)} crystals.` : `Цена: ${Number(mod.price || 0)} кристаллов.`;
  }
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
function getGameLaunchToken() {
  try {
    const url = new URL(window.location.href);
    const direct = String(url.searchParams.get("game_auth") || url.searchParams.get("gameAuth") || "").trim();
    if (direct) return direct;
  } catch {}
  try {
    const initParams = window.TelegramGameProxy?.initParams;
    if (initParams && typeof initParams === "object") {
      const raw = String(initParams.game_auth || initParams.gameAuth || "").trim();
      if (raw) return raw;
    }
  } catch {}
  try {
    const rawHash = String(window.location.hash || "").replace(/^#/, "");
    if (!rawHash) return "";
    const hashParams = new URLSearchParams(rawHash);
    return String(hashParams.get("game_auth") || hashParams.get("gameAuth") || "").trim();
  } catch {
    return "";
  }
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
const ASSET_CACHE_VERSION = "56";
function withCacheBust(url) { return `${url}${url.includes("?") ? "&" : "?"}v=${ASSET_CACHE_VERSION}`; }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
async function fadeInOpacity(el, durationMs = 600) {
  if (!el) return;
  try {
    el.getAnimations?.().forEach((animation) => animation.cancel());
  } catch {}
  el.style.transition = "";
  el.style.visibility = "visible";
  el.style.opacity = "0";
  if (typeof el.animate !== "function") {
    el.style.transition = `opacity ${Math.max(0, Number(durationMs || 0))}ms ease-out`;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    el.style.opacity = "1";
    await sleep(Math.max(0, Number(durationMs || 0)));
    el.style.transition = "";
    return;
  }
  const animation = el.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    {
      duration: Math.max(0, Number(durationMs || 0)),
      easing: "ease-out",
      fill: "forwards",
    }
  );
  try {
    await animation.finished;
  } catch {}
  el.style.opacity = "1";
}
async function fadeAudioVolume(audio, from, to, durationMs = 300, shouldContinue = () => true) {
  if (!audio) return;
  const start = Math.max(0, Math.min(1, Number(from || 0)));
  const end = Math.max(0, Math.min(1, Number(to || 0)));
  const totalMs = Math.max(120, Number(durationMs || 0));
  const ease = (t) => {
    const x = Math.max(0, Math.min(1, t));
    // Smoother than linear in Telegram WebView.
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };
  try { audio.volume = start; } catch {}
  const startedAt = performance.now();
  // Use fixed-interval setTimeout instead of requestAnimationFrame.
  // rAF is tied to the render thread and gets throttled when the page is
  // under heavy load (CSS animations, DOM rebuilds for modules, etc.),
  // causing large volume jumps that produce audible clicks / crackling.
  // setTimeout with a fixed step runs on the timer queue and is far more
  // consistent in Telegram WebView.
  const STEP_MS = 40;
  return new Promise((resolve) => {
    function step() {
      if (!shouldContinue()) { resolve(); return; }
      const elapsed = performance.now() - startedAt;
      const p = Math.min(1, elapsed / totalMs);
      try { audio.volume = Math.max(0, Math.min(1, start + (end - start) * ease(p))); } catch {}
      if (p >= 1) { resolve(); return; }
      setTimeout(step, STEP_MS);
    }
    step();
  });
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
function preloadModuleImages(payload = state.modules) {
  const list = Array.isArray(payload?.modules) ? payload.modules : [];
  const queue = [];
  for (const mod of list) {
    const raw = String(mod?.image_url || getItemImage(mod?.key || "") || "").trim();
    if (!raw) continue;
    const url = withCacheBust(absUrl(raw));
    if (state.moduleImagePreloads.has(url)) continue;
    state.moduleImagePreloads.add(url);
    queue.push(url);
  }
  if (!queue.length) return;
  state.modulePreloadQueue.push(...queue);
  scheduleModuleImagePreload();
}
function scheduleModuleImagePreload(delayMs = 700) {
  if (state.modulePreloadActive || state.modulePreloadTimer || state.modulePreloadIdleHandle) return;
  if (window.requestIdleCallback) {
    state.modulePreloadIdleHandle = window.requestIdleCallback(() => {
      state.modulePreloadIdleHandle = null;
      runNextModuleImagePreload();
    }, { timeout: delayMs });
  } else {
    state.modulePreloadTimer = window.setTimeout(runNextModuleImagePreload, delayMs);
  }
}
async function runNextModuleImagePreload() {
  state.modulePreloadTimer = null;
  if (state.modulePreloadIdleHandle) {
    window.cancelIdleCallback?.(state.modulePreloadIdleHandle);
    state.modulePreloadIdleHandle = null;
  }
  const url = state.modulePreloadQueue.shift();
  if (!url) return;
  state.modulePreloadActive = true;
  await preloadImage(url, 2600);
  state.modulePreloadActive = false;
  if (state.modulePreloadQueue.length) {
    scheduleModuleImagePreload(180);
  }
}
function setModulesPayload(payload) {
  state.modules = payload;
  preloadModuleImages(payload);
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

function translateDynamicRuToEn(text) {
  const src = String(text || "");
  if (state.locale !== "en" || !src) return src;
  const replacements = [
    ["Победа", "Victory"],
    ["ПОБЕДА", "VICTORY"],
    ["Поражение", "Defeat"],
    ["ПОРАЖЕНИЕ", "DEFEAT"],
    ["Ничья", "Draw"],
    ["НИЧЬЯ", "DRAW"],
    ["Игрок", "Player"],
    ["Противник", "Opponent"],
    ["Победитель", "Winner"],
    ["Контейнер", "Container"],
    ["контейнер", "container"],
    ["утешительный", "consolation"],
    ["опыта", "exp"],
    ["бонусного опыта", "bonus exp"],
    ["До:", "Until:"],
    ["Причина:", "Reason:"],
    ["не указана", "not specified"],
    ["сдался", "surrendered"],
    ["Время ожидания истекло", "Waiting time expired"],
    ["Бой отменен", "Battle canceled"],
    ["Сейчас ход игрока", "Current turn"],
    ["Получено кристаллов", "Crystals received"],
    ["Получено", "Received"],
    ["Кристаллы", "Crystals"],
    ["Обычный контейнер", "Standard container"],
    ["Пожаловаться", "Report"],
  ];
  let out = src;
  for (const [ru, en] of replacements) out = out.replaceAll(ru, en);
  return out;
}

function deepTranslatePayload(value) {
  if (state.locale !== "en") return value;
  if (typeof value === "string") return translateDynamicRuToEn(value);
  if (Array.isArray(value)) return value.map((v) => deepTranslatePayload(v));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepTranslatePayload(v);
    return out;
  }
  return value;
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
  const payload = await res.json();
  return deepTranslatePayload(payload);
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
  if (String(result.container_kind || "") === "premium") return "legendary";
  if (result.reward_type === "premium") return "legendary";
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

const REWARD_REVEAL_TIMINGS = {
  rare: { preDelay: 220, glowMs: 620, swapMs: 150, dropDelay: 260, dropFadeMs: 420, textDelay: 150, textFadeMs: 320, settleMs: 160 },
  epic: { preDelay: 320, glowMs: 720, swapMs: 160, dropDelay: 290, dropFadeMs: 450, textDelay: 160, textFadeMs: 340, settleMs: 170 },
  ultrarare: { preDelay: 420, glowMs: 820, swapMs: 170, dropDelay: 320, dropFadeMs: 480, textDelay: 170, textFadeMs: 360, settleMs: 180 },
  legendary: { preDelay: 520, glowMs: 940, swapMs: 180, dropDelay: 360, dropFadeMs: 520, textDelay: 180, textFadeMs: 380, settleMs: 200 },
};

function rewardTextFromResult(result) {
  if (result.reward_type === "unlock") {
    return state.locale === "en"
      ? `Received: ${itemName(result.reward_key) || result.reward_key}`
      : `Получено: ${NAMES[result.reward_key] || result.reward_key}`;
  }
  if (result.reward_type === "premium") {
    return state.locale === "en"
      ? `Premium received: ${result.reward_amount} day(s)`
      : `Получен премиум: ${result.reward_amount} дн.`;
  }
  if (result.reward_type === "module") {
    const name = itemName(result.reward_key) || result.reward_key;
    return state.locale === "en"
      ? `Module received: ${name}`
      : `Получен модуль: ${name}`;
  }
  return state.locale === "en"
    ? `Crystals received: ${result.reward_amount}`
    : `Получено кристаллов: ${result.reward_amount}`;
}

function getItemImage(key) {
  if (String(key || "").startsWith("module")) return `/images/webapp/${key}.png`;
  const imageName = ITEM_IMAGE_OVERRIDES[key] || `${key}.png`;
  return `/images/webapp/${imageName}`;
}

function placeRewardDropOnContainer(box, contImg, isPremiumContainer) {
  if (!box || !contImg) return;
  const boxRect = box.getBoundingClientRect();
  const imgRect = contImg.getBoundingClientRect();
  if (!boxRect.width || !boxRect.height || !imgRect.width || !imgRect.height) return;
  const naturalW = Number(contImg.naturalWidth || 0);
  const naturalH = Number(contImg.naturalHeight || 0);
  const imgAspect = naturalW > 0 && naturalH > 0 ? naturalW / naturalH : (imgRect.width / imgRect.height);
  const boxAspect = imgRect.width / imgRect.height;
  const renderedW = boxAspect > imgAspect ? imgRect.height * imgAspect : imgRect.width;
  const renderedH = boxAspect > imgAspect ? imgRect.height : imgRect.width / imgAspect;
  const renderedLeft = imgRect.left + (imgRect.width - renderedW) / 2;
  const renderedTop = imgRect.top + (imgRect.height - renderedH) / 2;
  const anchor = isPremiumContainer
    ? { x: 0.50, y: 0.28, size: 0.49 }
    : { x: 0.50, y: 0.33, size: 0.60 };
  const left = (renderedLeft - boxRect.left) + renderedW * anchor.x;
  const top = (renderedTop - boxRect.top) + renderedH * anchor.y;
  const size = Math.max(96, Math.min(132, renderedW * anchor.size));
  box.style.setProperty("--drop-left", `${left}px`);
  box.style.setProperty("--drop-top", `${top}px`);
  box.style.setProperty("--drop-size", `${size}px`);
}

function getTankComboImage(weapon, hull) {
  const w = String(weapon || "smoky").trim().toLowerCase();
  const h = String(hull || "hunter").trim().toLowerCase();
  return `/images/webapp/${w}_${h}.png`;
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
  label.textContent = state.bgMusicEnabled
    ? trText("Музыка вкл", "Music on")
    : trText("Музыка выкл", "Music off");
}

function saveMusic() {
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, state.bgMusicEnabled ? "1" : "0");
    localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, String(state.bgMusicVolume));
    if (state.profile?.user_id) {
      localStorage.setItem(`${MUSIC_STORAGE_KEY}:${state.profile.user_id}`, state.bgMusicEnabled ? "1" : "0");
      localStorage.setItem(`${MUSIC_VOLUME_STORAGE_KEY}:${state.profile.user_id}`, String(state.bgMusicVolume));
    }
  } catch {}
}

function loadMusicSettingsForUser(userId = null) {
  try {
    const scopedEnabled = userId ? localStorage.getItem(`${MUSIC_STORAGE_KEY}:${userId}`) : null;
    const scopedVolume = userId ? localStorage.getItem(`${MUSIC_VOLUME_STORAGE_KEY}:${userId}`) : null;
    const legacyEnabled = localStorage.getItem(MUSIC_STORAGE_KEY);
    const legacyVolume = localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY);
    const enabledRaw = scopedEnabled ?? legacyEnabled;
    const volumeRaw = scopedVolume ?? legacyVolume;
    state.bgMusicEnabled = enabledRaw == null ? DEFAULT_MUSIC_ENABLED : enabledRaw === "1";
    const savedVolume = Number(volumeRaw);
    if (!Number.isNaN(savedVolume)) state.bgMusicVolume = Math.max(0, Math.min(1, savedVolume));
  } catch {
    state.bgMusicEnabled = DEFAULT_MUSIC_ENABLED;
  }
}

async function syncMusicSettingsForProfile() {
  if (!state.profile?.user_id) return;
  const beforeEnabled = state.bgMusicEnabled;
  const beforeVolume = state.bgMusicVolume;
  loadMusicSettingsForUser(state.profile.user_id);
  const volume = qs("musicVolume");
  if (volume) volume.value = String(Math.round(state.bgMusicVolume * 100));
  updateMusicButton();
  saveMusic();
  if (state.bgMusic && (beforeEnabled !== state.bgMusicEnabled || beforeVolume !== state.bgMusicVolume)) {
    await switchTrack();
    await applyMusic();
  }
}

function getTrack() { return absUrl(withApiBase(TAB_MUSIC[state.activeTab] || TAB_MUSIC.profile)); }

function prepareLoopingMusic(audio, _shouldRestart) {
  if (!audio) return null;
  // Use native loop for gapless playback.  Manual ended-event restart
  // introduced micro-gaps at each loop boundary that were audible as
  // clicks / pops, especially in Telegram WebView on mobile devices.
  audio.loop = true;
  audio.preload = "auto";
  audio.load(); // Ensure audio is loaded to prevent crackling
  return audio;
}

async function fadeVolume(target, durationMs = 300) {
  if (!state.bgMusic) return;
  await fadeAudioVolume(state.bgMusic, state.bgMusic.volume, target, durationMs, () => true);
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
    state.battleAmbient.volume = 0;
    prepareLoopingMusic(state.battleAmbient, (audio) => state.battleAmbient === audio && state.battleAmbientActive);
  }
  const a = state.battleAmbient;
  if (state.bgMusic) {
    state.battleBgResumeTime = Number(state.bgMusic.currentTime) || 0;
    state.battleBgWasPlaying = !state.bgMusic.paused;
  }

  const crossMs = 2200;
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
  const crossMs = 2200;
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
    state.notifySound.load();
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
  prepareLoopingMusic(newAudio, (audio) => state.bgMusicEnabled && state.bgMusic === audio);
  newAudio.volume = 0;
  newAudio.muted = false;
  state.bgMusic = newAudio;
  state.prevMusic = oldAudio;
  try { await newAudio.play(); } catch {}
  if (seq !== state.musicSwitchSeq) {
    newAudio.pause();
    return;
  }
  // Плавный кроссфейд как при переходе в ambient боя.
  const crossMs = 1800;
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

  loadMusicSettingsForUser();

  const audio = prepareLoopingMusic(
    new Audio(getTrack()),
    (current) => state.bgMusicEnabled && state.bgMusic === current
  );
  audio.volume = state.bgMusicEnabled ? state.bgMusicVolume : 0;
  audio.addEventListener("error", () => {
    state.bgMusicEnabled = false;
    updateMusicButton();
    setError(trText("Не удалось загрузить музыку.", "Failed to load music."));
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
  if (tg) {
    try { tg.ready(); } catch {}
    try { tg.expand(); } catch {}
  }
  const unsafeUser = tg?.initDataUnsafe?.user;
  state.viewerName = unsafeUser?.username || unsafeUser?.first_name || "player";
  if (unsafeUser?.photo_url) {
    state.avatarUrl = unsafeUser.photo_url;
  }
  if (tg?.initData) {
    const auth = await api("/api/auth/telegram", {
      method: "POST",
      body: JSON.stringify({ initData: tg.initData, photo_url: state.avatarUrl || null }),
      headers: {},
    });
    state.token = auth.token;
    state.launchMode = "webapp";
    return;
  }
  const gameLaunchToken = getGameLaunchToken();
  if (gameLaunchToken) {
    const auth = await api("/api/auth/game", {
      method: "POST",
      body: JSON.stringify({ token: gameLaunchToken }),
      headers: {},
    });
    state.token = auth.token;
    state.launchMode = "game";
    return;
  }
  if (!tg) throw new Error(tr("err_open_in_telegram"));
  throw new Error(tr("err_initdata_missing"));
}

function moduleByKey(key) {
  const list = Array.isArray(state.modules?.modules) ? state.modules.modules : [];
  return list.find((m) => String(m.key || "") === String(key || "")) || null;
}
function isModuleOwned(key) { return Boolean(moduleByKey(key)?.owned); }
function isUnlocked(key) {
  if (String(key || "").startsWith("module")) return isModuleOwned(key);
  return key === "smoky" || key === "hunter" || Boolean(state.profile?.unlocks?.[key]);
}
function currentGarageKey() {
  if (state.garageCategory === "modules") return state.selectedModule;
  return state.garageCategory === "weapon" ? state.selectedWeapon : state.selectedHull;
}
function garageList() {
  if (state.garageCategory === "modules") {
    const list = Array.isArray(state.modules?.modules) ? state.modules.modules : [];
    return list.map((m) => String(m.key || "")).filter(Boolean);
  }
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
  if (titleEl) titleEl.textContent = String(title || trText("ГОТОВО", "DONE"));
  if (labelEl) labelEl.textContent = String(label || "");
  if (iconEl && icon) iconEl.textContent = String(icon);
  nameEl.textContent = String(name || "—");
  priceEl.textContent = String(price || "");
  modal.style.display = "flex";
}

function showConfirmModal({
  title = trText("ПОДТВЕРДИТЕ", "CONFIRM"),
  label = trText("Вы уверены?", "Are you sure?"),
  icon = "⚑",
  name = "—",
  meta = "",
  note = "",
  badge = "",
  preview = "",
  details = [],
  okText = trText("Подтвердить", "Confirm"),
  variant = "default",
  onOk = null,
}) {
  const modal = qs("confirmModal");
  if (!modal) return;
  const card = modal.querySelector(".confirmCard");
  const t = qs("confirmTitle");
  const l = qs("confirmLabel");
  const i = qs("confirmIcon");
  const n = qs("confirmName");
  const m = qs("confirmMeta");
  const previewWrap = qs("confirmPreview");
  const previewImg = qs("confirmPreviewImg");
  const badgeEl = qs("confirmBadge");
  const noteEl = qs("confirmNote");
  const detailsEl = qs("confirmDetails");
  const okBtn = qs("confirmOkBtn");
  const isPurchase = String(variant || "") === "purchase";
  if (t) t.textContent = String(title || trText("ПОДТВЕРДИТЕ", "CONFIRM"));
  if (l) l.textContent = String(label || trText("Вы уверены?", "Are you sure?"));
  if (i) i.textContent = String(icon || "⚑");
  if (n) n.textContent = String(name || "—");
  if (m) m.textContent = String(meta || "");
  if (card) card.classList.toggle("isPurchase", isPurchase);
  modal.classList.toggle("isPurchase", isPurchase);
  if (badgeEl) {
    badgeEl.textContent = String(badge || "");
    badgeEl.style.display = badge ? "inline-flex" : "none";
  }
  if (noteEl) {
    noteEl.textContent = String(note || "");
    noteEl.style.display = note ? "block" : "none";
  }
  if (previewWrap && previewImg) {
    const src = String(preview || "").trim();
    previewWrap.style.display = src ? "flex" : "none";
    if (src) {
      previewImg.src = src;
      previewImg.alt = String(name || "Preview");
    } else {
      previewImg.removeAttribute("src");
      previewImg.alt = "";
    }
  }
  if (detailsEl) {
    const rows = Array.isArray(details) ? details.filter(Boolean) : [];
    detailsEl.innerHTML = rows.map((row) => `<div class="confirmDetailChip">${escapeHtml(String(row))}</div>`).join("");
    detailsEl.style.display = rows.length ? "flex" : "none";
  }
  if (okBtn) okBtn.textContent = String(okText || trText("Подтвердить", "Confirm"));
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
    title: trText("ПОКУПКА ПРОИЗВЕДЕНА УСПЕШНО", "PURCHASE SUCCESSFUL"),
    label: trText("Вы приобрели:", "You purchased:"),
    icon: "🛒",
    name: item.name || NAMES[item.key] || item.key,
    price: String(item.price ?? 0),
  });
}

function showShopBuyConfirm(item, onOk) {
  if (!item) return;
  const isPremium = String(item.category || "") === "premium";
  const priceText = `${Number(item.price || 0)} 💎`;
  const previewSrc = item.image_url
    ? withCacheBust(absUrl(item.image_url))
    : withCacheBust(absUrl(getItemImage(item.key)));
  const badge = isPremium
    ? trText("Премиум", "Premium")
    : (item.category === "weapon"
      ? trText("Пушка", "Weapon")
      : (item.category === "hull" ? trText("Корпус", "Hull") : shopCategoryLabel(item.category)));
  const note = isPremium
    ? trText("Премиум суммируется с текущим сроком и активируется сразу после покупки.", "Premium time stacks with your current duration and activates instantly.")
    : trText("Покупка спишет кристаллы и сразу добавит предмет в ваш аккаунт.", "This purchase will spend crystals and unlock the item on your account immediately.");
  showConfirmModal({
    title: trText("ПОДТВЕРЖДЕНИЕ ПОКУПКИ", "PURCHASE CONFIRMATION"),
    label: trText("Проверьте товар перед списанием кристаллов.", "Review the item before crystals are spent."),
    icon: isPremium ? String((SHOP_PREMIUM_META[item.key] || {}).icon || "👑") : "💎",
    name: isPremium ? (premiumMetaText(SHOP_PREMIUM_META[item.key] || {}, "title") || String(item.name || "")) : displayItemName(item),
    meta: priceText,
    note,
    badge,
    preview: previewSrc,
    okText: trText("Купить", "Buy"),
    variant: "purchase",
    onOk,
  });
}

async function starsBuy(itemKey) {
  if (!Telegram?.WebApp?.openInvoice) {
    throw new Error(trText("Откройте WebApp внутри Telegram.", "Open this WebApp inside Telegram."));
  }
  const inv = await api("/api/stars/invoice", { method: "POST", body: JSON.stringify({ item: itemKey }) });
  const url = String(inv.invoice_url || "").trim();
  if (!url) throw new Error(trText("Не удалось создать инвойс.", "Failed to create invoice."));
  const status = await new Promise((resolve) => {
    try {
      Telegram.WebApp.openInvoice(url, (s) => resolve(String(s || "")));
    } catch {
      resolve("failed");
    }
  });
  if (status === "cancelled") return false;
  if (status !== "paid") {
    throw new Error(trText("Оплата не прошла.", "Payment failed."));
  }
  await refreshAll();
  return true;
}

function displayItemName(itemOrKey) {
  const key = typeof itemOrKey === "string" ? itemOrKey : String(itemOrKey?.key || "");
  const obj = typeof itemOrKey === "string" ? null : itemOrKey;
  if (obj && (obj.name || obj.name_en)) return state.locale === "en" ? (obj.name_en || obj.name || key) : (obj.name || obj.name_en || key);
  if (key === "premium_container") return trText("Премиум контейнер", "Premium container");
  if (key === "premium_1d") return trText("Премиум 1 день", "Premium 1 day");
  if (key === "premium_3d") return trText("Премиум 3 дня", "Premium 3 days");
  if (key === "premium_10d") return trText("Премиум 10 дней", "Premium 10 days");
  if (key.startsWith("prem_crystals_")) {
    const amount = key.replace("prem_crystals_", "");
    const num = Number(amount || 0);
    return state.locale === "en"
      ? `Crystals ${num.toLocaleString("en-US")}`
      : `Кристаллы ${num.toLocaleString("ru-RU")}`;
  }
  return itemName(key) || key;
}
function updateLootPreview(item) {
  const name = qs("lootPreviewName");
  const desc = qs("lootPreviewDesc");
  if (!name || !desc) return;
  if (!item) {
    name.textContent = state.containerKind === "premium"
      ? trText("Премиум контейнер", "Premium container")
      : trText("Обычный контейнер", "Standard container");
    desc.textContent = trText(
      "Выберите предмет из списка, чтобы посмотреть описание и шанс выпадения.",
      "Select an item to see its description and drop chance.",
    );
    return;
  }
  const dispName = displayItemName(item);
  const dispDesc = state.locale === "en"
    ? (item.description_en || itemDescription(item.key) || item.description || "")
    : (itemDescription(item.key) || item.description || "");
  name.textContent = dispName;
  desc.textContent = state.locale === "en"
    ? `${dispDesc} Drop chance: ${item.chance}. Rarity: ${rarityLabel(item.rarity)}.`
    : `${dispDesc} Шанс выпадения: ${item.chance}. Редкость: ${rarityLabel(item.rarity)}.`;
}
function renderContainerLoot() {
  const grid = qs("lootGrid");
  if (!grid) return;
  const base = state.containerKind === "premium" ? PREMIUM_CONTAINER_LOOT : CONTAINER_LOOT;
  const items = base
    .filter((item) => state.lootFilter === "all" || item.rarity === state.lootFilter)
    .sort((a, b) => {
      const rarityDiff = RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
      if (rarityDiff !== 0) return rarityDiff;
      return String(displayItemName(a))
        .localeCompare(String(displayItemName(b)), state.locale === "en" ? "en" : "ru");
    });
  grid.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `lootItemCard rarity-${item.rarity}${index === 0 ? " isSelected" : ""}`;
    card.innerHTML = `
      <div class="lootChance">${item.chance}</div>
      <img src="${withCacheBust(absUrl(item.image))}" alt="${displayItemName(item)}" class="lootItemImage" />
      <div class="lootItemFooter">${displayItemName(item)}</div>
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
  if (state.garageCategory === "modules") {
    const mod = moduleByKey(key);
    const microBtn = qs("microUpgradeBtn");
    if (microBtn) microBtn.style.display = "none";
    if (!mod) {
      equipBtn.disabled = true;
      equipBtn.classList.add("isDisabled");
      equipBtn.textContent = trText("Загрузка", "Loading");
      return;
    }
    if (mod.equipped) {
      equipBtn.disabled = true;
      equipBtn.classList.add("isDisabled");
      equipBtn.textContent = trText("Установлено", "Equipped");
      return;
    }
    if (mod.owned) {
      equipBtn.disabled = false;
      equipBtn.classList.remove("isDisabled");
      equipBtn.textContent = trText("Установить", "Equip");
      return;
    }
    if (!mod.available) {
      equipBtn.disabled = true;
      equipBtn.classList.add("isDisabled");
      equipBtn.textContent = trText("Недоступно", "Unavailable");
      return;
    }
    const affordable = Number(state.modules?.crystals ?? state.profile?.crystals ?? 0) >= Number(mod.price || 0);
    equipBtn.disabled = !affordable;
    equipBtn.classList.toggle("isDisabled", !affordable);
    equipBtn.textContent = affordable
      ? `${trText("Купить", "Buy")} · ${Number(mod.price || 0)} 💎`
      : trText("Недостаточно кристаллов", "Not enough crystals");
    return;
  }
  const microUnlocked = isUnlocked(key);
  const microBtn = qs("microUpgradeBtn");
  if (microBtn) {
    microBtn.style.display = "";
    microBtn.textContent = trText("МИКРОПРОКАЧКИ", "MICRO UPGRADES");
    microBtn.disabled = !microUnlocked;
    microBtn.classList.toggle("isDisabled", !microUnlocked);
  }
  const equippedCurrent = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  const isCurrentEquipped = key === equippedCurrent;
  const isCurrentUnlocked = microUnlocked;
  if (!isCurrentUnlocked) {
    equipBtn.disabled = true;
    equipBtn.classList.add("isDisabled");
    equipBtn.textContent = trText("Недоступно", "Unavailable");
    return;
  }
  if (isCurrentEquipped) {
    equipBtn.disabled = true;
    equipBtn.classList.add("isDisabled");
    equipBtn.textContent = trText("Установлено", "Equipped");
    return;
  }
  equipBtn.disabled = false;
  equipBtn.classList.remove("isDisabled");
  equipBtn.textContent = trText("Установить", "Equip");
}

function resetGaragePreviewSelection() {
  if (!state.profile) return;
  state.selectedWeapon = String(state.profile.weapon || "smoky");
  state.selectedHull = String(state.profile.hull || "hunter");
}

function microCurrentType() {
  return state.garageCategory === "hull" ? "hull" : "weapon";
}

function microCurrentKey() {
  return currentGarageKey();
}

function microStatLabel(stat) {
  const key = String(stat || "").toLowerCase();
  const ru = {
    damage: "Урон",
    accuracy: "Точность",
    hp: "HP",
    armor: "Броня",
  };
  const en = {
    damage: "Damage",
    accuracy: "Accuracy",
    hp: "HP",
    armor: "Armor",
  };
  return state.locale === "en" ? (en[key] || key) : (ru[key] || key);
}

function formatMicroEffects(effects) {
  const order = ["damage", "accuracy", "hp", "armor"];
  const src = effects && typeof effects === "object" ? effects : {};
  const keys = order.filter((k) => Number(src[k] || 0) !== 0);
  if (!keys.length) return "—";
  return keys.map((k) => `+${Number(src[k] || 0)} ${microStatLabel(k)}`).join(" · ");
}

function microProgressPips(level, maxLevel) {
  const lvl = Math.max(0, Number(level || 0));
  const max = Math.max(0, Number(maxLevel || 0));
  return Array.from({ length: max }, (_, i) => `<span class="${i < lvl ? "isFilled" : ""}"></span>`).join("");
}

function closeMicroUpgradeModal() {
  const modal = qs("microModal");
  if (!modal) return;
  modal.classList.remove("isOpen");
  modal.style.display = "none";
}

async function loadMicroUpgradesForCurrent() {
  const type = microCurrentType();
  const key = microCurrentKey();
  const info = await api(`/api/micro_upgrades?item_type=${encodeURIComponent(type)}&item_key=${encodeURIComponent(key)}`);
  state.microUpgrades = info;
  renderMicroUpgradeModal();
  return info;
}

function renderMicroUpgradeModal() {
  const info = state.microUpgrades;
  const list = qs("microUpgradeList");
  if (!list) return;
  const itemKey = String(info?.item_key || microCurrentKey() || "");
  const itemType = String(info?.item_type || microCurrentType());
  const itemLabel = itemName(itemKey) || String(info?.item_name || itemKey);
  const title = qs("microTitle");
  const sub = qs("microSub");
  const img = qs("microItemImg");
  const crystals = qs("microCrystals");
  const tankPower = qs("microTankPower");
  if (title) title.textContent = itemLabel ? itemLabel.toUpperCase() : "—";
  if (sub) {
    const typeLabel = itemType === "hull" ? trText("Корпус", "Hull") : trText("Пушка", "Weapon");
    sub.textContent = `${typeLabel} · ${trText("дорогие точечные улучшения", "expensive targeted upgrades")}`;
  }
  if (img) img.src = withCacheBust(absUrl(getItemImage(itemKey)));
  if (crystals) crystals.textContent = String(info?.crystals ?? state.profile?.crystals ?? 0);
  if (tankPower) tankPower.textContent = String(info?.tank_power ?? state.profile?.tank_power ?? 0);
  if (!info) {
    list.innerHTML = `<div class="microLoading">${trText("Загрузка микропрокачек...", "Loading micro upgrades...")}</div>`;
    return;
  }
  const upgrades = Array.isArray(info.upgrades) ? info.upgrades : [];
  list.innerHTML = upgrades.map((up) => {
    const quality = String(up.quality || "basic").toLowerCase();
    const level = Number(up.level || 0);
    const maxLevel = Number(up.max_level || 0);
    const maxed = Boolean(up.is_maxed) || (maxLevel > 0 && level >= maxLevel);
    const locked = Boolean(up.is_locked);
    const cost = Number(up.cost || 0);
    const affordable = Number(info.crystals || 0) >= cost;
    const canBuy = Boolean(up.can_buy) && !maxed && affordable;
    const stateText = locked
      ? String(up.lock_reason || trText("Сначала закрой предыдущую редкость.", "Finish the previous tier first."))
      : (maxed
        ? trText("Редкость закрыта на максимум", "Tier maxed out")
        : (affordable
          ? trText("Готово к покупке следующего уровня", "Ready for the next level")
          : trText("Нужно больше кристаллов", "Need more crystals")));
    const totalText = level > 0
      ? formatMicroEffects(up.total_effects)
      : trText("Бонусов пока нет", "No bonuses yet");
    const perLevelText = formatMicroEffects(up.effects_per_level);
    const btnText = maxed
      ? trText("МАКСИМУМ", "MAXED")
      : `${trText("УЛУЧШИТЬ", "UPGRADE")} · ${cost} 💎`;
    return `
      <article class="microUpgradeCard microQuality-${quality}${locked ? " isLocked" : ""}${maxed ? " isMaxed" : ""}${canBuy ? " canBuy" : ""}">
        <div class="microCardGlow" aria-hidden="true"></div>
        <div class="microCardShine" aria-hidden="true"></div>
        <div class="microUpgradeHead">
          <span class="microQualityBadge">${escapeHtml(String(up.quality_label || quality))}</span>
          <span class="microLevelText">${level}/${maxLevel}</span>
        </div>
        <div class="microUpgradeTitle">${escapeHtml(String(up.title || ""))}</div>
        <div class="microUpgradeDesc">${escapeHtml(String(up.description || ""))}</div>
        <div class="microEffectRow">
          <span>${escapeHtml(perLevelText)}</span>
        </div>
        <div class="microTotalRow">${escapeHtml(totalText)}</div>
        <div class="microStateRow">${escapeHtml(stateText)}</div>
        <div class="microPips">${microProgressPips(level, maxLevel)}</div>
        <button class="microBuyBtn" type="button" data-micro-buy="${escapeHtml(String(up.upgrade_key || ""))}" ${canBuy ? "" : "disabled"}>
          ${escapeHtml(locked ? trText("ЗАБЛОКИРОВАНО", "LOCKED") : btnText)}
        </button>
      </article>
    `;
  }).join("");
}

async function openMicroUpgradeModal() {
  const key = microCurrentKey();
  if (!isUnlocked(key)) {
    const hint = qs("garageHint");
    if (hint) hint.textContent = trText("Сначала разблокируй этот предмет.", "Unlock this item first.");
    return;
  }
  const modal = qs("microModal");
  if (!modal) return;
  state.microUpgrades = null;
  renderMicroUpgradeModal();
  modal.style.display = "flex";
  requestAnimationFrame(() => modal.classList.add("isOpen"));
  try {
    await loadMicroUpgradesForCurrent();
    clearError();
  } catch (err) {
    setError(prettyError(err));
    listErrorToMicro(prettyError(err));
  }
}

function listErrorToMicro(message) {
  const list = qs("microUpgradeList");
  if (!list) return;
  list.innerHTML = `<div class="microLoading microError">${escapeHtml(String(message || ""))}</div>`;
}

async function buyMicroUpgrade(upgradeKey, btn) {
  const info = state.microUpgrades;
  if (!info || !upgradeKey) return;
  if (btn) btn.disabled = true;
  try {
    const updated = await api("/api/micro_upgrades/buy", {
      method: "POST",
      body: JSON.stringify({
        item_type: info.item_type,
        item_key: info.item_key,
        upgrade_key: upgradeKey,
      }),
    });
    state.microUpgrades = updated;
    if (state.profile) {
      state.profile.crystals = updated.crystals;
      state.profile.tank_power = updated.tank_power;
    }
    renderHud();
    renderGarage();
    renderMicroUpgradeModal();
    clearError();
  } catch (err) {
    setError(prettyError(err));
    renderMicroUpgradeModal();
  } finally {
    if (btn) btn.disabled = false;
  }
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
  const tTitle = document.querySelector("#panelProfile .profileTankTitle");
  if (tTitle) {
    const p = Number(state.profile.tank_power || 0);
    tTitle.textContent = state.locale === "en" ? `My tank • Power ${p}` : `Мой танк • Сила ${p}`;
  }

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

function renderReferrals() {
  if (!state.profile) return;
  const invited = Number(state.profile.referral_invited_total || 0);
  const rewarded = Number(state.profile.referral_rewarded_total || 0);
  const rawLeft = Number(state.profile.referral_remaining_slots);
  const left = Number.isFinite(rawLeft) && (rawLeft > 0 || rewarded >= 20)
    ? rawLeft
    : Math.max(0, 20 - rewarded);
  const totalSlots = 20;

  const refInput = qs("refLinkInput");
  if (refInput) refInput.value = String(state.profile.referral_link || "");
  const refStats = qs("refStatsLine");
  if (refStats) {
    refStats.textContent = state.locale === "en"
      ? `Invited: ${invited} • Rewarded: ${rewarded} • Slots left: ${left}/${totalSlots || 20}`
      : `Приглашено: ${invited} • Награждено: ${rewarded} • Осталось слотов: ${left}/${totalSlots || 20}`;
  }
  qs("refInvitedValue").textContent = String(invited);
  qs("refRewardedValue").textContent = String(rewarded);
  qs("refSlotsValue").textContent = `${left}/${totalSlots || 20}`;

  const milestones = [
    { target: 3, icon: "👑", rewardRu: "+1 день премиума", rewardEn: "+1 premium day" },
    { target: 7, icon: "👑", rewardRu: "+2 дня премиума", rewardEn: "+2 premium days" },
    { target: 12, icon: "🎖", rewardRu: "+1 премиум контейнер", rewardEn: "+1 premium container" },
    { target: 20, icon: "🏆", rewardRu: "+2 премиум контейнера", rewardEn: "+2 premium containers" },
  ];
  const list = qs("refMilestonesList");
  if (!list) return;
  list.innerHTML = "";
  const nextTarget = milestones.find((m) => rewarded < m.target)?.target || null;
  for (const m of milestones) {
    const done = rewarded >= m.target;
    const stateLabel = done
      ? tr("ref_milestone_done")
      : (nextTarget === m.target ? tr("ref_milestone_next") : tr("ref_milestone_locked"));
    const card = document.createElement("article");
    card.className = `refMilestoneCard${done ? " isDone" : ""}${nextTarget === m.target ? " isNext" : ""}`;
    const progressText = done
      ? `${m.target}/${m.target}`
      : `${Math.min(rewarded, m.target)}/${m.target}`;
    card.innerHTML = `
      <div class="refMilestoneTop">
        <div class="refMilestoneIcon">${m.icon}</div>
        <div class="refMilestoneTarget">${m.target}</div>
      </div>
      <div class="refMilestoneReward">${state.locale === "en" ? m.rewardEn : m.rewardRu}</div>
      <div class="refMilestoneMeta">
        <span class="refMilestoneState">${stateLabel}</span>
        <span class="refMilestoneProgress">${progressText}</span>
      </div>
      <div class="refMilestoneBar"><i style="width:${Math.max(0, Math.min(100, (Math.min(rewarded, m.target) / m.target) * 100))}%"></i></div>
    `;
    list.appendChild(card);
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
  const normalizedName = name.trim();
  const looksGenericName = /^игрок\b/i.test(normalizedName) || /^player\b/i.test(normalizedName);
  const initial = looksGenericName ? "👤" : (normalizedName.charAt(0).toUpperCase() || "U");
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

function rankRequirementHtml(mod) {
  const rankName = mod?.rank_name ? trRankName(String(mod.rank_name)) : String(mod?.rank_required || "");
  const rankSrc = withCacheBust(absUrl(rankImageUrlFromId(Number(mod?.rank_required || 1))));
  return `<span class="moduleRankRequirement"><img src="${rankSrc}" alt="" loading="lazy">${escapeHtml(rankName)}</span>`;
}

function renderGarage() {
  if (!state.profile) return;
  const key = currentGarageKey();
  const isModuleTab = state.garageCategory === "modules";
  const mod = isModuleTab ? moduleByKey(key) : null;
  const unlocked = isUnlocked(key);
  const previewWeapon = String(state.selectedWeapon || state.profile.weapon || "smoky");
  const previewHull = String(state.selectedHull || state.profile.hull || "hunter");
  const isPreviewChanged = previewWeapon !== String(state.profile.weapon || "smoky")
    || previewHull !== String(state.profile.hull || "hunter");
  const selectedModuleRankLocked = Boolean(isModuleTab && mod && !mod.available);
  qs("garageSelectedName").textContent = `${itemName(key)}`.toUpperCase();
  qs("garageSelectedDesc").textContent = isModuleTab ? (itemDescription(key) || itemLockedHint(key)) : unlocked
    ? (itemDescription(key) || (state.locale === "en" ? "Select an item." : "Выберите предмет."))
    : itemLockedHint(key);
  const moduleMeta = qs("garageModuleMeta");
  if (moduleMeta) {
    if (isModuleTab && mod) {
      const rows = [
        [trText("Тип", "Type"), escapeHtml(mod.slot === "active" ? trText("Активный", "Active") : trText("Пассивный", "Passive"))],
        [trText("Требуется", "Requires"), rankRequirementHtml(mod)],
        [trText("Стоимость", "Price"), escapeHtml(`${Number(mod.price || 0)} 💎`)],
        [trText("Сила", "Power"), escapeHtml(`+${Number(mod.power_bonus || 0)}`)],
      ];
      if (mod.limit_text) rows.push([trText("Лимит", "Limit"), escapeHtml(String(mod.limit_text))]);
      moduleMeta.innerHTML = rows.map(([label, value]) => `
        <div class="stageModuleMetaRow">
          <span>${escapeHtml(label)}</span>
          <strong>${value}</strong>
        </div>
      `).join("");
      moduleMeta.style.display = "grid";
    } else {
      moduleMeta.innerHTML = "";
      moduleMeta.style.display = "none";
    }
  }
  const garageImg = qs("garageTankImg");
  const lockedPreview = qs("garageLockedPreview");
  if (garageImg) {
    garageImg.src = withCacheBust(absUrl(isModuleTab ? getItemImage(key) : getTankComboImage(previewWeapon, previewHull)));
    garageImg.dataset.preview = isPreviewChanged ? "1" : "0";
    garageImg.style.display = selectedModuleRankLocked ? "none" : "";
    garageImg.closest(".tankShowcase")?.classList.toggle("isPreviewMode", isPreviewChanged && !isModuleTab);
    garageImg.closest(".tankShowcase")?.classList.toggle("isModuleShowcase", isModuleTab);
    garageImg.closest(".tankShowcase")?.classList.toggle("isLockedModuleShowcase", selectedModuleRankLocked);
  }
  if (lockedPreview) {
    lockedPreview.style.display = selectedModuleRankLocked ? "flex" : "none";
  }
  const p = Number(state.profile.tank_power || 0);
  const hint = qs("garageHint");
  if (hint) {
    hint.textContent = isModuleTab
      ? ""
      : isPreviewChanged
      ? trText(
          `Превью сборки: ${itemName(previewWeapon)} + ${itemName(previewHull)}. Нажми "Установить", чтобы применить.`,
          `Preview build: ${itemName(previewWeapon)} + ${itemName(previewHull)}. Press "Equip" to apply.`
        )
      : (state.locale === "en" ? `Tank power: ${p}` : `Сила танка: ${p}`);
  }
  const equippedCurrent = state.garageCategory === "weapon" ? state.profile.weapon : state.profile.hull;
  updateGarageEquipButton();
  const rail = qs("garageItemsRail");
  if (rail) {
    const list = garageList();
    const existingKeys = Array.from(rail.children).map((child) => String(child.dataset.itemKey || ""));
    const sameList = existingKeys.length === list.length && list.every((key, idx) => key === existingKeys[idx]);
    if (sameList) {
      for (const card of Array.from(rail.children)) {
        const itemKey = String(card.dataset.itemKey || "");
        const itemMod = isModuleTab ? moduleByKey(itemKey) : null;
        const moduleRankLocked = Boolean(isModuleTab && itemMod && !itemMod.available);
        const cardUnlocked = isModuleTab ? !moduleRankLocked : isUnlocked(itemKey);
        card.classList.toggle("isLocked", !cardUnlocked);
        card.classList.toggle("isSelected", itemKey === key);
        card.classList.toggle("isEquipped", Boolean(itemMod?.equipped));
        const nameEl = card.querySelector(".itemName");
        if (nameEl) nameEl.textContent = itemName(itemKey);
        const priceEl = card.querySelector(".moduleCardPrice");
        if (priceEl && itemMod) priceEl.textContent = `${Number(itemMod.price || 0)} 💎`;
        const metaEl = card.querySelector(".moduleCardMeta");
        if (metaEl) metaEl.textContent = itemMod
          ? (itemMod.slot === "active" ? trText("Активный", "Active") : trText("Пассивный", "Passive"))
          : "";
      }
      return;
    }

    rail.innerHTML = "";
    for (const itemKey of list) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "itemCard";
      card.dataset.itemKey = itemKey;
      const itemMod = isModuleTab ? moduleByKey(itemKey) : null;
      const moduleRankLocked = Boolean(isModuleTab && itemMod && !itemMod.available);
      const cardUnlocked = isModuleTab ? !moduleRankLocked : isUnlocked(itemKey);
      if (!cardUnlocked) card.classList.add("isLocked");
      if (itemKey === key) card.classList.add("isSelected");
      if (itemMod?.equipped) card.classList.add("isEquipped");
      card.innerHTML = cardUnlocked
        ? `
          <img src="${withCacheBust(absUrl(getItemImage(itemKey)))}" alt="${itemName(itemKey)}" />
          <div class="itemName">${itemName(itemKey)}</div>
          ${itemMod ? `
            <div class="moduleCardMeta">${itemMod.slot === "active" ? trText("Активный", "Active") : trText("Пассивный", "Passive")}</div>
            ${itemMod.owned ? "" : `<div class="moduleCardPrice">${Number(itemMod.price || 0)} 💎</div>`}
          ` : ""}
        `
        : `
          <div class="lockedQuestionMark">?</div>
          <div class="itemName">${itemName(itemKey)}</div>
          ${itemMod ? `<div class="moduleCardMeta">${rankRequirementHtml(itemMod)}</div>` : ""}
      `;
      card.onclick = () => {
        if (state.garageCategory === "modules") state.selectedModule = itemKey;
        else if (state.garageCategory === "weapon") state.selectedWeapon = itemKey;
        else state.selectedHull = itemKey;
        renderGarage();
      };
      rail.appendChild(card);
    }
  }
}

function renderShop() {
  const list = qs("shopList");
  const promoPanel = qs("promoPanel");
  const shopHeader = qs("shopHeader");
  const shopContent = promoPanel?.closest(".shopContent");
  if (!state.shop) return;
  const categoryItems = state.shop.items.filter((i) => i.category === state.shopCategory);
  renderShopShowcase(state.shopCategory, categoryItems);
  if (shopContent) {
    shopContent.classList.toggle("isPremiumContainersView", state.shopCategory === "premium_containers");
  }

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
  if (shopHeader) {
    shopHeader.textContent = `${shopCategoryLabel(state.shopCategory)} · ${categoryItems.length}`;
  }

  list.innerHTML = "";
  if (state.shopCategory === "premium" || state.shopCategory === "premium_containers") {
    const warning = document.createElement("div");
    warning.className = "starsRecordWarning";
    warning.textContent = trText(
      "При совершении покупки через Stars обязательно проводите запись экрана всего процесса покупки, в противном случае при обращении в поддержку ваш запрос не будет рассмотрен без доказательств.",
      "When purchasing via Stars, record the full screen during the purchase process. Support requests without proof may be declined."
    );
    list.appendChild(warning);
  }
  if (state.shopCategory === "premium_containers") {
    const card = document.createElement("div");
    card.className = "shopCard shopPremiumContainerShowcase";
    card.innerHTML = `
      <div class="premiumContainerBgFx"></div>
      <div class="premiumContainerShowcaseLayout">
        <div class="premiumContainerVisual">
          <div class="premiumContainerHero">
            <img src="${withCacheBust(absUrl(PREMIUM_CONTAINER_CLOSED_IMAGE))}" alt="premium container" class="premiumContainerHeroImg">
          </div>
        </div>
        <div class="premiumContainerInfo">
          <div class="premiumContainerKicker">${trText("Легендарный дроп", "Legendary drop")}</div>
          <div class="shopCardTitle">${trText("Премиум контейнер", "Premium container")}</div>
          <div class="shopCardMeta">${trText("Только легендарные награды", "Legendary rewards only")}</div>
          <div class="premiumContainerDrops">
            <span class="shopPremiumChip">💎 5k / 10k / 15k / 20k / 25k / 30k</span>
            <span class="shopPremiumChip">👑 1–3 ${trText("дня", "days")}</span>
            <span class="shopPremiumChip">🔫 ${trText("Рельса, Рикошет, Молот", "Railgun, Ricochet, Molot")}</span>
            <span class="shopPremiumChip">🛡 ${trText("Паладин", "Paladin")}</span>
          </div>
          <div class="shopCardActions premiumContainerActions">
            <span class="shopPrice premiumContainerPrice"><span class="shopPriceStars">49 ⭐</span></span>
            <button class="promoBtn starsBuyBtn" data-stars-buy="premium_container" style="margin-top:0">${trText("Купить за ⭐ Stars", "Buy with ⭐ Stars")}</button>
          </div>
        </div>
      </div>
    `;
    list.appendChild(card);
  }
  for (const item of categoryItems) {
    const card = document.createElement("div");
    const isPremium = item.category === "premium";
    card.className = `shopCard${isPremium ? " shopCardPremium" : ` shopCardItem shopCardItem--${item.category}`}${item.owned ? " isOwned" : ""}`;
    const premiumMeta = isPremium ? (SHOP_PREMIUM_META[item.key] || {}) : null;
    const hasStars = Number(item.stars_price || 0) > 0;
    const starsPrice = hasStars ? `${Number(item.stars_price)} ⭐` : "";
    const crystalsPrice = `${Number(item.price || 0)} 💎`;
    const itemLabel = item.category === "weapon"
      ? trText("Пушка", "Weapon")
      : (item.category === "hull" ? trText("Корпус", "Hull") : shopCategoryLabel(item.category));
    const itemMetaText = state.locale === "en"
      ? (item.description_en || itemDescription(item.key) || item.description || "")
      : (item.description || itemDescription(item.key) || item.description_en || "");
    const buyButton = isPremium
      ? `
        <div class="shopBuyDual">
          <button class="promoBtn shopBuyBtn shopBuyBtnPremium" data-stars-buy="${item.key}" style="margin-top:0">
            ${trText("Оформить за ⭐", "Activate with ⭐")} · ${starsPrice || "—"}
          </button>
          <button class="ghostBtn shopBuyBtn shopBuyBtnAlt" data-buy="${item.key}" style="margin-top:0">
            ${trText("Или за 💎", "Or with 💎")} · ${crystalsPrice}
          </button>
        </div>
      `
      : (item.owned
        ? `<button class="promoBtn shopBuyBtn" type="button" style="margin-top:0" disabled>${trText("Куплено", "Owned")}</button>`
        : `<button class="promoBtn shopBuyBtn" data-buy="${item.key}" style="margin-top:0">${trText("Купить", "Buy")} · ${crystalsPrice}</button>`);
    if (isPremium) {
      card.innerHTML = `
        <div class="shopPremiumGlow"></div>
        <div class="shopPremiumHero">
          <img src="${withCacheBust(absUrl(item.image_url))}" alt="${item.name}">
          <div class="shopPremiumBadge">${escapeHtml(premiumMetaText(premiumMeta, "accent") || trText("Премиум", "Premium"))}</div>
        </div>
        <div class="shopCardTitle">${escapeHtml(premiumMetaText(premiumMeta, "title") || String(item.name || ""))}</div>
        <div class="shopCardMeta">${escapeHtml(premiumMetaText(premiumMeta, "subtitle") || trText("Подписка суммируется с уже активной.", "Subscription is stackable with an active one."))}</div>
        <div class="shopPremiumPerks">
          <span class="shopPremiumChip">${escapeHtml(premiumMetaText(premiumMeta, "duration") || String(item.name || ""))}</span>
          <span class="shopPremiumChip">${escapeHtml(String(premiumMeta?.icon || "👑"))} ${escapeHtml(trText("срок суммируется", "stackable"))}</span>
        </div>
        <div class="shopCardActions">
          ${buyButton}
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="shopCardMedia">
          <div class="shopCardMediaGlow"></div>
          <img src="${withCacheBust(absUrl(item.image_url))}" alt="${item.name}">
          <span class="shopCardBadge">${escapeHtml(itemLabel)}</span>
          ${item.owned ? `<span class="shopOwnedPill">${trText("Куплено", "Owned")}</span>` : ""}
        </div>
        <div class="shopCardBody">
          <div class="shopCardTitle">${displayItemName(item)}</div>
          <div class="shopCardMeta">${escapeHtml(String(itemMetaText || trText("Доступно в магазине за кристаллы.", "Available in the shop for crystals.")))}</div>
        </div>
        <div class="shopCardActions"><span class="shopPrice">${crystalsPrice}</span>${buyButton}</div>
      `;
    }
    list.appendChild(card);
  }
  list.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const itemKey = btn.getAttribute("data-buy");
      const item = state.shop?.items?.find((it) => it.key === itemKey);
      showShopBuyConfirm(item, async () => {
        const okBtn = qs("confirmOkBtn");
        const cancelBtn = qs("confirmCancelBtn");
        btn.disabled = true;
        if (okBtn) okBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = true;
        try {
          await api("/api/shop/buy", { method: "POST", body: JSON.stringify({ item: itemKey }) });
          hideConfirmModal();
          await refreshAll();
          if (item?.category === "premium") {
            const premiumMeta = SHOP_PREMIUM_META[item.key] || {};
            showPurchaseLikeModal({
            title: trText("ПРЕМИУМ АКТИВИРОВАН", "PREMIUM ACTIVATED"),
            label: trText("Подписка продлена на:", "Subscription extended by:"),
            icon: String(premiumMeta.icon || "👑"),
            name: premiumMetaText(premiumMeta, "duration") || String(item.name || trText("Премиум", "Premium")),
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
          if (okBtn) okBtn.disabled = false;
          if (cancelBtn) cancelBtn.disabled = false;
        }
      });
    });
  });

  list.querySelectorAll("[data-stars-buy]").forEach((btn) => {
    btn.addEventListener("click", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      btn.disabled = true;
      const itemKey = btn.getAttribute("data-stars-buy");
      const item = state.shop?.items?.find((it) => it.key === itemKey);
      try {
        const paid = await starsBuy(itemKey);
        if (!paid) return;
        if (item?.category === "premium") {
          const premiumMeta = SHOP_PREMIUM_META[item.key] || {};
          showPurchaseLikeModal({
            title: trText("ПРЕМИУМ АКТИВИРОВАН", "PREMIUM ACTIVATED"),
            label: trText("Подписка продлена на:", "Subscription extended by:"),
            icon: String(premiumMeta.icon || "👑"),
            name: premiumMetaText(premiumMeta, "duration") || String(item.name || trText("Премиум", "Premium")),
            price: `${Number(item.stars_price || 0)} ⭐`,
          });
        } else {
          showPurchaseLikeModal({
            title: trText("ПОКУПКА ПРОИЗВЕДЕНА УСПЕШНО", "PURCHASE SUCCESSFUL"),
            label: trText("Вы приобрели:", "You purchased:"),
            icon: "⭐",
            name: item?.name || itemName(itemKey) || itemKey,
            price: `${Number(item?.stars_price || 0)} ⭐`,
          });
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
  const img = qs("containerImg");
  const meta = qs("containerMetaRow");
  const info = state.containersInfo;
  const isPremium = state.containerKind === "premium";
  qs("panelContainers")?.classList.toggle("isPremiumContainerView", isPremium);
  if (img) {
    img.src = withCacheBust(absUrl(isPremium ? (info.premium_container_image_url || PREMIUM_CONTAINER_CLOSED_IMAGE) : info.container_image_url));
  }
  if (meta) {
    const std = Number(info.containers || 0);
    const prem = Number(info.premium_containers || 0);
    const active = isPremium ? prem : std;
    const label = isPremium ? trText("Премиум контейнеры", "Premium containers") : trText("Контейнеры", "Containers");
    const buyBtn = isPremium
      ? `<button class="promoBtn starsBuyBtn" type="button" data-stars-buy="premium_container">${trText("Купить за ⭐", "Buy with ⭐")}</button>`
      : "";
    const premiumInfo = isPremium ? `
      <div class="premiumContainerShowInfo">
        <div class="premiumContainerShowTitle">${trText("Премиум контейнер", "Premium container")}</div>
        <div class="premiumContainerShowSub">${trText("Только легендарные награды", "Legendary rewards only")}</div>
        <div class="premiumContainerDrops">
          <span class="shopPremiumChip">💎 5k / 10k / 15k / 20k / 25k / 30k</span>
          <span class="shopPremiumChip">👑 1-3 ${trText("дня", "days")}</span>
          <span class="shopPremiumChip">🔫 ${trText("Рельса, Рикошет, Молот", "Railgun, Ricochet, Molot")}</span>
          <span class="shopPremiumChip">🛡 ${trText("Паладин", "Paladin")}</span>
        </div>
      </div>
    ` : "";
    meta.innerHTML = `
      <div class="containerMetaLeft">
        <div class="containerMetaTitle">${label}</div>
        <div class="containerMetaCounts">
          <span class="containerPill">📦 ${std}</span>
          <span class="containerPill isPremium">✨ ${prem}</span>
        </div>
      </div>
      <div class="containerMetaRight">
        <div class="containerMetaActive">${trText("Доступно", "Available")}: <b>${active}</b></div>
        ${buyBtn}
      </div>
      ${premiumInfo}
    `;
  }
  // Disable open button when no containers for selected kind
  const openBtn = qs("openContainerBtn");
  if (openBtn) {
    const hasAny = isPremium ? Number(info.premium_containers || 0) > 0 : Number(info.containers || 0) > 0;
    openBtn.disabled = !hasAny;
    openBtn.classList.toggle("isDisabled", !hasAny);
  }
}

function formatQuestReset(seconds) {
  const sec = Math.max(0, Number(seconds || 0));
  if (sec < 60) return state.locale === "en" ? `${Math.floor(sec)}s` : `${Math.floor(sec)}с`;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return state.locale === "en" ? `${h}h ${m}m` : `${h}ч ${m}м`;
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
    list.innerHTML = `<div class="leadersEmpty">${trText("Квесты скоро появятся.", "Quests will appear soon.")}</div>`;
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
    const disabledQuestLabel = !q.available
      ? tr("quest_status_premium_only")
      : (q.claimed ? tr("quest_claimed") : tr("quest_status_progress"));
    const btn = (!q.available || q.claimed || !q.completed)
      ? `<button class="promoBtn questClaimBtn" type="button" disabled>${disabledQuestLabel}</button>`
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
  const timing = REWARD_REVEAL_TIMINGS[rarity] || REWARD_REVEAL_TIMINGS.rare;
  const modal = qs("rewardModal");
  const card = qs("rewardCard");
  const box = qs("rewardContainerBox");
  const contImg = qs("rewardContainerImg");
  const dropImg = qs("rewardDropImg");
  const text = qs("rewardText");
  if (!modal || !card || !box || !contImg || !dropImg || !text) {
    qs("containerResult").textContent = rewardTextFromResult(result);
    return;
  }
  try {
    card.getAnimations?.().forEach((animation) => animation.cancel());
    box.getAnimations?.().forEach((animation) => animation.cancel());
    contImg.getAnimations?.().forEach((animation) => animation.cancel());
  } catch {}
  modal.classList.remove("isOpen");
  card.className = "rewardCard";
  card.style.setProperty("--reward-glow-ms", `${Number(timing.glowMs || 680)}ms`);
  state.rewardAnimating = true;
  box.className = "rewardContainerBox";
  dropImg.className = "rewardDropImg";
  contImg.className = "rewardContainerImg";
  text.className = "rewardText";
  try { dropImg.getAnimations?.().forEach((animation) => animation.cancel()); } catch {}
  try { text.getAnimations?.().forEach((animation) => animation.cancel()); } catch {}
  dropImg.removeAttribute("src");
  dropImg.style.opacity = "0";
  dropImg.style.visibility = "hidden";
  text.style.opacity = "0";
  text.style.visibility = "hidden";
  text.textContent = "";
  const isPremiumContainer = String(result.container_kind || "") === "premium";
  box.classList.add(isPremiumContainer ? "isPremiumReward" : "isStandardReward");
  const closedSrc = withCacheBust(absUrl(isPremiumContainer ? PREMIUM_CONTAINER_CLOSED_IMAGE : CONTAINER_CLOSED_IMAGE));
  const openedSrc = withCacheBust(absUrl(
    isPremiumContainer
      ? "/images/webapp/prem_containeropen.png"
      : (CONTAINER_OPEN_IMAGES[rarity] || CONTAINER_OPEN_IMAGES.rare)
  ));
  contImg.src = closedSrc;
  contImg.classList.remove("isHidden");
  const rewardKey = result.reward_type === "crystals" ? "crystals" : (result.reward_type === "premium" ? "premium" : result.reward_key);
  const dropSrc = withCacheBust(absUrl(REWARD_ITEM_IMAGES[rewardKey] || "/images/webapp/crystals.png"));
  // Preload reveal assets while the rarity charge builds up.
  void preloadImage(openedSrc, 2600);
  void preloadImage(dropSrc, 2600);
  modal.style.display = "flex";
  await new Promise((resolve) => requestAnimationFrame(resolve));
  modal.classList.add("isOpen");
  card.classList.add("isEntering");
  await sleep(90);
  box.classList.add("isCharging");
  if (Number(timing.preDelay || 0) > 0) {
    await sleep(Number(timing.preDelay || 0));
  }
  card.className = `rewardCard rarity-${rarity} isEntering isPrimed`;
  box.classList.add("isPrimed");
  await sleep(Number(timing.glowMs || 680));
  card.classList.add("isReveal");
  box.classList.remove("isCharging");
  box.classList.add("isReveal");
  contImg.classList.add("isHidden");
  await sleep(Number(timing.swapMs || 180));
  contImg.src = openedSrc;
  await Promise.race([
    waitForImageLoad(contImg, 900),
    sleep(650),
  ]);
  contImg.classList.remove("isHidden");
  await new Promise((resolve) => requestAnimationFrame(resolve));
  placeRewardDropOnContainer(box, contImg, isPremiumContainer);
  if (Number(timing.dropDelay || 0) > 0) {
    await sleep(Number(timing.dropDelay || 0));
  }
  dropImg.src = dropSrc;
  await Promise.race([waitForImageLoad(dropImg, 900), sleep(420)]);
  box.classList.add("rewardBurst", `rewardBurst--${rarity}`);
  window.setTimeout(() => {
    try { box.classList.remove("rewardBurst", `rewardBurst--${rarity}`); } catch {}
  }, 620);
  text.textContent = rewardTextFromResult(result);
  dropImg.classList.remove("show");
  text.classList.remove("show");
  dropImg.style.visibility = "visible";
  text.style.visibility = "visible";
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  dropImg.classList.add("show");
  await sleep(Number(timing.textDelay || 120));
  text.classList.add("show");
  await sleep(Math.max(Number(timing.dropFadeMs || 420), Number(timing.textFadeMs || 340)));
  await sleep(Number(timing.settleMs || 420));
  state.rewardAnimating = false;
}

function hideRewardModal() {
  if (state.rewardAnimating) return;
  const modal = qs("rewardModal");
  const dropImg = qs("rewardDropImg");
  const text = qs("rewardText");
  if (modal) modal.classList.remove("isOpen");
  if (dropImg) {
    try { dropImg.getAnimations?.().forEach((animation) => animation.cancel()); } catch {}
    dropImg.classList.remove("show");
    dropImg.style.opacity = "0";
    dropImg.style.visibility = "hidden";
    dropImg.removeAttribute("src");
  }
  if (text) {
    try { text.getAnimations?.().forEach((animation) => animation.cancel()); } catch {}
    text.classList.remove("show");
    text.style.opacity = "0";
    text.style.visibility = "hidden";
    text.textContent = "";
  }
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
  if (tab === "referrals") {
    state.profile = await api("/api/profile/me");
    const loc = String(state.profile?.locale || "").toLowerCase();
    if (loc === "ru" || loc === "en") {
      const changed = state.locale !== loc;
      state.locale = loc;
      if (changed) applyStaticI18n();
    }
    renderHud();
    renderReferrals();
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
    syncLootChancesFromApi(containersInfo);
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
      const [profile, modules] = await Promise.all([
        api("/api/profile/me"),
        api("/api/modules"),
      ]);
      state.profile = profile;
      setModulesPayload(modules);
      if (!moduleByKey(state.selectedModule)) state.selectedModule = String(state.modules?.modules?.[0]?.key || "module1");
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

let tabSwitchSeq = 0;
async function showTab(tab, { force = false } = {}) {
  if (!force && state.quickMatchController && tab !== "battles") {
    setError(trText("Пока идет поиск быстрого боя, переключение вкладок недоступно.", "You can't switch tabs while quick battle search is running."));
    return;
  }
  if (!force && state.webBattleActive && tab !== "battles") {
    setError(trText("Нельзя переключать вкладки во время боя.", "You can't switch tabs during a battle."));
    return;
  }
  const prevTab = state.activeTab;
  if (prevTab === "battles" && tab !== "battles") {
    stopLobbiesPolling();
  }
  if (prevTab === "garage" && tab !== "garage") {
    resetGaragePreviewSelection();
  }
  state.activeTab = tab;
  document.querySelectorAll(".mainTab").forEach((b) => b.classList.toggle("isActive", b.dataset.tab === tab));
  const panelKeys = ["profile", "referrals", "leaders", "battles", "garage", "shop", "containers", "quests", "settings"];
  const panelByKey = (key) => qs(`panel${key[0].toUpperCase()}${key.slice(1)}`);
  const prevPanel = panelByKey(prevTab);
  const nextPanel = panelByKey(tab);
  const seq = ++tabSwitchSeq;
  const lowFpsMode = window.matchMedia?.("(pointer: coarse)")?.matches || false;
  panelKeys.forEach((key) => {
    const panel = panelByKey(key);
    if (!panel) return;
    if (panel !== prevPanel && panel !== nextPanel) {
      panel.style.display = "none";
      try { panel.getAnimations().forEach((a) => a.cancel()); } catch {}
    }
  });
  if (prevPanel && prevPanel !== nextPanel) {
    try { prevPanel.getAnimations().forEach((a) => a.cancel()); } catch {}
    if (!lowFpsMode) {
      prevPanel.animate(
        [
          { opacity: 1, transform: "scale(1)", filter: "blur(0px)" },
          { opacity: 0, transform: "scale(0.997)", filter: "blur(0.6px)" },
        ],
        { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );
    } else {
      prevPanel.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 120, easing: "linear", fill: "forwards" }
      );
    }
    window.setTimeout(() => {
      if (tabSwitchSeq !== seq) return;
      prevPanel.style.display = "none";
      prevPanel.style.opacity = "";
      prevPanel.style.transform = "";
      prevPanel.style.filter = "";
    }, lowFpsMode ? 120 : 220);
  }
  if (nextPanel) {
    nextPanel.style.display = "block";
    nextPanel.style.opacity = "0";
    nextPanel.style.transform = lowFpsMode ? "" : "scale(0.997)";
    nextPanel.style.filter = lowFpsMode ? "" : "blur(0.6px)";
    try { nextPanel.getAnimations().forEach((a) => a.cancel()); } catch {}
  }
  if (state.token) {
    try { await refreshTabContext(tab); } catch (e) { setError(prettyError(e)); }
  }
  if (tabSwitchSeq !== seq) return;
  if (nextPanel) {
    if (!lowFpsMode) {
      nextPanel.animate(
        [
          { opacity: 0, transform: "scale(0.997)", filter: "blur(0.6px)" },
          { opacity: 1, transform: "scale(1)", filter: "blur(0px)" },
        ],
        { duration: 240, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );
    } else {
      nextPanel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 130, easing: "linear", fill: "forwards" });
    }
  }
  if (tab === "quests" && state.quests?.day_key) {
    markQuestDaySeen(state.quests.day_key);
    updateQuestsTabAlert(Array.isArray(state.quests?.quests) ? state.quests.quests : []);
  }
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } catch {}
  await switchTrack();
}

async function refreshAll() {
  const [profile, shop, containersInfo, leaderboard, quests, modules] = await Promise.all([
    api("/api/profile/me"),
    api("/api/shop/items"),
    api("/api/containers"),
    api(`/api/leaderboard?sort=${encodeURIComponent(state.leaderboardSort)}&limit=${encodeURIComponent(state.leaderboardLimit)}`),
    api("/api/quests/daily"),
    api("/api/modules"),
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
  syncLootChancesFromApi(containersInfo);
  state.leaderboard = leaderboard;
  state.quests = quests;
  setModulesPayload(modules);
  if (!moduleByKey(state.selectedModule)) state.selectedModule = String(state.modules?.modules?.[0]?.key || "module1");
  if (!state.ranks) {
    try { state.ranks = (await api("/api/ranks"))?.ranks || []; } catch { state.ranks = []; }
  }
  applyBackgroundImage();
  state.selectedWeapon = state.profile.weapon;
  state.selectedHull = state.profile.hull;
  renderHud();
  renderProfile();
  await syncMusicSettingsForProfile();
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
  const loc = qs("setLocale");
  if (block) block.checked = Boolean(s.block_battle_invites);
  if (allow) allow.value = (Array.isArray(s.invites_allowlist) ? s.invites_allowlist : []).map((x) => `@${x}`).join(", ");
  if (showA) showA.checked = Boolean(s.show_avatar ?? true);
  if (vis) vis.value = String(s.chat_visibility || "on");
  if (loc) loc.value = state.locale === "ru" ? "ru" : "en";
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
    const name = escapeHtml(m.name || trText("Игрок", "Player"));
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
    const flag = `<button class="chatFlagBtn" type="button" title="${escapeHtml(trText("Пожаловаться", "Report"))}" data-report-scope="global" data-report-id="${escapeHtml(String(m.id ?? ""))}">⚑</button>`;
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
    const name = escapeHtml(m.name || trText("Игрок", "Player"));
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
    const flag = `<button class="chatFlagBtn" type="button" title="${escapeHtml(trText("Пожаловаться", "Report"))}" data-report-scope="battle" data-report-id="${escapeHtml(String(m.id ?? ""))}" data-report-battle="${escapeHtml(String(state.currentBattleId || ""))}">⚑</button>`;
    const body = `<span class="battleChatMsgInline"><span class="battleChatMsgRest">${nickBlock}<span class="chatColon">:</span> ${text}</span></span>`;
    return `<div class="battleChatLine" data-chat-msg-id="${escapeHtml(String(m.id ?? ""))}">${avatarCell}${rankCell}${body}${flag}</div>`;
  }).join("");
  if (append) list.insertAdjacentHTML("beforeend", html);
  else list.innerHTML = html;
  if (wasNearBottom) list.scrollTop = list.scrollHeight;
}

function showToast(text, { title = null, ms = 2600, sound = true } = {}) {
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
  if (sound) void playPurchaseSound();
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
  if (!lb) return trText("Все звания", "All ranks");
  if (lb.allow_all_ranks) return trText("Все звания", "All ranks");
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
  const title = escapeHtml(String(lb.name || trText("Бой", "Battle")));
  const creator = escapeHtml(String(lb.creator_name || trText("Игрок", "Player")));
  const time = Math.max(0, Math.floor(Number(lb.expires_in || 0)));
  const expiresAt = Date.now() + time * 1000;
  const rankStrip = lobbyRankRangeStripHtml(lb);
  const mapBrief = escapeHtml(lobbyCoverMapCaption(lb));
  const mode = String(lb?.pvp_mode || "classic");
  const modeBrief = mode === "deathmatch"
    ? (state.locale === "en"
      ? `Mode: DM • ${Number(lb?.target_kills || 5)} kills • ${Number(lb?.match_seconds || 120)}s`
      : `Режим: DM • ${Number(lb?.target_kills || 5)} килл. • ${Number(lb?.match_seconds || 120)}с`)
    : trText("Режим: классический", "Mode: classic");
  const statsTag = lb?.no_stats_update
    ? `<span class="battleLobbyTag">📊 ${trText("Стата: выкл", "Stats: off")}</span>`
    : `<span class="battleLobbyTag">📊 ${trText("Стата: вкл", "Stats: on")}</span>`;
  const timerSuffix = state.locale === "en" ? "s" : "с";
  return `<button class="battleLobbyCard" type="button" data-lobby="${String(lb.lobby_id || "")}">
    <div class="battleLobbyName">${title}</div>
    <div class="battleLobbyMapBrief">${mapBrief}</div>
    <div class="battleLobbyMapBrief">${escapeHtml(modeBrief)}</div>
    <div class="battleLobbyMeta">
      <span class="battleLobbyTag battleLobbyCreatorTag">${lobbyCreatorRankRowHtml(lb)}<span class="battleLobbyCreatorName">${creator}</span></span>
      <span class="battleLobbyTag battleLobbyRangeTag">${rankStrip}</span>
      ${statsTag}
      <span class="battleLobbyTag battleLobbyTimerTag" data-expires-at="${expiresAt}">⏳ ${time}${timerSuffix}</span>
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
  if (v === "with") return trText("Карта: с укрытиями", "Map: with cover");
  if (v === "without") return trText("Карта: без укрытий", "Map: no cover");
  return trText("Карта: случайная", "Map: random");
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
    el.textContent = `⏳ ${s}${state.locale === "en" ? "s" : "с"}`;
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
    el.textContent = `⏳ ${t}${state.locale === "en" ? "s" : "с"}`;
  }
  tickLobbyTimersDom();
}

function renderLobbies() {
  const section = qs("battleLobbiesSection");
  const list = qs("battleLobbiesList");
  const createBtnWrap = qs("createLobbyBtn")?.closest(".battleLobbyCreateWrap");
  const quickBtnWrap = qs("quickBattleBtn")?.closest(".battleLobbyCreateWrap");
  if (!section || !list) return;
  const modesVisible = (qs("battleModesGrid")?.style.display || "grid") !== "none";
  const botCardVisible = (qs("battleBotCard")?.style.display || "none") !== "none";
  const pvpCardVisible = (qs("battlePlayerCard")?.style.display || "none") !== "none";
  const inArena = (qs("battleArena")?.style.display || "none") !== "none" || Boolean(state.webBattleActive);
  const show = modesVisible && !inArena && !botCardVisible && !pvpCardVisible;
  if (createBtnWrap) createBtnWrap.style.display = show ? "flex" : "none";
  if (quickBtnWrap) quickBtnWrap.style.display = show ? "flex" : "none";
  section.style.display = show ? "block" : "none";
  // Quick match search widget only makes sense on the main modes screen.
  const qWidget = qs("quickMatchWidget");
  if (qWidget) {
    const widgetVisible = show && Boolean(state.quickMatchSearching);
    qWidget.style.setProperty("display", widgetVisible ? "grid" : "none", "important");
    qWidget.hidden = !widgetVisible;
    qWidget.setAttribute("aria-hidden", widgetVisible ? "false" : "true");
    qWidget.classList.toggle("isHidden", !widgetVisible);
    qWidget.classList.toggle("isOpen", widgetVisible);
  }
  if (!show) {
    stopLobbyTicker();
    return;
  }
  const lobbies = Array.isArray(state.lobbies) ? state.lobbies : [];
  if (!lobbies.length) {
    stopLobbyTicker();
    list.innerHTML = `<div class="leadersEmpty" style="grid-column:1/-1;">${tr("lobby_empty")}</div>`;
    lockBattleSearchActions(Boolean(state.battleSearchActionsLocked));
    return;
  }
  list.innerHTML = lobbies.map(lobbyCardHtml).join("");
  lockBattleSearchActions(Boolean(state.battleSearchActionsLocked));
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
  const cname = String(lb.creator_name || trText("Игрок", "Player"));
  qs("joinLobbyLabel").textContent = state.locale === "en"
    ? `Join ${cname}'s battle?`
    : `Вступить в бой игрока ${cname}?`;
  const hint = qs("joinLobbyBattleHint");
  if (hint) {
    const title = escapeHtml(String(lb.name || trText("Бой", "Battle")));
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

function localizeBattleLogLine(line) {
  if (state.locale !== "en") return String(line || "");
  let out = String(line || "");
  const rules = [
    [/бой начался/gi, "battle started"],
    [/карта: с укрытиями/gi, "map: with cover"],
    [/карта: без укрытий/gi, "map: no cover"],
    [/приз боя: контейнеры \(премиум усиливает награду\)\./gi, "battle prize: containers (premium boosts rewards)."],
    [/приз боя: опыт \(x2 при победе\)\./gi, "battle prize: experience (x2 on victory)."],
    [/приз боя: без бонуса \(только запись победы\/поражения\)\./gi, "battle prize: no bonus (win/loss record only)."],
    [/прицеливание включено\./gi, "aim enabled."],
    [/прицеливание выключено\./gi, "aim disabled."],
    [/движение вверх\./gi, "move up."],
    [/движение вниз\./gi, "move down."],
    [/движение влево\./gi, "move left."],
    [/движение вправо\./gi, "move right."],
    [/рывок Паладина/gi, "Paladin dash"],
    [/укрытие блокирует выстрел по прямой!/gi, "cover blocks line shot!"],
    [/рикошетное попадание!/gi, "ricochet hit!"],
    [/рикошет попал!/gi, "ricochet connected!"],
    [/рикошет не попал!/gi, "ricochet missed!"],
    [/попадание!/gi, "hit!"],
    [/промах!/gi, "miss!"],
    [/шанс был/gi, "chance was"],
    [/шанс/gi, "chance"],
    [/урон/gi, "damage"],
    [/победа!/gi, "victory!"],
    [/поражение!/gi, "defeat!"],
    [/щит Паладина у цели поглотил выстрел!/gi, "target's Paladin shield absorbed the shot!"],
    [/щит Паладина активирован: следующий входящий выстрел будет заблокирован\./gi, "Paladin shield activated: next incoming shot will be blocked."],
    [/сдался\./gi, "surrendered."],
    [/новое звание получено!/gi, "new rank unlocked!"],
    [/контейнер x/gi, "container x"],
    [/утешительный контейнер x/gi, "consolation container x"],
    [/\+(\d+)\sопыта/gi, "+$1 exp"],
    [/\+(\d+)\sбонусного опыта/gi, "+$1 bonus exp"],
  ];
  rules.forEach(([re, to]) => { out = out.replace(re, to); });
  return out;
}

function renderBattleLog(text) {
  const log = qs("battleLog");
  if (!log) return;
  const raw = String(text || "").trim();
  if (!raw) {
    log.innerHTML = `<div class="battleLogItem">${tr("battle_no_events")}</div>`;
    return;
  }
  const lines = raw.split("\n").map((s) => localizeBattleLogLine(s.trim())).filter(Boolean).slice(-12);
  log.innerHTML = lines.map((line) => {
    let icon = "";
    let content = line;
    const m = content.match(/^([^\w\s])\s+(.*)$/);
    if (m) {
      icon = String(m[1] || "");
      content = String(m[2] || "");
    }
    // Normalize icon for "cover blocked" lines to match PvP style.
    if (/укрытие блокирует/i.test(content)) icon = "☑";

    // Split "Name: message" to style like PvP/custom battles.
    let name = "";
    let msg = content;
    const idx = content.indexOf(":");
    if (idx > 0 && idx < 32) {
      name = content.slice(0, idx).trim();
      msg = content.slice(idx + 1).trim();
    }

    let cls = "battleLogItem";
    if (line.includes("💥") || /попадани/i.test(line)) cls += " isHit";
    else if (line.includes("❌") || /промах/i.test(line) || /пораж/i.test(line)) cls += " isWarn";
    else if (line.includes("🏆") || /побед/i.test(line)) cls += " isWin";
    else if (line.includes("⏱")) cls += " isTime";

    const safeName = escapeHtml(name);
    const safeMsg = escapeHtml(msg);
    const safeIcon = escapeHtml(icon || (name ? "👤" : "◻"));
    return `<div class="${cls}">
      <span class="battleLogIcon" aria-hidden="true">${safeIcon}</span>
      <span class="battleLogText">
        ${safeName ? `<span class="battleLogName">${safeName}</span><span class="battleLogSep">:</span> ` : ""}
        <span class="battleLogMsg">${safeMsg}</span>
      </span>
    </div>`;
  }).join("");
}

function battleFinishReasonText(st) {
  const reason = String(st?.finish_reason || "");
  if (reason === "inactive_kick") {
    return st?.winner === "player"
      ? trText("Победа: противник был выкинут за неактив.", "Victory: opponent was kicked for inactivity.")
      : trText("Поражение: вы были выкинуты за неактив.", "Defeat: you were kicked for inactivity.");
  }
  if (reason === "surrender") {
    return st?.winner === "player"
      ? trText("Победа: противник сдался.", "Victory: opponent surrendered.")
      : trText("Поражение: вы сдались.", "Defeat: you surrendered.");
  }
  return st?.winner === "player"
    ? trText("Противник уничтожен в бою.", "Opponent destroyed.")
    : trText("Ваш танк уничтожен в бою.", "Your tank was destroyed.");
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
      timeEl.textContent = state.locale === "en" ? "0s" : "0 сек";
      return;
    }
    const left = Math.max(0, Math.ceil((state.activeInviteExpireAt - Date.now()) / 1000));
    timeEl.textContent = state.locale === "en" ? `${left}s` : `${left} сек`;
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
  const inviterName = escapeHtml(String(info.inviter_name || trText("Игрок", "Player")));
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
    if (hasOutgoing && hint) {
      const left = Math.max(0, Number(inv.expires_in || 0));
      hint.textContent = state.locale === "en"
        ? `Invite is active (${left}s).`
        : `Приглашение активно (${left} сек).`;
    }
    if (!hasOutgoing && hint && (hint.textContent.includes("Приглашение активно") || hint.textContent.includes("Invite is active"))) hint.textContent = "";
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

function lockBattleSearchActions(locked) {
  state.battleSearchActionsLocked = Boolean(locked);
  const ids = [
    "quickBattleBtn",
    "profileQuickBattleBtn",
    "battleBotModeCard",
    "battlePlayerModeCard",
    "createLobbyBtn",
    "sendPvpInviteBtn",
    "cancelPvpInviteBtn",
    "pvpUsernameInput",
    "joinLobbyConfirmBtn",
    "backToModesBtn",
    "backToModesFromPvpBtn",
    "startBotBattleBtn",
  ];
  ids.forEach((id) => {
    const el = qs(id);
    if (!el) return;
    if (id === "quickMatchCancelBtn") return;
    el.disabled = Boolean(locked);
    el.classList.toggle("isDisabled", Boolean(locked));
  });
  document.querySelectorAll(".battleLobbyCard").forEach((el) => {
    el.disabled = Boolean(locked);
    el.classList.toggle("isDisabled", Boolean(locked));
  });
}

function setBattlesTitle(isInBattle, stOrIsPvp = false) {
  const title = qs("battlesTitle");
  if (!title) return;
  if (!isInBattle) {
    title.style.display = "none";
    title.textContent = "";
    return;
  }
  title.style.display = "";
  const st = (stOrIsPvp && typeof stOrIsPvp === "object") ? stOrIsPvp : null;
  const isPvp = st ? Boolean(st.is_pvp) : Boolean(stOrIsPvp);
  const isQuick = st ? Boolean(st.quick_mode) : false;
  title.textContent = isQuick ? tr("battles_quick") : (isPvp ? tr("battles_with_friend") : tr("battles_training_bot"));
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
  document.querySelectorAll(".battleSectionTitle").forEach((el) => { el.style.display = ""; });
  renderLobbies();
}

function resetBattleUI() {
  closeQuickMatchModal();
  exitBattleArenaToModes();
  const surrenderBtn = qs("battleSurrenderBtn");
  if (surrenderBtn) surrenderBtn.disabled = false;
  stopBattlePolling();
  lockMainTabs(false);
  lockBattleSearchActions(false);
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
  const card = qs("battleResultCard");
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
  if (card) {
    card.classList.toggle("isWin", isWin);
    card.classList.toggle("isLose", !isWin);
  }
  if (icon) icon.textContent = isWin ? "🏆" : "✦";
  if (text) {
    text.textContent = String(reasonText || (isWin
      ? trText(
        "Ты уничтожил соперника! Отличный бой. Нажми вне окна, чтобы продолжить.",
        "You destroyed your opponent! Great fight. Tap outside the window to continue.",
      )
      : trText(
        "Бой проигран, но это опыт. Нажми вне окна, чтобы вернуться и попробовать снова.",
        "You lost, but it's experience. Tap outside the window to return and try again.",
      )));
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
    const keepQuickSearchUi = Boolean(state.quickMatchController);
    if (!keepQuickSearchUi) {
      closeQuickMatchModal();
    }
    exitBattleArenaToModes();
    stopBattlePolling();
    lockMainTabs(keepQuickSearchUi);
    lockBattleSearchActions(keepQuickSearchUi);
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
  closeQuickMatchModal();
  const modes = qs("battleModesGrid");
  const botCard = qs("battleBotCard");
  const pvpCard = qs("battlePlayerCard");
  const arena = qs("battleArena");
  if (modes) modes.style.display = "none";
  if (botCard) botCard.style.display = "none";
  if (pvpCard) pvpCard.style.display = "none";
  if (arena) arena.style.display = "block";
  setBattlesTitle(true, st);
  document.querySelectorAll(".battleSectionTitle").forEach((el) => { el.style.display = "none"; });
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
  const playerReloadTurns = Math.max(0, Number(st.player_reload_turns || 0));
  const botReloadTurns = Math.max(0, Number(st.bot_reload_turns || 0));
  const reloadSuffix = (turns) => {
    if (turns <= 0) return "";
    return state.locale === "en" ? ` • Reload: ${turns}` : ` • Перезарядка: ${turns}`;
  };
  const bImg = qs("battleBotTankImg");
  if (bImg && st.bot_tank_image_url) {
    const next = absUrl(st.bot_tank_image_url);
    if (bImg.src !== next) bImg.src = next;
  }
  const pW = qs("battlePlayerWeapon");
  if (pW) pW.textContent = `🔫 ${localizedItemName(st.player_weapon_name || state.profile?.weapon || "—")}${reloadSuffix(playerReloadTurns)}`;
  const pH = qs("battlePlayerHull");
  if (pH) {
    const turnMark = st.is_pvp ? (st.is_player_turn ? (state.locale === "en" ? " • Your turn" : " • Ваш ход") : "") : "";
    const dmMark = st.pvp_mode === "deathmatch"
      ? (state.locale === "en" ? ` • Kills: ${Number(st.player_kills || 0)}` : ` • Киллы: ${Number(st.player_kills || 0)}`)
      : "";
    const pPower = Number(st.player_tank_power || 0);
    pH.textContent = `🛡 ${localizedItemName(st.player_hull_name || state.profile?.hull || "—")} • ${state.locale === "en" ? "Power" : "Сила"} ${pPower}${dmMark}${turnMark}`;
  }
  const bW = qs("battleBotWeapon");
  if (bW) bW.textContent = `🔫 ${localizedItemName(st.bot_weapon_name || "—")}${reloadSuffix(botReloadTurns)}`;
  const aimState = qs("battleAimState");
  if (aimState) {
    aimState.style.display = st.aiming ? "inline-flex" : "none";
    aimState.classList.toggle("isActive", Boolean(st.aiming));
  }
  const premSrc = absUrl(state.profile?.premium_badge_url || PREMIUM_BADGE_PATH);
  const playerTitle = qs("battlePlayerTitle");
  if (playerTitle) {
    if (st.is_pvp || st.quick_mode) {
      const pName = escapeHtml(String(st.player_name || state.profile?.name || state.viewerName || trText("Игрок", "Player")));
      const pRank = String(st.player_rank_image_url || state.profile?.rank_image_url || "");
      const pStack = pRank
        ? (st.player_has_premium
          ? `<span class="battleRankPremiumCol rankPremiumStack--hasPremium"><img class="premiumBadgeLayer" src="${premSrc}" alt=""><img class="battleRankIcon" src="${absUrl(pRank)}" alt="rank"></span>`
          : `<span class="battleRankPremiumCol"><img class="battleRankIcon" src="${absUrl(pRank)}" alt="rank"></span>`)
        : "";
      playerTitle.innerHTML = `${pStack}${pName}`;
    } else {
      playerTitle.textContent = trText("ВАШ ТАНК", "YOUR TANK");
    }
  }
  const oppTitle = qs("battleOpponentTitle");
  if (oppTitle) {
    if (st.is_pvp || st.quick_mode) {
      const oName = escapeHtml(String(st.opponent_name || trText("Соперник", "Opponent")));
      const oRank = String(st.opponent_rank_image_url || "");
      const oStack = oRank
        ? (st.opponent_has_premium
          ? `<span class="battleRankPremiumCol rankPremiumStack--hasPremium"><img class="premiumBadgeLayer" src="${premSrc}" alt=""><img class="battleRankIcon" src="${absUrl(oRank)}" alt="rank"></span>`
          : `<span class="battleRankPremiumCol"><img class="battleRankIcon" src="${absUrl(oRank)}" alt="rank"></span>`)
        : "";
      oppTitle.innerHTML = `${oStack}${oName}`;
    } else {
      oppTitle.textContent = String(st.opponent_name || trText("ПРОТИВНИК", "OPPONENT"));
    }
  }
  const bH = qs("battleBotHull");
  if (bH) {
    const enemyTurn = st.is_pvp
      ? (!st.is_player_turn ? (state.locale === "en" ? " • Acting now" : " • Ходит сейчас") : "")
      : "";
    const dmEnemy = st.pvp_mode === "deathmatch"
      ? (state.locale === "en" ? ` • Kills: ${Number(st.opponent_kills || 0)}` : ` • Киллы: ${Number(st.opponent_kills || 0)}`)
      : "";
    const bPower = Number(st.bot_tank_power || 0);
    bH.textContent = `🛡 ${localizedItemName(st.bot_hull_name || "—")} • ${state.locale === "en" ? "Power" : "Сила"} ${bPower}${dmEnemy}${enemyTurn}`;
  }

  renderBattleLog(st.log || "");

  const cd = qs("battleCooldown");
  if (cd) {
    const remaining = Number(st.cooldown_remaining || 0);
    let cdText = "";
    if (remaining > 0) {
      cdText = state.locale === "en"
        ? `${tr("battle_cooldown")}: ${remaining}s`
        : `${tr("battle_cooldown")}: ${remaining}с`;
    }
    if (playerReloadTurns > 0) {
      const reloadText = state.locale === "en"
        ? `Reload: ${playerReloadTurns}`
        : `Перезарядка: ${playerReloadTurns}`;
      cdText = cdText ? `${cdText} • ${reloadText}` : reloadText;
    }
    cd.textContent = cdText;
  }
  const isOnCooldown = Number(st.cooldown_remaining || 0) > 0;
  const isReloading = playerReloadTurns > 0;
  const isLockedByTurn = Boolean(st.is_pvp) && !Boolean(st.is_player_turn) && !Boolean(st.game_over);
  const isLockedByBotThinking = Boolean(st.quick_mode) && Boolean(st.awaiting_bot_action) && !Boolean(st.game_over);
  const shootBtn = qs("battleShootBtn");
  if (shootBtn) {
    shootBtn.textContent = isReloading
      ? (state.locale === "en" ? `Reload: ${playerReloadTurns}` : `Перезарядка: ${playerReloadTurns}`)
      : trText("Огонь", "Fire");
    shootBtn.disabled = isOnCooldown || isReloading || isLockedByTurn || isLockedByBotThinking || Boolean(st.game_over);
    shootBtn.classList.toggle("isDisabled", shootBtn.disabled);
  }
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
    b.disabled = isOnCooldown || isLockedByTurn || isLockedByBotThinking || Boolean(st.game_over) || outOfBounds;
    b.classList.toggle("isDisabled", b.disabled);
  });

  // Aim button (only if player weapon supports it; backend will reject otherwise, but we hide by default)
  const aimBtn = qs("battleAimBtn");
  if (aimBtn) {
    // show aim toggle if player has Shaft (or any weapon with aiming) — simplest client heuristic:
    const hasAiming = state.profile?.weapon === "shaft";
    aimBtn.style.display = hasAiming ? "block" : "none";
    aimBtn.textContent = st.aiming
      ? trText("Сбросить прицел", "Cancel aim")
      : trText("Прицел", "Aim");
    aimBtn.disabled = Boolean(st.cooldown_remaining > 0) || isLockedByTurn || isLockedByBotThinking || Boolean(st.game_over);
    aimBtn.classList.toggle("isDisabled", aimBtn.disabled);
  }
  const moduleBtn = qs("battleModuleBtn");
  if (moduleBtn) {
    const hasModule = Boolean(st.active_module_key);
    moduleBtn.style.display = hasModule ? "block" : "none";
    moduleBtn.textContent = st.active_module_used
      ? trText("Модуль использован", "Module used")
      : (st.active_module_name || trText("Модуль", "Module"));
    moduleBtn.disabled = !hasModule || !Boolean(st.active_module_ready) || isOnCooldown || isLockedByTurn || isLockedByBotThinking || Boolean(st.game_over);
    moduleBtn.classList.toggle("isDisabled", moduleBtn.disabled);
  }
  const palBtn = qs("battlePaladinStepBtn");
  if (palBtn) {
    const hullKey = itemKeyFromAnyName(st.player_hull_name || "");
    const isPaladin = hullKey === "paladin";
    palBtn.style.display = isPaladin ? "block" : "none";
    if (!isPaladin) state.paladinDashMode = false;
    palBtn.textContent = state.paladinDashMode
      ? trText("Ход: рывок x2", "Move: dash x2")
      : trText("Ход: 1 клетка", "Move: 1 tile");
    palBtn.disabled = Boolean(st.cooldown_remaining > 0) || isLockedByTurn || isLockedByBotThinking || Boolean(st.game_over);
    palBtn.classList.toggle("isDisabled", palBtn.disabled);
  }
  const surrenderBtn = qs("battleSurrenderBtn");
  if (surrenderBtn) {
    surrenderBtn.disabled = isLockedByBotThinking || Boolean(st.game_over);
    surrenderBtn.classList.toggle("isDisabled", surrenderBtn.disabled);
  }

  state.webBattleActive = Boolean(st.active) && !Boolean(st.game_over);
  startCooldownTicker();
  if (state.webBattleActive) {
    lockMainTabs(true);
    lockBattleSearchActions(true);
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
        const suffix = state.locale === "en" ? "s" : "с";
        turn.textContent = `DM: ${Number(st.player_kills || 0)}:${Number(st.opponent_kills || 0)} • ${Math.max(0, Number(st.pvp_time_left || 0))}${suffix}`;
      } else {
        turn.textContent = "";
      }
    } else {
      const t = Number(st.turn_remaining || 0);
      turn.textContent = t > 0
        ? (state.locale === "en" ? `Turn time: ${t}s` : `Время хода: ${t}с`)
        : "";
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
    stopBattlePolling();
    // Battle is finished: hide arena immediately, keep result modal only.
    exitBattleArenaToModes();
    stopCooldownTicker();
    lockMainTabs(false);
    lockBattleSearchActions(false);
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

function closeQuickMatchModal() {
  const widget = qs("quickMatchWidget");
  state.quickMatchSearching = false;
  if (state.quickMatchHideTimer) {
    clearTimeout(state.quickMatchHideTimer);
    state.quickMatchHideTimer = null;
  }
  if (widget) {
    widget.classList.add("isHidden");
    widget.style.setProperty("display", "none", "important");
    widget.hidden = true;
    widget.setAttribute("aria-hidden", "true");
    widget.classList.remove("isOpen");
  }
  if (state.quickMatchTimer) {
    clearInterval(state.quickMatchTimer);
    state.quickMatchTimer = null;
  }
  state.quickMatchStartedAt = 0;
  state.quickMatchController = null;
  state.quickMatchHideTimer = window.setTimeout(() => {
    const lateWidget = qs("quickMatchWidget");
    if (!lateWidget) return;
    lateWidget.classList.add("isHidden");
    lateWidget.style.setProperty("display", "none", "important");
    lateWidget.hidden = true;
    lateWidget.setAttribute("aria-hidden", "true");
    state.quickMatchHideTimer = null;
  }, 180);
}

function openQuickMatchModal() {
  const widget = qs("quickMatchWidget");
  if (!widget) return;
  if (state.quickMatchHideTimer) {
    clearTimeout(state.quickMatchHideTimer);
    state.quickMatchHideTimer = null;
  }
  state.quickMatchSearching = true;
  state.quickMatchStartedAt = Date.now();
  widget.classList.remove("isHidden");
  widget.hidden = false;
  widget.setAttribute("aria-hidden", "false");
  widget.style.setProperty("display", "grid", "important");
  widget.classList.add("isOpen");
  const avg = qs("quickMatchAvg");
  const cur = qs("quickMatchCurrent");
  state.quickMatchAvgSeconds = Math.max(6, Math.min(40, Math.floor(8 + Math.random() * 19)));
  if (avg) avg.textContent = state.locale === "en" ? `${state.quickMatchAvgSeconds} s` : `${state.quickMatchAvgSeconds} с`;
  if (cur) cur.textContent = state.locale === "en" ? "00 s" : "00 с";
  if (state.quickMatchTimer) clearInterval(state.quickMatchTimer);
  state.quickMatchTimer = setInterval(() => {
    const elapsed = Math.max(0, Math.floor((Date.now() - Number(state.quickMatchStartedAt || Date.now())) / 1000));
    const val = String(elapsed).padStart(2, "0");
    if (cur) cur.textContent = state.locale === "en" ? `${val} s` : `${val} с`;
  }, 1000);
}

async function battleStartQuick(options = {}) {
  const st = await api("/api/battle/quick/start", { method: "POST", ...(options || {}) });
  await showTab("battles", { force: true });
  renderBattleState(st);
}

async function battleCancelQuickSearch() {
  try {
    await api("/api/battle/quick/cancel", { method: "POST" });
  } catch {}
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
  document.addEventListener("selectstart", (e) => e.preventDefault());
  document.addEventListener("copy", (e) => e.preventDefault());
  document.addEventListener("cut", (e) => e.preventDefault());
  document.addEventListener("contextmenu", (e) => e.preventDefault());
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
      showToast(trText("Награда за квест получена.", "Quest reward claimed."), { title: trText("КВЕСТЫ", "QUESTS"), ms: 2200 });
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
      // Save locale (separate endpoint) so it persists in profile + affects whole UI.
      const nextLoc = String(qs("setLocale")?.value || state.locale || "en").toLowerCase();
      if (nextLoc === "ru" || nextLoc === "en") {
        await api("/api/profile/locale", { method: "POST", body: JSON.stringify({ locale: nextLoc }) });
        state.locale = nextLoc;
        applyStaticI18n();
      }
      renderSettings();
      showToast(trText("Настройки сохранены.", "Settings saved."), { title: trText("НАСТРОЙКИ", "SETTINGS"), ms: 2200 });
    } catch (e) {
      showToast(prettyError(e), { title: trText("ОШИБКА", "ERROR"), ms: 2600 });
    }
  }
  async function saveSettingsChat() {
    const payload = {
      chat_visibility: String(qs("setChatVisibility")?.value || "on"),
    };
    try {
      state.settings = await api("/api/settings", { method: "POST", body: JSON.stringify(payload) });
      renderSettings();
      showToast(trText("Настройки сохранены.", "Settings saved."), { title: trText("НАСТРОЙКИ", "SETTINGS"), ms: 2200 });
    } catch (e) {
      showToast(prettyError(e), { title: trText("ОШИБКА", "ERROR"), ms: 2600 });
    }
  }
  qs("settingsSaveBtn")?.addEventListener("click", saveSettingsPrivacy);
  qs("settingsSaveBtn2")?.addEventListener("click", saveSettingsChat);
  qs("copyRefBtn")?.addEventListener("click", async () => {
    const raw = String(qs("refLinkInput")?.value || "").trim();
    if (!raw) return;
    try {
      await navigator.clipboard.writeText(raw);
      showToast(tr("ref_copy_ok"));
    } catch (_) {
      try {
        const inp = qs("refLinkInput");
        inp?.focus();
        inp?.select();
        document.execCommand("copy");
        showToast(tr("ref_copy_ok"));
      } catch (_) {}
    }
  });

  // PvP lobby UI (create / list / join)
  qs("createLobbyBtn")?.addEventListener("click", () => {
    if (state.webBattleActive || state.quickMatchController) return;
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
        title: trText("БОЙ СОЗДАН", "BATTLE CREATED"),
        label: trText("Ждем соперника (3 минуты).", "Waiting for an opponent (3 minutes)."),
        icon: "⚔",
        name: trText("Открытый бой", "Open battle"),
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
    if (state.quickMatchController) return;
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
    if (state.quickMatchController) return;
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
      title: trText("ЖАЛОБА", "REPORT"),
      label: trText("Отправить жалобу на это сообщение?", "Send a report for this message?"),
      icon: "⚑",
      name: state.locale === "en" ? `Message #${msgId}` : `Сообщение #${msgId}`,
      meta: scope === "battle" ? trText("Чат боя", "Battle chat") : trText("Общий чат", "Global chat"),
      onOk: async () => {
        hideConfirmModal();
        try {
          await api("/api/chat/report", {
            method: "POST",
            body: JSON.stringify({ scope, message_id: msgId, battle_id: battleId || null }),
          });
          showToast(trText("Жалоба отправлена администраторам.", "Report sent to admins."), { title: trText("ЖАЛОБА", "REPORT"), ms: 2200 });
        } catch (err) {
          setError(prettyError(err));
        }
      },
    });
  };
  qs("globalChatList")?.addEventListener("click", onReportClick);
  qs("battleChatList")?.addEventListener("click", onReportClick);

  qs("confirmCancelBtn")?.addEventListener("click", hideConfirmModal);
  qs("confirmCloseTopBtn")?.addEventListener("click", hideConfirmModal);
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
  qs("microUpgradeBtn")?.addEventListener("click", openMicroUpgradeModal);
  qs("microCloseTopBtn")?.addEventListener("click", closeMicroUpgradeModal);
  qs("microModal")?.addEventListener("click", (e) => { if (e.target === qs("microModal")) closeMicroUpgradeModal(); });
  qs("microUpgradeList")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-micro-buy]");
    if (!btn) return;
    await buyMicroUpgrade(btn.getAttribute("data-micro-buy"), btn);
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
    if (state.garageCategory === "modules") {
      const mod = moduleByKey(key);
      if (!mod) return;
      try {
        if (!mod.owned) {
          setModulesPayload(await api("/api/modules/buy", { method: "POST", body: JSON.stringify({ module_key: key }) }));
          await playPurchaseSound();
          showToast(itemName(key), { title: trText("МОДУЛЬ КУПЛЕН", "MODULE PURCHASED"), ms: 2400, sound: false });
        } else {
          setModulesPayload(await api("/api/modules/equip", { method: "POST", body: JSON.stringify({ slot: mod.slot, module_key: key }) }));
        }
        state.profile = await api("/api/profile/me");
        renderHud();
        renderGarage();
        clearError();
      } catch (e) {
        qs("garageHint").textContent = `${trText("Ошибка", "Error")}: ${prettyError(e)}`;
        setError(prettyError(e));
      }
      return;
    }
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
      const kind = state.containerKind === "premium" ? "premium" : "standard";
      const result = await api(`/api/containers/open?kind=${encodeURIComponent(kind)}`, { method: "POST" });
      await showRewardModal(result);
      const [profile, containersInfo] = await Promise.all([
        api("/api/profile/me"),
        api("/api/containers"),
      ]);
      state.profile = profile;
      state.containersInfo = containersInfo;
      syncLootChancesFromApi(containersInfo);
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

  // Container kind tabs (standard / premium)
  qs("containerKindTabs")?.addEventListener("click", (e) => {
    const b = e.target.closest(".subTab");
    if (!b) return;
    const kind = String(b.dataset.kind || "standard");
    state.containerKind = kind === "premium" ? "premium" : "standard";
    qs("containerKindTabs")?.querySelectorAll(".subTab")
      .forEach((it) => it.classList.toggle("isActive", it.dataset.kind === state.containerKind));
    renderContainers();
  });

  // Buy premium container with Stars
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-stars-buy='premium_container']");
    if (!btn) return;
    btn.disabled = true;
    try {
      const paid = await starsBuy("premium_container");
      if (!paid) return;
      showPurchaseLikeModal({
        title: trText("ПОКУПКА ПРОИЗВЕДЕНА УСПЕШНО", "PURCHASE SUCCESSFUL"),
        label: trText("Вы приобрели:", "You purchased:"),
        icon: "⭐",
        name: trText("Премиум контейнер", "Premium container"),
        price: "49 ⭐",
      });
      void playPurchaseSound();
      clearError();
    } catch (err) {
      setError(prettyError(err));
    } finally {
      btn.disabled = false;
    }
  });

  qs("battleBotModeCard")?.addEventListener("click", () => {
    if (state.quickMatchController) return;
    const modes = qs("battleModesGrid");
    const botCard = qs("battleBotCard");
    const pvpCard = qs("battlePlayerCard");
    const arena = qs("battleArena");
    if (modes) modes.style.display = "none";
    if (arena) arena.style.display = "none";
    if (pvpCard) pvpCard.style.display = "none";
    if (botCard) botCard.style.display = "flex";
    // Hide quick battle header/CTA while inside a mode card.
    const quickWrap = qs("quickBattleBtn")?.closest(".battleLobbyCreateWrap");
    if (quickWrap) quickWrap.style.display = "none";
    document.querySelectorAll(".battleSectionTitle").forEach((el) => { el.style.display = "none"; });
    renderLobbies();
  });

  const startQuickBattleFlow = async () => {
    if (state.quickMatchController) return;
    const controller = new AbortController();
    state.quickMatchController = controller;
    lockMainTabs(true);
    lockBattleSearchActions(true);
    if (state.activeTab !== "battles") {
      await showTab("battles", { force: true });
    }
    openQuickMatchModal();
    try {
      await battleStartQuick({ signal: controller.signal });
      clearError();
    } catch (e) {
      if (String(e?.name || "") !== "AbortError") {
        setError(prettyError(e));
      }
    } finally {
      closeQuickMatchModal();
      lockMainTabs(Boolean(state.webBattleActive));
      lockBattleSearchActions(Boolean(state.webBattleActive));
      renderLobbies();
    }
  };
  qs("quickBattleBtn")?.addEventListener("click", startQuickBattleFlow);
  qs("profileQuickBattleBtn")?.addEventListener("click", startQuickBattleFlow);
  qs("quickMatchCancelBtn")?.addEventListener("click", async () => {
    const controller = state.quickMatchController;
    lockMainTabs(false);
    lockBattleSearchActions(false);
    closeQuickMatchModal();
    try { controller?.abort(); } catch {}
    await battleCancelQuickSearch();
    renderLobbies();
  });
  // Quick match is a top-right widget now (not a modal overlay).

  qs("battlePlayerModeCard")?.addEventListener("click", () => {
    if (state.quickMatchController) return;
    const modes = qs("battleModesGrid");
    const botCard = qs("battleBotCard");
    const pvpCard = qs("battlePlayerCard");
    const arena = qs("battleArena");
    if (modes) modes.style.display = "none";
    if (arena) arena.style.display = "none";
    if (botCard) botCard.style.display = "none";
    if (pvpCard) pvpCard.style.display = "flex";
    const quickWrap = qs("quickBattleBtn")?.closest(".battleLobbyCreateWrap");
    if (quickWrap) quickWrap.style.display = "none";
    document.querySelectorAll(".battleSectionTitle").forEach((el) => { el.style.display = "none"; });
    renderLobbies();
  });

  qs("backToModesBtn")?.addEventListener("click", () => {
    if (state.quickMatchController) return;
    const modes = qs("battleModesGrid");
    const botCard = qs("battleBotCard");
    const pvpCard = qs("battlePlayerCard");
    const arena = qs("battleArena");
    if (botCard) botCard.style.display = "none";
    if (pvpCard) pvpCard.style.display = "none";
    if (arena) arena.style.display = "none";
    if (modes) modes.style.display = "grid";
    const quickWrap = qs("quickBattleBtn")?.closest(".battleLobbyCreateWrap");
    if (quickWrap) quickWrap.style.display = "flex";
    document.querySelectorAll(".battleSectionTitle").forEach((el) => { el.style.display = ""; });
    renderLobbies();
  });
  qs("backToModesFromPvpBtn")?.addEventListener("click", () => {
    if (state.quickMatchController) return;
    const modes = qs("battleModesGrid");
    const botCard = qs("battleBotCard");
    const pvpCard = qs("battlePlayerCard");
    const arena = qs("battleArena");
    if (botCard) botCard.style.display = "none";
    if (pvpCard) pvpCard.style.display = "none";
    if (arena) arena.style.display = "none";
    if (modes) modes.style.display = "grid";
    const quickWrap = qs("quickBattleBtn")?.closest(".battleLobbyCreateWrap");
    if (quickWrap) quickWrap.style.display = "flex";
    document.querySelectorAll(".battleSectionTitle").forEach((el) => { el.style.display = ""; });
    renderLobbies();
  });

  qs("startBotBattleBtn")?.addEventListener("click", async () => {
    if (state.quickMatchController) return;
    try {
      await battleStartBot();
      clearError();
    } catch (e) {
      setError(prettyError(e));
    }
  });

  qs("sendPvpInviteBtn")?.addEventListener("click", async () => {
    if (state.quickMatchController) return;
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
  qs("battleModuleBtn")?.addEventListener("click", async () => {
    try { await battleSendAction("module"); } catch (e) { setError(prettyError(e)); }
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
  if (document.readyState === "loading") {
    await new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve, { once: true }));
  }
  state.locale = state.locale || "en";
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
