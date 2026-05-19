# LazyROM

A web-based ROM library manager inspired by RomM. Organize, browse, and scrape metadata for your ROM collection.

## Features

- Automatic ROM discovery by scanning a directory tree (each subdirectory = a platform)
- IGDB metadata scraping (cover art, summaries, ratings) via Twitch OAuth
- Responsive dark-themed UI with a gaming aesthetic
- ROM download directly from the browser
- Per-platform and global library views with search
- Docker-based deployment

## Quick Start

### Docker (recommended)

```bash
cp .env.example .env
# Fill in your IGDB credentials in .env
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### Local development

**Backend**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # edit as needed
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## ROM Library Layout

Place ROMs under `./roms/` (or wherever `LIBRARY_PATH` points). Each subdirectory is treated as a platform slug:

```
roms/
  nes/
    Super Mario Bros.nes
    Mega Man 2 (USA).nes
  snes/
    Super Metroid (USA).sfc
  gba/
    Pokemon Fire Red (USA).gba
```

Click **Scan Library** in the UI to discover ROMs.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `LIBRARY_PATH` | `/roms` | Root directory of your ROM collection |
| `DATABASE_URL` | `sqlite:////data/lazyrom.db` | SQLAlchemy database URL |
| `IGDB_CLIENT_ID` | `` | Twitch app Client ID |
| `IGDB_CLIENT_SECRET` | `` | Twitch app Client Secret |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Allowed CORS origins (JSON list) |

## IGDB Setup

1. Create a Twitch Developer account at https://dev.twitch.tv/
2. Register a new application (Category: Application Integration)
3. Copy the **Client ID** and generate a **Client Secret**
4. Add them to your `.env` file
5. Use the **Scrape** button on any ROM card or **Scrape All** in Settings

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/platforms` | List platforms with ROM counts |
| POST | `/api/platforms` | Create platform |
| PUT | `/api/platforms/{id}` | Update platform |
| DELETE | `/api/platforms/{id}` | Delete platform |
| GET | `/api/roms` | List ROMs (`?platform_id=`, `?search=`) |
| GET | `/api/roms/{id}` | Get single ROM |
| PUT | `/api/roms/{id}` | Update ROM metadata |
| DELETE | `/api/roms/{id}` | Delete ROM record |
| GET | `/api/roms/{id}/download` | Download ROM file |
| POST | `/api/scraper/scan` | Scan filesystem for ROMs |
| POST | `/api/scraper/scrape/{id}` | Scrape single ROM |
| POST | `/api/scraper/scrape-all` | Scrape all unscraped ROMs (background) |
| GET | `/api/settings` | Get app settings |
| PUT | `/api/settings` | Update app settings |
