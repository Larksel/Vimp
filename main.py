from typer import Typer
from rich import print
from VimpCLI import Home

app = Typer()

@app.command()
def main(cli: bool = False):
    if not cli:
        print("Inicializando API")
    else:
        Home()


if __name__ == "__main__":
    app()
