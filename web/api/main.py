from __future__ import annotations

import os
import random
from pathlib import Path

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from database import RANKS, db
from data import HULLS, WEAPONS, get_tank_image_name

from .jwt_session import Session, issue_token, verify_token
from .image_trim import TrimConfig, trim_png_to_cache
from .schemas import (
    AuthRequest,
    AuthResponse,
    BuyRequest,
    ContainersInfoResponse,
    OpenContainerResponse,
    ProfileResponse,
    RankInfo,
    SetTankRequest,
    ShopItem,
    ShopItemsResponse,
)
from .settings import load_settings
from .telegram_auth import TelegramInitDataError, validate_init_data


settings = load_settings()

app = FastAPI(title="tgbot web api", version="0.1.0")

if settings.cors_allow_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def _project_root() -> Path:
    # .../tgbot/web/api/main.py -> root is .../tgbot
    return Path(__file__).resolve().parents[2]


@app.get("/sounds/{path:path}")
def serve_sound(path: str):
    """
    Serve audio files from <project_root>/sounds.
    Explicit route so it won't be captured by the "/" static mount.
    """
    if ".." in path or "\\" in path:
        raise HTTPException(status_code=404, detail="Not Found")
    root = _project_root()
    sounds_root = (root / "sounds").resolve()
    file_path = (sounds_root / path).resolve()
    if not str(file_path).startswith(str(sounds_root)):
        raise HTTPException(status_code=404, detail="Not Found")
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Not Found")
    return FileResponse(file_path)


@app.on_event("startup")
def _startup():
    # Make sure the shared DB points to the workspace users.db, not web/api/users.db
    root = _project_root()
    db_path = root / "users.db"
    db.filename = str(db_path)
    # Ensure table exists
    db.init_db()
    # Images/static mounts are configured below (module-level) too.


def require_session(authorization: str | None = Header(default=None)) -> Session:
    if not authorization:
        raise HTTPException(status_code=401, detail="missing Authorization header")
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="invalid Authorization header")
    token = authorization.split(" ", 1)[1].strip()
    try:
        return verify_token(token, settings.jwt_secret)
    except Exception:
        raise HTTPException(status_code=401, detail="invalid token")


def _weapon_owned(user_id: int, weapon_id: str) -> bool:
    weapon = WEAPONS.get(weapon_id)
    if not weapon:
        return False
    if not getattr(weapon, "locked", False):
        return True
    if weapon_id == "railgun":
        return db.has_railgun(user_id)
    if weapon_id == "shaft":
        return db.has_shaft(user_id)
    if weapon_id == "thunder":
        return db.has_thunder(user_id)
    return False


def _hull_owned(user_id: int, hull_id: str) -> bool:
    hull = HULLS.get(hull_id)
    if not hull:
        return False
    if not getattr(hull, "locked", False):
        return True
    if hull_id == "titan":
        return db.has_titan(user_id)
    return False


SHOP_PRICES: dict[str, int] = {
    "railgun": 5000,
    "shaft": 4000,
    "thunder": 3000,
    "titan": 6000,
}

SHOP_NAMES: dict[str, str] = {
    "railgun": "Рельса",
    "shaft": "Шафт",
    "thunder": "Гром",
    "titan": "Титан",
}

SHOP_IMAGES: dict[str, str] = {
    "railgun": "railgun.png",
    "shaft": "shaft.png",
    "thunder": "thunder.png",
    "titan": "titan.png",
}

CONTAINER_IMAGE = "container.png"
CONTAINER_OPENED_IMAGE = "contopen.png"


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.get("/images/{path:path}")
def serve_image(path: str):
    """
    Раздача PNG из папки images. Явный маршрут, чтобы не перехватывалось StaticFiles на '/'
    (иначе /images/* отдавал 404 из web/app).
    """
    if ".." in path or "\\" in path:
        raise HTTPException(status_code=404, detail="Not Found")
    root = _project_root()
    images_root = (root / "images").resolve()
    req = path.strip("/").lstrip("/")
    low = req.lower()

    # Ranks must come ONLY from images/ (no subfolders)
    if low.startswith("rank") and low.endswith(".png") and "/" not in req:
        file_path = (images_root / req).resolve()
    else:
        # Everything for WebApp should come from images/webapp/...
        file_path = (images_root / "webapp" / req).resolve()
        # Backward-compatible fallback (in case something wasn't moved yet)
        if not file_path.is_file():
            file_path = (images_root / req).resolve()

    if not str(file_path).startswith(str(images_root)):
        raise HTTPException(status_code=404, detail="Not Found")
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Not Found")

    # Only ranks: trim background, keep glow.
    if low.startswith("rank") and low.endswith(".png") and "/" not in req:
        # Bump cache version when changing trim params.
        cache_root = (images_root / "_rankcache_v3").resolve()
        cached = (cache_root / req).resolve()
        if not str(cached).startswith(str(cache_root)):
            raise HTTPException(status_code=404, detail="Not Found")

        try:
            if (not cached.is_file()) or (cached.stat().st_mtime < file_path.stat().st_mtime):
                # Rank badges usually have a flat green background + soft glow.
                # We remove only border-connected background pixels, keep the glow by using generous padding.
                # Higher tolerance is needed to remove the whole green background gradient.
                # Flood-fill is border-connected, so interior glow details remain intact.
                cfg = TrimConfig(tolerance=60, padding=26, sample_step=4)
                trim_png_to_cache(file_path, cached, config=cfg)
            return FileResponse(cached)
        except Exception:
            return FileResponse(file_path)

    # Everything else: do not touch.
    return FileResponse(file_path)


@app.post("/api/auth/telegram", response_model=AuthResponse)
def auth_telegram(body: AuthRequest):
    try:
        auth = validate_init_data(body.initData, settings.bot_token, settings.telegram_max_auth_age_seconds)
    except TelegramInitDataError as e:
        raise HTTPException(status_code=401, detail=str(e))

    # Ensure user exists
    db.get_user(auth.user.id)

    token = issue_token(user_id=auth.user.id, secret=settings.jwt_secret, ttl_seconds=settings.jwt_ttl_seconds)
    return AuthResponse(token=token)


@app.get("/api/profile/me", response_model=ProfileResponse)
def profile_me(session: Session = Depends(require_session)):
    user_id = session.user_id
    u = db.get_user(user_id)
    rank_id = int(u.get("rank", 1))
    rank = RANKS.get(rank_id, RANKS[1])
    rank_image_url = f"/images/{rank['image']}"

    tank_image_name = get_tank_image_name(u["weapon"], u["hull"])
    tank_image_url = f"/images/webapp/{tank_image_name}"

    unlocks = {
        "railgun": db.has_railgun(user_id),
        "shaft": db.has_shaft(user_id),
        "thunder": db.has_thunder(user_id),
        "titan": db.has_titan(user_id),
    }

    return ProfileResponse(
        user_id=user_id,
        weapon=u["weapon"],
        hull=u["hull"],
        wins=u["wins"],
        losses=u["losses"],
        battles=u["battles"],
        containers=u["containers"],
        crystals=u["crystals"],
        experience=u["experience"],
        rank=RankInfo(
            id=rank_id,
            name=rank["name"],
            exp_required=rank["exp"],
            image=rank["image"],
        ),
        rank_image_url=rank_image_url,
        tank_image_url=tank_image_url,
        unlocks=unlocks,
    )


@app.post("/api/garage/set_tank")
def garage_set_tank(body: SetTankRequest, session: Session = Depends(require_session)):
    user_id = session.user_id

    if body.weapon not in WEAPONS:
        raise HTTPException(status_code=400, detail="unknown weapon")
    if body.hull not in HULLS:
        raise HTTPException(status_code=400, detail="unknown hull")

    if not _weapon_owned(user_id, body.weapon):
        raise HTTPException(status_code=403, detail="weapon locked")
    if not _hull_owned(user_id, body.hull):
        raise HTTPException(status_code=403, detail="hull locked")

    db.set_tank(user_id, body.weapon, body.hull)
    return {"ok": True}


@app.get("/api/containers", response_model=ContainersInfoResponse)
def containers_info(session: Session = Depends(require_session)):
    u = db.get_user(session.user_id)
    return ContainersInfoResponse(
        containers=u.get("containers", 0),
        crystals=u.get("crystals", 0),
        chances={"railgun": 2, "shaft": 2, "thunder": 5, "titan": 2, "crystals": 89},
        container_image_url=f"/images/webapp/{CONTAINER_IMAGE}",
        opened_container_image_url=f"/images/webapp/{CONTAINER_OPENED_IMAGE}",
    )


@app.post("/api/containers/open", response_model=OpenContainerResponse)
def containers_open(session: Session = Depends(require_session)):
    user_id = session.user_id
    u = db.get_user(user_id)
    if u.get("containers", 0) <= 0:
        raise HTTPException(status_code=400, detail="no containers")

    if not db.use_container(user_id):
        raise HTTPException(status_code=500, detail="failed to use container")

    rand = random.randint(1, 100)

    has_railgun = db.has_railgun(user_id)
    has_shaft = db.has_shaft(user_id)
    has_thunder = db.has_thunder(user_id)
    has_titan = db.has_titan(user_id)

    reward_type = ""
    reward_key: str | None = None
    reward_amount: int | None = None

    if rand <= 2 and not has_railgun:
        db.unlock_railgun(user_id)
        reward_type = "unlock"
        reward_key = "railgun"
    elif 3 <= rand <= 4 and not has_shaft:
        db.unlock_shaft(user_id)
        reward_type = "unlock"
        reward_key = "shaft"
    elif 5 <= rand <= 9 and not has_thunder:
        db.unlock_thunder(user_id)
        reward_type = "unlock"
        reward_key = "thunder"
    elif 10 <= rand <= 11 and not has_titan:
        db.unlock_titan(user_id)
        reward_type = "unlock"
        reward_key = "titan"
    else:
        crystals = random.choice([50, 100, 150, 200, 250, 300])
        db.add_crystals(user_id, crystals)
        reward_type = "crystals"
        reward_amount = crystals

    u2 = db.get_user(user_id)
    return OpenContainerResponse(
        containers_left=u2.get("containers", 0),
        crystals=u2.get("crystals", 0),
        reward_type=reward_type,
        reward_key=reward_key,
        reward_amount=reward_amount,
        image_url=f"/images/webapp/{CONTAINER_OPENED_IMAGE}",
    )


@app.get("/api/shop/items", response_model=ShopItemsResponse)
def shop_items(session: Session = Depends(require_session)):
    user_id = session.user_id
    u = db.get_user(user_id)
    items: list[ShopItem] = []

    for key, price in SHOP_PRICES.items():
        owned = False
        category = "other"
        if key in ("railgun", "shaft", "thunder"):
            owned = _weapon_owned(user_id, key)
            category = "weapon"
        elif key == "titan":
            owned = _hull_owned(user_id, key)
            category = "hull"

        image_url = None
        if key in SHOP_IMAGES:
            image_url = f"/images/webapp/{SHOP_IMAGES[key]}"
        items.append(
            ShopItem(
                key=key,
                name=SHOP_NAMES[key],
                price=price,
                owned=owned,
                image_url=image_url,
                category=category,
            )
        )

    return ShopItemsResponse(crystals=u.get("crystals", 0), items=items)


@app.post("/api/shop/buy")
def shop_buy(body: BuyRequest, session: Session = Depends(require_session)):
    user_id = session.user_id
    item = body.item
    if item not in SHOP_PRICES:
        raise HTTPException(status_code=400, detail="unknown item")

    # already owned
    if item in ("railgun", "shaft", "thunder") and _weapon_owned(user_id, item):
        raise HTTPException(status_code=400, detail="already owned")
    if item == "titan" and _hull_owned(user_id, item):
        raise HTTPException(status_code=400, detail="already owned")

    u = db.get_user(user_id)
    price = SHOP_PRICES[item]
    if u.get("crystals", 0) < price:
        raise HTTPException(status_code=400, detail="not enough crystals")

    db.add_crystals(user_id, -price)
    if item == "railgun":
        db.unlock_railgun(user_id)
    elif item == "shaft":
        db.unlock_shaft(user_id)
    elif item == "thunder":
        db.unlock_thunder(user_id)
    elif item == "titan":
        db.unlock_titan(user_id)

    return {"ok": True}


# Sounds (music, effects) - served as static files.
# Must be mounted BEFORE "/" static, otherwise "/" will capture everything.
sounds_dir = _project_root() / "sounds"
if sounds_dir.exists():
    app.mount("/sounds", StaticFiles(directory=str(sounds_dir)), name="sounds")

# Static webapp (no node required). Картинки — только через GET /images/{filename} выше.
static_dir = _project_root() / "web" / "app"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="webapp")

