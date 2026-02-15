from enum import Enum
from os import name as platform, system
from rich import print

from modules.downloader import Downloader
from modules.managers import DirManager


class _DownloadType(Enum):
    VIDEO = 1
    MUSIC = 2
    PLAYLIST_MUSIC = 3
    PLAYLIST_VIDEO = 4
    THUMBNAIL = 5


class VimpCLI:
    def __init__(self) -> None:
        self.dirmanager = DirManager()
        self.download_modes = {
            _DownloadType.VIDEO: {
                "title": "Download Video",
            },
            _DownloadType.MUSIC: {
                "title": "Download Music",
            },
            _DownloadType.PLAYLIST_MUSIC: {
                "title": "Download Music from Playlist",
            },
            _DownloadType.PLAYLIST_VIDEO: {
                "title": "Download Video from Playlist",
            },
            _DownloadType.THUMBNAIL: {
                "title": "Download Thumbnail",
            },
        }

    def _clear_screen(self):
        """Limpa a tela do console."""
        #system("cls" if platform == "nt" else "clear")
        pass

    def _print_decoration(self):
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")

    def _print_header(self, title: str):
        """Imprime um cabeçalho padronizado."""
        self._print_decoration()
        print(f"{title.center(45)}")
        self._print_decoration()

    def _print_options(self, opts: dict[str, str]):
        """Imprime a lista de opções para um determinado modo."""
        print("[red]0 - Exit / Go back[/red]")
        for num, name in opts.items():
            print(f"{num} - {name}")
        self._print_decoration()

    def _get_link_and_download(self, download_type: _DownloadType):
        """Função auxiliar para solicitar link e chamar o downloader."""
        link = input("Link: -> ")
        if link == "0" or link == "":
            return False

        downloader = Downloader(link)
        # TODO Utilizar self.download_modes para definir cada método para cada tipo
        # TODO Refatorar downloader para permitir esse tipo de operação
        if download_type == _DownloadType.VIDEO:
            downloader.get_video()
        elif download_type == _DownloadType.MUSIC:
            downloader.get_music()
        elif download_type == _DownloadType.PLAYLIST_MUSIC:
            downloader.get_music_from_playlist()
        elif download_type == _DownloadType.PLAYLIST_VIDEO:
            downloader.get_video_from_playlist()
        elif download_type == _DownloadType.THUMBNAIL:
            downloader.get_thumbnail()
        return True

    def _run_download_mode(self, download_type: _DownloadType):
        """Método genérico para os modos de download."""
        while True:
            self._clear_screen()
            self._print_header(self.download_modes[download_type]["title"])
            if not self._get_link_and_download(download_type):
                break

    def folder_navigation(self):
        while True:
            self._clear_screen()
            self._print_header("Folder Navigation")
            self._print_options(
                {
                    "1": "Open Vimp Music Folder",
                    "2": "Open Vimp Video Folder",
                    "3": "Open Vimp Temp Folder",
                }
            )

            option = input("-> ")
            if option == "1":
                self.dirmanager.open_music_dir()
            elif option == "2":
                self.dirmanager.open_video_dir()
            elif option == "3":
                self.dirmanager.open_temp_dir()
            elif option == "0" or option == "":
                break
            else:
                print("Opção inválida. Tente novamente!")

    def Home(self):
        while True:
            self._clear_screen()
            self._print_header("Vimp CLI")
            self._print_options(
                {
                    "1": "Download Video",
                    "2": "Download Music",
                    "3": "Download Music from Playlist",
                    "4": "Download Video from Playlist",
                    "5": "Download Thumbnail",
                    "6": "Folder Navigation",
                }
            )

            try:
                option = input("-> ")

                option_to_enum: dict[str, _DownloadType] = {}
                for type in _DownloadType:
                    option_number = str(type.value)
                    option_to_enum[option_number] = type

                if option == "0" or option == "":
                    break
                elif option in option_to_enum:
                    self._run_download_mode(option_to_enum[option])
                elif option == "6":
                    self.folder_navigation()
                else:
                    print("Opção inválida. Tente novamente!")
            except KeyboardInterrupt:
                print("\n\n[bold green]Encerrando a aplicação[/bold green]")
                break


if __name__ == "__main__":
    VimpCLI().Home()
