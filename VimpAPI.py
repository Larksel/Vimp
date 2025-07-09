from os.path import exists
from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import StreamingResponse, FileResponse

app = FastAPI(title="VimpAPI")
filepath = ""
filename = ""

# TODO Está bloqueando o arquivo por muito tempo
@app.get("/stream_track", response_class=StreamingResponse)
def stream_track():
    if not exists(filepath):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    def iterfile():
        with open(filepath, mode="rb") as file:
            yield from file

    return StreamingResponse(iterfile(), media_type="audio/mpeg")


@app.get("/download_track", response_class=FileResponse)
def download(response: Response):
    # Definição dos cabeçalhos da resposta
    # Evita que o navegador faça cache da requisição e trave a comunicação
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"

    if not exists(filepath):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    return filepath
