from __future__ import annotations

from pydantic import BaseModel


class AuthRequest(BaseModel):
    initData: str


class AuthResponse(BaseModel):
    token: str


class RankInfo(BaseModel):
    id: int
    name: str
    exp_required: int
    image: str


class ProfileResponse(BaseModel):
    user_id: int
    weapon: str
    hull: str
    wins: int
    losses: int
    battles: int
    containers: int
    crystals: int
    experience: int
    rank: RankInfo
    rank_image_url: str
    tank_image_url: str
    unlocks: dict[str, bool]


class SetTankRequest(BaseModel):
    weapon: str
    hull: str


class SimpleOk(BaseModel):
    ok: bool = True


class ContainersInfoResponse(BaseModel):
    containers: int
    crystals: int
    chances: dict[str, int]
    container_image_url: str
    opened_container_image_url: str


class OpenContainerResponse(BaseModel):
    containers_left: int
    crystals: int
    reward_type: str
    reward_key: str | None = None
    reward_amount: int | None = None
    image_url: str


class ShopItem(BaseModel):
    key: str
    name: str
    price: int
    owned: bool
    image_url: str | None = None
    category: str


class ShopItemsResponse(BaseModel):
    crystals: int
    items: list[ShopItem]


class BuyRequest(BaseModel):
    item: str

