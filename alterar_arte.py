from app.main.python.downloader import Downloader
from app.main.python.managers import FileManager
from pathlib import Path


def main():
    while True:
        url = input("Link do vídeo \n-> ")

        if url != "":
            downloader = Downloader(url)
            print(downloader.title)
        else:
            print("Nenhum valor inserido. Encerrando...")
            break

        audiofile = input("Arquivo a ser alterado \n-> ").replace('"', "")

        if audiofile != "":
            titulo = Path(audiofile).stem

            downloader.get_thumbnail()

            FileManager.set_audio_metadata(
                audiofile=audiofile, thumbimg=downloader.thumbnail_path, titulo=titulo
            )
        else:
            print("Valor inválido")


main()