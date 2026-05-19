from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.models.rom import ROM
from app.services.igdb import igdb_service
from app.services.scanner import scan_library
from app.config import settings

router = APIRouter(prefix="/api/scraper", tags=["scraper"])


class ScrapeRequest(BaseModel):
    igdb_id: Optional[int] = None


@router.post("/scan")
def trigger_scan(db: Session = Depends(get_db)):
    """Scan the library path for new ROMs and platforms."""
    result = scan_library(settings.LIBRARY_PATH, db)
    return result


@router.post("/scrape/{rom_id}")
async def scrape_rom(rom_id: int, body: ScrapeRequest, db: Session = Depends(get_db)):
    """
    Scrape metadata for a single ROM.
    If igdb_id is provided, fetch that game directly.
    Otherwise, search by ROM name.
    """
    rom = db.query(ROM).filter(ROM.id == rom_id).first()
    if not rom:
        raise HTTPException(status_code=404, detail="ROM not found")

    if not settings.IGDB_CLIENT_ID or not settings.IGDB_CLIENT_SECRET:
        raise HTTPException(status_code=400, detail="IGDB credentials not configured")

    if body.igdb_id:
        game = await igdb_service.get_game(body.igdb_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found on IGDB")
    else:
        # Get platform's IGDB id for better search accuracy
        platform_igdb_id = rom.platform.igdb_id if rom.platform else None
        results = await igdb_service.search_game(rom.name, platform_igdb_id)
        if not results:
            raise HTTPException(status_code=404, detail="No IGDB results found for this ROM")
        game = results[0]

    rom.igdb_id = game["id"]
    rom.cover_url = game.get("cover_url")
    rom.summary = game.get("summary")
    rom.rating = game.get("rating")
    rom.scraped_at = datetime.utcnow()
    db.commit()
    db.refresh(rom)
    return rom


async def _scrape_all_task():
    """Background task: iterate over unscraped ROMs and fetch IGDB metadata."""
    if not settings.IGDB_CLIENT_ID or not settings.IGDB_CLIENT_SECRET:
        return

    db = SessionLocal()
    try:
        roms = db.query(ROM).filter(ROM.scraped_at.is_(None)).all()
        for rom in roms:
            try:
                platform_igdb_id = rom.platform.igdb_id if rom.platform else None
                results = await igdb_service.search_game(rom.name, platform_igdb_id)
                if results:
                    game = results[0]
                    rom.igdb_id = game["id"]
                    rom.cover_url = game.get("cover_url")
                    rom.summary = game.get("summary")
                    rom.rating = game.get("rating")
                    rom.scraped_at = datetime.utcnow()
                    db.commit()
            except Exception:
                # Skip individual failures, continue with rest
                db.rollback()
    finally:
        db.close()


@router.post("/scrape-all")
async def scrape_all(background_tasks: BackgroundTasks):
    """Trigger background scraping of all unscraped ROMs."""
    background_tasks.add_task(_scrape_all_task)
    return {"message": "Scraping started in the background"}
