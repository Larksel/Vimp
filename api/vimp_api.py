from os.path import exists
from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import FileResponse


class VimpAPI:
    def __init__(self) -> None:
        self.app = FastAPI(title="VimpAPI")
        self._setup_routes()

    def _setup_routes(self):
        """Configura todos os endpoints da API."""

        @self.app.get("/download_track", response_class=FileResponse)
        async def download_track(link: str, response: Response):
            return await self._handle_download_track(link, response)

    async def _handle_download_track(self, link: str, response: Response):
        # TODO Descobrir o nome do arquivo pelo titulo do video
        filepath = ""
        filename = ""

        # TODO Verificar se o arquivo ja existe
        # TODO Se existir, envia como resposta
        # TODO Senão baixa para o computador e envia
        # ? FUTURO: Devo baixar para uma pasta temporária?
        if not exists(filepath):
            raise HTTPException(status_code=404, detail="Arquivo não encontrado")

        # Definição dos cabeçalhos da resposta
        # Evita que o navegador faça cache da requisição e trave a comunicação
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        response.headers["Content-Disposition"] = f"attachment; filename={filename}"

        return filepath
