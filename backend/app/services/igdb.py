import time
import httpx
from typing import Optional
from app.config import settings


class IGDBService:
    """Client for the IGDB API using Twitch OAuth."""

    TOKEN_URL = "https://id.twitch.tv/oauth2/token"
    IGDB_BASE_URL = "https://api.igdb.com/v4"

    def __init__(self):
        self._token: Optional[str] = None
        self._token_expires_at: float = 0.0

    async def get_token(self) -> str:
        """Fetch and cache a Twitch OAuth token."""
        if self._token and time.time() < self._token_expires_at - 60:
            return self._token

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                self.TOKEN_URL,
                params={
                    "client_id": settings.IGDB_CLIENT_ID,
                    "client_secret": settings.IGDB_CLIENT_SECRET,
                    "grant_type": "client_credentials",
                },
                timeout=10.0,
            )
            resp.raise_for_status()
            data = resp.json()

        self._token = data["access_token"]
        self._token_expires_at = time.time() + data.get("expires_in", 3600)
        return self._token

    def _headers(self, token: str) -> dict:
        return {
            "Client-ID": settings.IGDB_CLIENT_ID,
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        }

    def _build_cover_url(self, cover: Optional[dict]) -> Optional[str]:
        if not cover:
            return None
        image_id = cover.get("image_id")
        if not image_id:
            return None
        return f"https://images.igdb.com/igdb/image/upload/t_cover_big/{image_id}.jpg"

    async def search_game(
        self, name: str, platform_igdb_id: Optional[int] = None
    ) -> list[dict]:
        """Search IGDB for games matching name, optionally filtered by platform."""
        token = await self.get_token()

        platform_filter = f" & platforms = ({platform_igdb_id})" if platform_igdb_id else ""
        query = (
            f'search "{name}";'
            f" fields id,name,cover.image_id,summary,total_rating;"
            f" where category = 0{platform_filter};"
            f" limit 10;"
        )

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.IGDB_BASE_URL}/games",
                headers=self._headers(token),
                content=query,
                timeout=15.0,
            )
            resp.raise_for_status()
            games = resp.json()

        results = []
        for game in games:
            results.append({
                "id": game.get("id"),
                "name": game.get("name"),
                "cover_url": self._build_cover_url(game.get("cover")),
                "summary": game.get("summary"),
                "rating": game.get("total_rating"),
            })
        return results

    async def get_game(self, igdb_id: int) -> Optional[dict]:
        """Fetch details for a single game by IGDB ID."""
        token = await self.get_token()

        query = (
            f"fields id,name,cover.image_id,summary,total_rating;"
            f" where id = {igdb_id};"
        )

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.IGDB_BASE_URL}/games",
                headers=self._headers(token),
                content=query,
                timeout=15.0,
            )
            resp.raise_for_status()
            games = resp.json()

        if not games:
            return None

        game = games[0]
        return {
            "id": game.get("id"),
            "name": game.get("name"),
            "cover_url": self._build_cover_url(game.get("cover")),
            "summary": game.get("summary"),
            "rating": game.get("total_rating"),
        }


igdb_service = IGDBService()
