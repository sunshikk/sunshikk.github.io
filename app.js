/* global Telegram */

const state = {
  token: null,
  profile: null,
  shop: null,
  shopCategory: "weapon",
  activeTab: "profile",
  tabRefreshInFlight: false,
  containerOpened: false,
  containerModalOpen: false,
  containerOpenedImageUrl: null,
  music: {
    enabled: true,
    volume: 0.4,
    unlocked: false,
    currentKey: null,
    a: null,
    b: null,
    active: "a",
    fadeMs: 900,
  },
  weapons: [
    { key: "smoky", name: "Смоки" },
    { key: "railgun", name: "Рельса" },
    { key: "shaft", name: "Шафт" },
    { key: "thunder", name: "Гром" },
  ],
  hulls: [
    { key: "hunter", name: "Хантер" },
    { key: "titan", name: "Титан" },
  ],
};

function qs(id) {
  return document.getElementById(id);
}

function loadMusicPrefs() {
  try {
    const enabled = localStorage.getItem("music_enabled");
    const vol = localStorage.getItem("music_volume");
    if (enabled !== null) state.music.enabled = enabled === "1";
    if (vol !== null) {
      const v = Number(vol);
      if (!Number.isNaN(v)) state.music.volume = Math.max(0, Math.min(1, v));
    }
  } catch {
    // ignore
  }
}

function saveMusicPrefs() {
  try {
    localStorage.setItem("music_enabled", state.music.enabled ? "1" : "0");
    localStorage.setItem("music_volume", String(state.music.volume));
  } catch {
    // ignore
  }
}

function tabToMusicKey(tab) {
  if (tab === "garage") return "garage";
  if (tab === "shop") return "shop";
  // profile + containers
  return "profile";
}

function musicUrlForKey(key) {
  if (key === "garage") return "/sounds/music/garage_music.mp3";
  if (key === "shop") return "/sounds/music/shop_music.mp3";
  return "/sounds/music/profile_music.mp3";
}

function ensureMusicPlayers() {
  if (state.music.a && state.music.b) return;
  const mk = () => {
    const au = new Audio();
    // Keep loop, but also handle "ended" as a failsafe for some WebViews.
    au.loop = true;
    // Smarter: don't preload unless we actually need it
    au.preload = "none";
    au.volume = 0;
    au.addEventListener("ended", () => {
      // Some WebViews ignore loop after src changes; restart quickly.
      window.setTimeout(() => {
        try {
          au.currentTime = 0;
          const p = au.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        } catch {
          // ignore
        }
      }, 120);
    });
    return au;
  };
  state.music.a = mk();
  state.music.b = mk();
}

function setMusicUi() {
  const t = qs("musicToggle");
  const v = qs("musicVolume");
  if (t) t.textContent = state.music.enabled ? "Музыка: Вкл" : "Музыка: Выкл";
  if (v) v.value = String(Math.round(state.music.volume * 100));
}

async function unlockMusicOnce() {
  if (state.music.unlocked) return true;
  ensureMusicPlayers();
  // try to play/pause silently to satisfy autoplay policies
  const au = state.music.a;
  try {
    au.muted = true;
    au.volume = 0;
    // Some webviews only allow autoplay when muted.
    await au.play();
    au.pause();
    au.muted = false;
    state.music.unlocked = true;
    return true;
  } catch {
    return false;
  }
}

function stopAllMusic() {
  for (const au of [state.music.a, state.music.b]) {
    if (!au) continue;
    try {
      au.pause();
      au.currentTime = 0;
      au.volume = 0;
    } catch {
      // ignore
    }
  }
}

function crossfade(fromAu, toAu, targetVol, ms) {
  const start = performance.now();
  const from0 = fromAu ? fromAu.volume : 0;
  const to0 = toAu.volume;

  const tick = (now) => {
    const t = Math.min(1, (now - start) / ms);
    // ease in-out
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    if (fromAu) fromAu.volume = from0 * (1 - e);
    toAu.volume = to0 + (targetVol - to0) * e;
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      if (fromAu) {
        try {
          fromAu.pause();
        } catch {
          // ignore
        }
      }
    }
  };
  requestAnimationFrame(tick);
}

function rampVolume(au, to, ms) {
  if (!au) return;
  const from = au.volume;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / ms);
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    au.volume = from + (to - from) * e;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function fadeOutAndPauseAll(ms = 600) {
  for (const au of [state.music.a, state.music.b]) {
    if (!au) continue;
    const wasPlaying = !au.paused;
    rampVolume(au, 0, ms);
    if (wasPlaying) {
      window.setTimeout(() => {
        try {
          au.pause();
        } catch {
          // ignore
        }
      }, ms + 30);
    }
  }
}

function attachAudioDebug(au, label) {
  if (!au || au.__dbgAttached) return;
  au.__dbgAttached = true;
  au.addEventListener("error", () => {
    // Try to surface the reason in UI (Telegram WebView hides console).
    setError(`Музыка не запускается (${label}). Проверьте, что файл доступен и формат поддерживается.`);
  });
}

function _playWithDiag(au, label, contextText) {
  attachAudioDebug(au, label);
  try {
    const p = au.play();
    if (p && typeof p.then === "function") {
      p.catch((err) => {
        const msg = err && err.message ? String(err.message) : String(err || "");
        setError(`${contextText}\n\nПричина: ${msg || "WebView заблокировал воспроизведение."}`);
      });
    }
    return p;
  } catch (err) {
    const msg = err && err.message ? String(err.message) : String(err || "");
    setError(`${contextText}\n\nПричина: ${msg || "WebView заблокировал воспроизведение."}`);
    return null;
  }
}

function setMusicForTabGesture(tab) {
  // Call only from a direct user gesture (tap/click).
  const key = tabToMusicKey(tab);
  state.music.currentKey = key;
  if (!state.music.enabled) {
    stopAllMusic();
    return;
  }
  ensureMusicPlayers();
  const nextUrl = musicUrlForKey(key);

  const activeAu = state.music.active === "a" ? state.music.a : state.music.b;
  const idleAu = state.music.active === "a" ? state.music.b : state.music.a;

  // If nothing ever started, start on active player immediately.
  const anyPlaying = (state.music.a && !state.music.a.paused) || (state.music.b && !state.music.b.paused);
  if (!anyPlaying) {
    activeAu.src = nextUrl;
    activeAu.currentTime = 0;
    activeAu.loop = true;
    // Prevent "burst" on first start: start muted, set final volume, then unmute.
    activeAu.muted = true;
    activeAu.volume = state.music.volume;
    const p = _playWithDiag(
      activeAu,
      "active",
      "Музыка не запускается. В Telegram WebApp звук разрешён только после явного тапа по кнопке/экрану.",
    );
    state.music.unlocked = true;
    clearError();
    if (p && typeof p.then === "function") {
      p.then(() => {
        activeAu.muted = false;
      }).catch(() => {});
    } else {
      // Best-effort fallback
      window.setTimeout(() => {
        activeAu.muted = false;
      }, 0);
    }
    return;
  }

  // If already playing same track, just ensure volume
  if (activeAu.src && activeAu.src.includes(nextUrl)) {
    // Smooth adjust volume if needed
    rampVolume(activeAu, state.music.volume, 250);
    // If webview paused it silently, try to resume on gesture.
    _playWithDiag(activeAu, "active", "Не удалось продолжить воспроизведение музыки.");
    return;
  }

  // Avoid unnecessary reload
  if (!idleAu.src || !idleAu.src.includes(nextUrl)) {
    idleAu.src = nextUrl;
  }
  idleAu.currentTime = 0;
  idleAu.volume = 0;
  idleAu.loop = true;
  idleAu.muted = false;
  const playP = _playWithDiag(idleAu, "idle", "Не удалось переключить музыку.");

  // Swap active only after playback actually begins.
  const doSwapAndFade = () => {
    state.music.active = state.music.active === "a" ? "b" : "a";
    crossfade(activeAu, idleAu, state.music.volume, state.music.fadeMs);
  };
  if (playP && typeof playP.then === "function") {
    playP.then(doSwapAndFade).catch(() => {
      // keep previous active if new track didn't start
    });
  } else {
    window.setTimeout(doSwapAndFade, 80);
  }
}

async function setMusicForTab(tab) {
  // Non-gesture attempt (may be blocked). Used on init.
  const ok = await unlockMusicOnce();
  if (!ok) return;
  setMusicForTabGesture(tab);
}

function clearError() {
  const panel = qs("panelNotice");
  const el = qs("notice");
  if (el) el.textContent = "";
  if (panel) panel.style.display = "none";
}

function setError(text) {
  const panel = qs("panelNotice");
  const el = qs("notice");
  if (el) el.textContent = text;
  if (panel) panel.style.display = "block";
}

function humanizeApiDetail(detail, status) {
  const d = String(detail || "").trim().toLowerCase();

  // Auth / permissions
  if (status === 401) return "Сессия истекла. Откройте WebApp заново из кнопки бота.";
  if (status === 403) return "Недостаточно прав для этого действия.";

  // Containers
  if (d === "no containers") return "У вас нет контейнеров.";
  if (d === "failed to use container") return "Не удалось открыть контейнер. Попробуйте ещё раз.";

  // Garage
  if (d === "unknown weapon") return "Неизвестная пушка.";
  if (d === "unknown hull") return "Неизвестный корпус.";
  if (d === "weapon locked") return "Эта пушка ещё не разблокирована.";
  if (d === "hull locked") return "Этот корпус ещё не разблокирован.";

  // Shop
  if (d === "unknown item") return "Товар не найден.";
  if (d === "not enough crystals") return "Недостаточно кристаллов для покупки.";
  if (d === "already owned") return "Этот предмет уже куплен.";

  // Generic numeric status fallback
  if (d && d !== String(status)) return detail;
  return `Произошла ошибка (код ${status}).`;
}

function prettyError(e) {
  // Network / browser errors (fetch)
  if (e instanceof TypeError) {
    return "Нет соединения или сервер недоступен. Проверьте интернет и попробуйте ещё раз.";
  }
  const msg = (e && e.message ? String(e.message) : "").trim();
  return msg || "Произошла неизвестная ошибка.";
}

async function api(path, options = {}) {
  const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(path, Object.assign({}, options, { headers }));
  if (!res.ok) {
    let msg = `${res.status}`;
    try {
      const j = await res.json();
      msg = j.detail || msg;
    } catch {
      // ignore
    }
    throw new Error(humanizeApiDetail(msg, res.status));
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await res.json();
  return await res.text();
}

function renderTopPills() {
  qs("pillCrystals").textContent = `${state.profile?.crystals ?? 0}💎`;
  qs("pillContainers").textContent = `${state.profile?.containers ?? 0}📦`;
}

function renderProfile() {
  const p = state.profile;
  if (!p) return;
  qs("rankName").textContent = p.rank.name;
  const rankImg = qs("rankImg");
  rankImg.src = p.rank_image_url ? withCacheBust(absUrl(p.rank_image_url)) : "";
  rankImg.style.visibility = p.rank_image_url ? "visible" : "hidden";

  const tankImg = qs("tankImg");
  tankImg.src = p.tank_image_url ? withCacheBust(absUrl(p.tank_image_url)) : "";
  tankImg.style.visibility = p.tank_image_url ? "visible" : "hidden";

  const req = p.rank?.exp_required;
  qs("expValue").textContent = typeof req === "number" ? `${p.experience} / ${req}` : `${p.experience}`;
  qs("battlesValue").textContent = `${p.battles}`;
  qs("wlValue").textContent = `${p.wins} / ${p.losses}`;

  const gImg = qs("garageTankImg");
  if (gImg) {
    gImg.src = p.tank_image_url ? withCacheBust(absUrl(p.tank_image_url)) : "";
    gImg.style.visibility = p.tank_image_url ? "visible" : "hidden";
    gImg.classList.toggle("imgBlendWide", true);
  }
}

function fillGarageSelects() {
  const wSel = qs("weaponSelect");
  const hSel = qs("hullSelect");
  wSel.innerHTML = "";
  hSel.innerHTML = "";

  const unlocks = state.profile?.unlocks || {};

  for (const w of state.weapons) {
    const opt = document.createElement("option");
    opt.value = w.key;
    const locked = w.key !== "smoky" && !unlocks[w.key];
    opt.textContent = locked ? `${w.name} (🔒)` : w.name;
    opt.disabled = locked;
    wSel.appendChild(opt);
  }

  for (const h of state.hulls) {
    const opt = document.createElement("option");
    opt.value = h.key;
    const locked = h.key !== "hunter" && !unlocks[h.key];
    opt.textContent = locked ? `${h.name} (🔒)` : h.name;
    opt.disabled = locked;
    hSel.appendChild(opt);
  }

  if (state.profile?.weapon) wSel.value = state.profile.weapon;
  if (state.profile?.hull) hSel.value = state.profile.hull;
}

function renderShop() {
  const list = qs("shopList");
  list.innerHTML = "";
  if (!state.shop) return;

  const items = state.shop.items.filter((i) => {
    if (i.category === "weapon" || i.category === "hull") {
      return i.category === state.shopCategory;
    }
    if (state.shopCategory === "weapon") {
      return ["railgun", "shaft", "thunder"].includes(i.key);
    }
    if (state.shopCategory === "hull") {
      return i.key === "titan";
    }
    return false;
  });

  const renderItem = (item) => {
    const row = document.createElement("div");
    row.className = "shopItem";

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.gap = "12px";
    left.style.alignItems = "center";

    if (item.image_url) {
      const img = document.createElement("img");
      img.src = withCacheBust(absUrl(item.image_url));
      img.alt = item.name;
      img.className = "shopItemImg imgBlend";
      left.appendChild(img);
    }

    const textBox = document.createElement("div");
    const title = document.createElement("div");
    title.className = "shopItemTitle";
    title.textContent = item.name;
    const meta = document.createElement("div");
    meta.className = "shopItemMeta";
    meta.textContent = `Цена: ${item.price}💎`;
    textBox.appendChild(title);
    textBox.appendChild(meta);
    left.appendChild(textBox);

    const right = document.createElement("div");
    right.className = "shopItemRight";

    if (item.owned) {
      const owned = document.createElement("div");
      owned.className = "owned";
      owned.textContent = "Куплено";
      right.appendChild(owned);
    } else {
      const buy = document.createElement("button");
      buy.className = "btnGhost";
      buy.textContent = "Купить";
      buy.onclick = async () => {
        buy.disabled = true;
        try {
          await api("/api/shop/buy", { method: "POST", body: JSON.stringify({ item: item.key }) });
          await refreshAll();
          clearError();
        } catch (e) {
          setError(`Не удалось купить: ${prettyError(e)}`);
        } finally {
          buy.disabled = false;
        }
      };
      right.appendChild(buy);
    }

    row.appendChild(left);
    row.appendChild(right);
    list.appendChild(row);
  };

  for (const item of items) renderItem(item);
}

function showTab(tab) {
  for (const btn of document.querySelectorAll(".tab")) {
    btn.classList.toggle("isActive", btn.dataset.tab === tab);
  }
  const map = {
    profile: "panelProfile",
    garage: "panelGarage",
    containers: "panelContainers",
    shop: "panelShop",
  };
  for (const [k, id] of Object.entries(map)) {
    const el = qs(id);
    const isActive = k === tab;
    el.style.display = isActive ? "block" : "none";
    if (isActive) {
      el.classList.remove("fadeIn");
      // restart animation
      void el.offsetWidth;
      el.classList.add("fadeIn");
    }
  }
}

function clearTransientUI(tab) {
  // Сбрасываем "залипающие" подсказки/результаты при переключении вкладок.
  if (tab === "garage") {
    const gh = qs("garageHint");
    if (gh) gh.textContent = "";
  }
  if (tab === "containers") {
    const cr = qs("containerResult");
    if (cr) cr.textContent = "";
  }
}

async function refreshOnTabSwitch() {
  if (state.tabRefreshInFlight) return;
  state.tabRefreshInFlight = true;
  try {
    await refreshAll();
    clearError();
  } catch (e) {
    setError(prettyError(e));
  } finally {
    state.tabRefreshInFlight = false;
  }
}

async function refreshAll() {
  state.profile = await api("/api/profile/me");
  state.containersInfo = await api("/api/containers");
  state.shop = await api("/api/shop/items");
  renderTopPills();
  renderProfile();
  fillGarageSelects();
  renderShop();
  renderContainers();
}

function absUrl(path) {
  try {
    return new URL(path, window.location.origin).toString();
  } catch {
    return path;
  }
}

function withCacheBust(url) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${Date.now()}`;
}

function renderContainers() {
  const info = state.containersInfo;
  const img = qs("containerImg");
  if (!img) return;
  if (!info?.container_image_url) {
    img.style.visibility = "hidden";
    return;
  }
  // Main menu: always show CLOSED container
  img.src = withCacheBust(absUrl(info.container_image_url));
  img.classList.toggle("isOpened", false);
  img.style.visibility = "visible";
}

function openContainerModal() {
  const modal = qs("containerModal");
  const closeBtn = qs("containerModalClose");
  const backdrop = qs("containerModalBackdrop");
  if (!modal) return;
  state.containerModalOpen = true;
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  if (closeBtn) closeBtn.disabled = true;
  if (backdrop) backdrop.style.pointerEvents = "none";
}

function closeContainerModal() {
  const modal = qs("containerModal");
  const text = qs("containerModalText");
  const img = qs("containerModalImg");
  const drop = qs("containerDropImg");
  if (!modal) return;
  state.containerModalOpen = false;
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  if (text) text.textContent = "";
  if (img) {
    img.classList.remove("isOpening", "glowCommon", "glowRare", "glowEpic", "glowUltra", "glowLegendary");
    img.classList.remove("revealEnter");
    img.src = "";
  }
  if (drop) {
    drop.classList.remove("dropRare", "dropEpic", "dropUltra", "dropLegendary");
    drop.classList.remove("revealEnter");
    drop.src = "";
  }
}

function containerOpenVariant(r) {
  // New rarity mapping + specific contopen_* image
  // crystals -> rare (turquoise) / contopen_rare
  // titan + thunder -> epic (purple) / contopen_epic
  // shaft -> ultrarare (red) / contopen_ultrarare
  // railgun -> legendary (yellow) / contopen_legendary
  if (!r) return { glow: "glowCommon", image: "/images/webapp/contopen_rare.png" };

  if (r.reward_type === "unlock") {
    if (r.reward_key === "railgun") return { glow: "glowLegendary", image: "/images/webapp/contopen_legendary.png" };
    if (r.reward_key === "shaft") return { glow: "glowUltra", image: "/images/webapp/contopen_ultrarare.png" };
    if (r.reward_key === "thunder") return { glow: "glowEpic", image: "/images/webapp/contopen_epic.png" };
    if (r.reward_key === "titan") return { glow: "glowEpic", image: "/images/webapp/contopen_epic.png" };
    return { glow: "glowRare", image: "/images/webapp/contopen_rare.png" };
  }

  // crystals
  return { glow: "glowRare", image: "/images/webapp/contopen_rare.png" };
}

function containerDropVariant(r) {
  if (!r) return { image: "/images/webapp/crystals.png", glow: "dropRare", text: "" };
  if (r.reward_type === "unlock") {
    const key = r.reward_key || "";
    if (key === "railgun") return { image: "/images/webapp/railgun.png", glow: "dropLegendary", text: "Рельса" };
    if (key === "shaft") return { image: "/images/webapp/shaft.png", glow: "dropUltra", text: "Шафт" };
    if (key === "thunder") return { image: "/images/webapp/thunder.png", glow: "dropEpic", text: "Гром" };
    if (key === "titan") return { image: "/images/webapp/titan.png", glow: "dropEpic", text: "Титан" };
    return { image: "/images/webapp/crystals.png", glow: "dropRare", text: "" };
  }
  // crystals
  return { image: "/images/webapp/crystals.png", glow: "dropRare", text: "" };
}

function revealDropImage(dImg, src) {
  // Make sure we actually see the fade+slide even in WebView.
  dImg.style.opacity = "0";
  dImg.classList.remove("revealEnter");
  // Force reflow
  void dImg.offsetWidth;

  dImg.onload = () => {
    // Run on next frame so layout is committed.
    requestAnimationFrame(() => {
      dImg.classList.add("revealEnter");
    });
  };
  dImg.src = src;
}

async function initAuth() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    setError("Откройте это через Telegram WebApp (Mini App).");
    return false;
  }
  tg.ready();
  tg.expand();

  if (!tg.initData) {
    setError("initData не получен. Откройте WebApp из кнопки бота.");
    return false;
  }

  const res = await api("/api/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ initData: tg.initData }),
    headers: {},
  });
  state.token = res.token;
  return true;
}

function bindUI() {
  // Music controls
  loadMusicPrefs();
  setMusicUi();

  const musicToggle = qs("musicToggle");
  const musicVol = qs("musicVolume");
  if (musicToggle) {
    musicToggle.onclick = () => {
      state.music.enabled = !state.music.enabled;
      saveMusicPrefs();
      setMusicUi();
      if (!state.music.enabled) {
        // Smooth fade out
        fadeOutAndPauseAll(650);
      } else {
        // IMPORTANT: do not await here; keep play() within user gesture stack.
        setMusicForTabGesture(state.activeTab);
        // Smooth fade in to target on the active player
        const activeAu = state.music.active === "a" ? state.music.a : state.music.b;
        if (activeAu) rampVolume(activeAu, state.music.volume, 650);
      }
    };
  }
  if (musicVol) {
    musicVol.oninput = () => {
      const v = Math.max(0, Math.min(100, Number(musicVol.value)));
      state.music.volume = v / 100;
      saveMusicPrefs();
      const activeAu = state.music.active === "a" ? state.music.a : state.music.b;
      if (activeAu && !activeAu.paused && state.music.enabled) {
        // Smooth volume change
        rampVolume(activeAu, state.music.volume, 250);
      }
    };
  }

  // Try to unlock audio on first user gesture anywhere
  const unlockHandler = () => {
    // IMPORTANT: do not await here; keep play() within user gesture stack.
    setMusicForTabGesture(state.activeTab);
  };
  document.addEventListener("pointerdown", unlockHandler, { capture: true, once: true });

  document.getElementById("tabs").addEventListener("click", async (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    const nextTab = btn.dataset.tab;
    if (!nextTab || nextTab === state.activeTab) return;

    state.activeTab = nextTab;
    showTab(nextTab);
    clearTransientUI(nextTab);
    // Keep play() as close to user gesture as possible (no await).
    setMusicForTabGesture(nextTab);
    await refreshOnTabSwitch();
  });

  // Container modal controls
  const cmClose = qs("containerModalClose");
  const cmBackdrop = qs("containerModalBackdrop");
  if (cmClose) cmClose.onclick = () => closeContainerModal();
  if (cmBackdrop) cmBackdrop.onclick = () => closeContainerModal();

  const shopCategory = document.getElementById("shopCategory");
  if (shopCategory) {
    shopCategory.addEventListener("click", (e) => {
      const btn = e.target.closest(".segBtn");
      if (!btn) return;
      state.shopCategory = btn.dataset.cat;
      for (const b of shopCategory.querySelectorAll(".segBtn")) {
        b.classList.toggle("isActive", b.dataset.cat === state.shopCategory);
      }
      renderShop();
    });
  }

  qs("saveTankBtn").onclick = async () => {
    const weapon = qs("weaponSelect").value;
    const hull = qs("hullSelect").value;
    qs("garageHint").textContent = "";
    try {
      await api("/api/garage/set_tank", { method: "POST", body: JSON.stringify({ weapon, hull }) });
      await refreshAll();
      qs("garageHint").textContent = "Сохранено.";
      clearError();
    } catch (e) {
      const m = prettyError(e);
      qs("garageHint").textContent = `Ошибка: ${m}`;
      setError(m);
    }
  };

  qs("openContainerBtn").onclick = async () => {
    if (state.containerModalOpen) return;
    const btn = qs("openContainerBtn");
    if (btn) btn.disabled = true;

    openContainerModal();
    const mImg = qs("containerModalImg");
    const mText = qs("containerModalText");
    const dImg = qs("containerDropImg");
    const closeBtn = qs("containerModalClose");
    const backdrop = qs("containerModalBackdrop");
    if (mText) mText.textContent = "Открываем контейнер…";
    if (mImg && state.containersInfo?.container_image_url) {
      mImg.src = withCacheBust(absUrl(state.containersInfo.container_image_url));
      mImg.classList.remove("glowCommon", "glowRare", "glowEpic", "glowUltra", "glowLegendary");
      // restart animation
      mImg.classList.remove("isOpening");
      void mImg.offsetWidth;
      mImg.classList.add("isOpening");
    }
    if (dImg) {
      dImg.classList.remove("dropRare", "dropEpic", "dropUltra", "dropLegendary");
      dImg.classList.remove("revealEnter");
      dImg.style.opacity = "0";
      dImg.src = "";
    }
    try {
      const r = await api("/api/containers/open", { method: "POST" });
      await refreshAll();
      // Main window: no animation and no "what you got" text.
      // We keep a simple opened container image state only.
      state.containerOpened = false;
      state.containerOpenedImageUrl = null;

      // Update modal: opened image + rarity glow + reward text
      if (mImg) {
        const v = containerOpenVariant(r);
        mImg.classList.remove("glowCommon", "glowRare", "glowEpic", "glowUltra", "glowLegendary");
        mImg.classList.add(v.glow);
        mImg.src = withCacheBust(absUrl(v.image));
        // stop opening animation so reveal is visible
        mImg.classList.remove("isOpening");
        // smooth reveal
        mImg.classList.remove("revealEnter");
        void mImg.offsetWidth;
        mImg.classList.add("revealEnter");
      }
      if (dImg) {
        const dv = containerDropVariant(r);
        dImg.classList.remove("dropRare", "dropEpic", "dropUltra", "dropLegendary");
        dImg.classList.add(dv.glow);
        // show with small delay to feel like reveal
        window.setTimeout(() => {
          revealDropImage(dImg, withCacheBust(absUrl(dv.image)));
        }, 120);
      }
      if (r.reward_type === "unlock") {
        const name =
          r.reward_key === "railgun"
            ? "Рельса"
            : r.reward_key === "shaft"
              ? "Шафт"
              : r.reward_key === "thunder"
                ? "Гром"
                : "Титан";
        if (mText) mText.textContent = `Получено: ${name}`;
      } else {
        if (mText) mText.textContent = `Получено кристаллов: ${r.reward_amount}💎`;
      }
      clearError();
    } catch (e) {
      const m = prettyError(e);
      setError(m);
      // If it failed, don't keep the container opened
      state.containerOpened = false;
      state.containerOpenedImageUrl = null;
      if (mText) mText.textContent = `Ошибка: ${m}`;
    } finally {
      // Require closing the modal before opening again
      if (closeBtn) closeBtn.disabled = false;
      if (backdrop) backdrop.style.pointerEvents = "auto";
      if (btn) btn.disabled = false;
    }
  };

  qs("refreshBtn").onclick = async () => {
    try {
      await refreshAll();
      clearError();
    } catch (e) {
      setError(prettyError(e));
    }
  };
}

async function main() {
  bindUI();
  showTab("profile");
  state.activeTab = "profile";
  // На старте не показываем никаких "статусов" — только ошибки.
  clearError();
  // Результат контейнера не должен "залипать" между перезагрузками.
  const cr = qs("containerResult");
  if (cr) cr.textContent = "";

  // Gate screen: ensures user gesture for audio.
  const gate = qs("gate");
  const closeGate = () => {
    if (!gate) return;
    gate.classList.add("gateOut");
    window.setTimeout(() => {
      gate.style.display = "none";
    }, 230);
  };

  const awaitGate = () =>
    new Promise((resolve) => {
      if (!gate) return resolve();
      const card = gate.querySelector(".gateCard");
      const done = () => {
        gate.removeEventListener("click", done);
        gate.removeEventListener("keydown", onKey);
        closeGate();
        resolve();
      };
      const onKey = (e) => {
        if (e.key === "Enter" || e.key === " ") done();
      };
      gate.addEventListener("click", done, { once: true });
      gate.addEventListener("keydown", onKey);
      // Focus for keyboard users (desktop)
      if (card && typeof card.focus === "function") card.focus();
    });

  await awaitGate();
  // Start music immediately on that click
  setMusicForTabGesture(state.activeTab);
  try {
    const ok = await initAuth();
    if (!ok) return;
    await refreshAll();
    clearError();
    // If audio already unlocked (some webviews allow), start music.
    await setMusicForTab(state.activeTab);
  } catch (e) {
    setError(prettyError(e));
  }
}

main();

