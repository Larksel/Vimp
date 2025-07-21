from os.path import exists
from fastapi import FastAPI, Response
from fastapi.responses import FileResponse
from urllib.parse import quote

from modules.managers import DirManager
from modules.downloader import Downloader


class VimpAPI:
    def __init__(self) -> None:
        self.app = FastAPI(title="VimpAPI")
        self.dirmanager = DirManager()
        self._setup_routes()

    def _setup_routes(self):
        """Configura todos os endpoints da API."""

        @self.app.get("/download_track/", response_class=FileResponse)
        async def download_track(link: str, response: Response):
            return await self._handle_download_track(link, response)

    async def _handle_download_track(self, link: str, response: Response):
        downloader = Downloader(link)
        filename = f"{downloader.formatted_title}.mp3"
        filepath = self.dirmanager.MUSIC_FOLDER + filename

        print(f"Filename: {filename}")

        # Definição dos cabeçalhos da resposta
        # Evita que o navegador faça cache da requisição e trave a comunicação
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        encoded_filename = quote(filename.encode("utf-8"))
        response.headers["Content-Disposition"] = (
            f"attachment; filename*=UTF-8''{encoded_filename}"
        )

        if not exists(filepath):
            print("Música não encontrada. Baixando...")
            downloader.get_music()

        print(f"Enviando: {filepath}")

        return filepath
