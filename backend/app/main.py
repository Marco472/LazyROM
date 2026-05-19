from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.models import platform, rom, settings as settings_model  # noqa: F401 — register models
from app.routers import platforms, roms, scraper, app_settings

app = FastAPI(title="LazyROM", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(platforms.router)
app.include_router(roms.router)
app.include_router(scraper.router)
app.include_router(app_settings.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health():
    return {"status": "ok"}
