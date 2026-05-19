from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class PlatformBase(BaseModel):
    name: str
    slug: str
    igdb_id: Optional[int] = None
    artwork_url: Optional[str] = None


class PlatformCreate(PlatformBase):
    pass


class PlatformUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    igdb_id: Optional[int] = None
    artwork_url: Optional[str] = None


class PlatformRead(PlatformBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PlatformWithCount(PlatformRead):
    rom_count: int = 0
