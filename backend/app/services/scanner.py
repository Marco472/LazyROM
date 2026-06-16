import os
from pathlib import Path
from sqlalchemy.orm import Session
from app.models.platform import Platform
from app.models.rom import ROM

ROM_EXTENSIONS = {
    ".nes", ".sfc", ".smc", ".n64", ".z64", ".v64",
    ".gb", ".gbc", ".gba", ".nds",
    ".iso", ".bin", ".cue", ".rom",
    ".zip", ".7z",
}

# Map common platform directory slugs to human-readable names
PLATFORM_NAMES: dict[str, str] = {
    "nes": "Nintendo Entertainment System",
    "snes": "Super Nintendo",
    "n64": "Nintendo 64",
    "gb": "Game Boy",
    "gbc": "Game Boy Color",
    "gba": "Game Boy Advance",
    "nds": "Nintendo DS",
    "ps1": "PlayStation",
    "ps2": "PlayStation 2",
    "psp": "PlayStation Portable",
    "genesis": "Sega Genesis",
    "megadrive": "Sega Mega Drive",
    "gamegear": "Sega Game Gear",
    "saturn": "Sega Saturn",
    "dreamcast": "Sega Dreamcast",
    "gamecube": "Nintendo GameCube",
    "wii": "Nintendo Wii",
    "3ds": "Nintendo 3DS",
    "arcade": "Arcade",
    "mame": "MAME",
    "atari2600": "Atari 2600",
    "atari7800": "Atari 7800",
}


def _human_name(slug: str) -> str:
    return PLATFORM_NAMES.get(slug.lower(), slug.replace("-", " ").replace("_", " ").title())


def scan_library(library_path: str, db: Session) -> dict:
    """
    Walk library_path. Each immediate subdirectory is treated as a platform slug.
    Files inside with known ROM extensions are upserted as ROM records.
    Returns {"platforms": N, "roms": N} counts of new records created.
    """
    root = Path(library_path)
    if not root.exists():
        return {"platforms": 0, "roms": 0}

    new_platforms = 0
    new_roms = 0

    for platform_dir in sorted(root.iterdir()):
        if not platform_dir.is_dir():
            continue

        slug = platform_dir.name.lower()

        # Upsert platform
        platform = db.query(Platform).filter(Platform.slug == slug).first()
        if not platform:
            platform = Platform(name=_human_name(slug), slug=slug)
            db.add(platform)
            db.flush()  # get the id
            new_platforms += 1

        # Walk the platform directory (recursively to support sub-dirs)
        for dirpath, _dirs, filenames in os.walk(platform_dir):
            for filename in filenames:
                ext = Path(filename).suffix.lower()
                if ext not in ROM_EXTENSIONS:
                    continue

                file_path = str(Path(dirpath) / filename)
                file_size = 0
                try:
                    file_size = os.path.getsize(file_path)
                except OSError:
                    pass

                # Check if ROM already tracked
                existing = db.query(ROM).filter(ROM.file_path == file_path).first()
                if not existing:
                    # Derive a clean name from file stem
                    name = Path(filename).stem
                    # Strip common cruft like (USA) (Rev 1) [!] etc.
                    import re
                    name = re.sub(r"\s*[\(\[\{][^\)\]\}]*[\)\]\}]", "", name).strip()

                    rom = ROM(
                        platform_id=platform.id,
                        name=name or Path(filename).stem,
                        file_name=filename,
                        file_path=file_path,
                        file_size=file_size,
                    )
                    db.add(rom)
                    new_roms += 1
                else:
                    # Update file size in case it changed
                    existing.file_size = file_size

    db.commit()
    return {"platforms": new_platforms, "roms": new_roms}
