from typer import Typer
from rich import print
import uvicorn

from vimp_cli import VimpCLI
from vimp_api import VimpAPI

app = Typer()


@app.command()
def start(cli: bool = False, host: bool = False):
    """
    Inicia a interface de linha de comando (CLI) ou a aplicação FastAPI.

    Use --cli para iniciar o modo CLI.
    """
    if cli:
        print("[bold blue]Iniciando VimpCLI[/bold blue]")
        VimpCLI().Home()
    else:
        api = VimpAPI().app
        address = "0.0.0.0" if host else "127.0.0.1"
        port = 5555

        print(
            f"[bold green]Iniciando VimpAPI no endereço http://{address}:{port}[/bold green]"
        )

        uvicorn.run(api, host=address, port=port)


if __name__ == "__main__":
    app()
