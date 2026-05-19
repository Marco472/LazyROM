# LazyROM

A self-hosted, web-based ROM library manager with an integrated metadata scraper. Point it at your ROM folder and get a clean, searchable library with cover art, summaries, and ratings pulled from IGDB.

---

## Features

- **Automatic scanning** — drop ROMs in folders named after platforms and hit Scan. LazyROM finds them all.
- **IGDB scraping** — fetches cover art, summaries, and ratings via the Twitch/IGDB API. Scrape one game or the whole library at once.
- **Dark gaming UI** — responsive grid view with search, per-platform filtering, and a ROM detail modal.
- **In-browser download** — stream any ROM directly from the web UI.
- **Docker-first** — one command to get up and running.

---

## Screenshots

> Coming soon.

---

## Quick Start

### Docker (recommended)

```bash
git clone https://github.com/Marco472/LazyROM.git
cd LazyROM

cp .env.example .env
# Edit .env — add your IGDB credentials (see below)

docker compose up --build
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:8000        |
| API docs | http://localhost:8000/docs   |

### Local Development

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
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

---

## ROM Library Layout

Organise your ROMs under `./roms/` (or wherever `LIBRARY_PATH` points). Each subdirectory name becomes the platform slug.

```
roms/
├── nes/
│   ├── Super Mario Bros.nes
│   └── Mega Man 2 (USA).nes
├── snes/
│   └── Super Metroid (USA).sfc
├── gba/
│   └── Pokemon Fire Red (USA).gba
└── ps1/
    └── Crash Bandicoot (USA).bin
```

Supported extensions: `.nes` `.sfc` `.smc` `.n64` `.z64` `.v64` `.gb` `.gbc` `.gba` `.nds` `.iso` `.bin` `.cue` `.rom` `.zip` `.7z`

After adding ROMs, click **Scan Library** in the UI or call `POST /api/scraper/scan`.

---

## IGDB Setup

LazyROM uses the [IGDB API](https://api-docs.igdb.com/) (free) for metadata.

1. Go to [dev.twitch.tv](https://dev.twitch.tv/) and log in with your Twitch account.
2. Click **Register Your Application**.
3. Set the OAuth Redirect URL to `http://localhost` and the Category to **Application Integration**.
4. Copy your **Client ID** and generate a **Client Secret**.
5. Paste them into your `.env` file.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

| Variable             | Default                          | Description                              |
|----------------------|----------------------------------|------------------------------------------|
| `LIBRARY_PATH`       | `/roms`                          | Root directory of your ROM collection    |
| `DATABASE_URL`       | `sqlite:////data/lazyrom.db`     | SQLAlchemy-compatible database URL       |
| `IGDB_CLIENT_ID`     | —                                | Twitch app Client ID                     |
| `IGDB_CLIENT_SECRET` | —                                | Twitch app Client Secret                 |
| `CORS_ORIGINS`       | `["http://localhost:5173"]`      | Allowed CORS origins (JSON array)        |

---

## Project Structure

```
LazyROM/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, startup
│   │   ├── config.py            # Settings via pydantic-settings
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── models/              # ORM models (Platform, ROM, Settings)
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # REST endpoints
│   │   └── services/
│   │       ├── igdb.py          # IGDB API client (Twitch OAuth + search)
│   │       └── scanner.py       # Filesystem ROM scanner
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/client.js        # Axios API client
│   │   ├── components/          # Sidebar, RomCard, PlatformBadge
│   │   └── pages/               # Library, Platform, Settings
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## API Reference

| Method | Path                          | Description                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/api/health`                 | Health check                             |
| GET    | `/api/platforms`              | List all platforms with ROM counts       |
| POST   | `/api/platforms`              | Create a platform                        |
| PUT    | `/api/platforms/{id}`         | Update a platform                        |
| DELETE | `/api/platforms/{id}`         | Delete a platform                        |
| GET    | `/api/roms`                   | List ROMs (`?platform_id=` `?search=`)   |
| GET    | `/api/roms/{id}`              | Get a single ROM                         |
| PUT    | `/api/roms/{id}`              | Update ROM metadata                      |
| DELETE | `/api/roms/{id}`              | Remove ROM record (file untouched)       |
| GET    | `/api/roms/{id}/download`     | Stream ROM file to browser               |
| POST   | `/api/scraper/scan`           | Scan filesystem, upsert ROM records      |
| POST   | `/api/scraper/scrape/{id}`    | Scrape metadata for one ROM              |
| POST   | `/api/scraper/scrape-all`     | Scrape all unscraped ROMs (background)   |
| GET    | `/api/settings`               | Get app settings                         |
| PUT    | `/api/settings`               | Update app settings                      |

Interactive docs available at `http://localhost:8000/docs` when the backend is running.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Backend   | Python 3.12, FastAPI, SQLAlchemy  |
| Database  | SQLite (file-based, zero config)  |
| Scraper   | IGDB API via httpx                |
| Frontend  | React 18, Vite, TailwindCSS       |
| Container | Docker, Docker Compose            |

---

## Roadmap

- [ ] Multi-user support with authentication
- [ ] Additional scrapers (ScreenScraper, TheGamesDB)
- [ ] Save state management
- [ ] In-browser emulation (RetroArch WebAssembly)
- [ ] Bulk import / export metadata
- [ ] Mobile-friendly layout

---

## License

MIT
