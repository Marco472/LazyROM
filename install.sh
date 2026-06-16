#!/usr/bin/env bash
# LazyROM one-command installer.
# Sets up .env, creates the roms/data directories, and starts the stack via Docker Compose.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if ! command -v docker &>/dev/null; then
  echo "Error: Docker is required but was not found in PATH." >&2
  echo "Install it from https://docs.docker.com/get-docker/ and re-run this script." >&2
  exit 1
fi

if docker compose version &>/dev/null; then
  COMPOSE="docker compose"
elif command -v docker-compose &>/dev/null; then
  COMPOSE="docker-compose"
else
  echo "Error: Docker Compose is required but was not found." >&2
  exit 1
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example."
else
  echo ".env already exists, leaving it untouched."
fi

mkdir -p roms data
echo "Created ./roms (place your ROM files here) and ./data (database storage)."

if grep -q '^IGDB_CLIENT_ID=$' .env 2>/dev/null; then
  echo
  read -rp "Enter your IGDB Client ID (leave blank to skip): " igdb_id
  read -rp "Enter your IGDB Client Secret (leave blank to skip): " igdb_secret
  if [ -n "$igdb_id" ]; then
    sed -i.bak "s/^IGDB_CLIENT_ID=.*/IGDB_CLIENT_ID=${igdb_id}/" .env && rm -f .env.bak
  fi
  if [ -n "$igdb_secret" ]; then
    sed -i.bak "s/^IGDB_CLIENT_SECRET=.*/IGDB_CLIENT_SECRET=${igdb_secret}/" .env && rm -f .env.bak
  fi
  if [ -z "$igdb_id" ] || [ -z "$igdb_secret" ]; then
    echo "Skipped IGDB credentials — you can add them later in .env or via the Settings page."
  fi
fi

echo
echo "Building and starting LazyROM..."
$COMPOSE up --build -d

echo
echo "LazyROM is up:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "  API docs: http://localhost:8000/docs"
echo
echo "Drop ROMs into ./roms/<platform>/ then click 'Scan Library' in the UI."
