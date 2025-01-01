from os import startfile, system

from app.main.python.downloader import Downloader
from app.main.python.managers import DirManager


dirmanager = DirManager()
decoration = "-+"

def download_mode(mode_type, downloader_func):
    while True:
        system("cls")
        print(f"{decoration*30}-")
        print(f"                  Download {mode_type}                  ")
        print(f"{decoration*30}-")
        print("0 - Go back")
        print(f"{decoration*30}-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        downloader = Downloader(link)
        downloader_func(downloader)


def video_mode():
    download_mode("Video", lambda downloader: downloader.get_video())


def music_mode():
    download_mode("Music", lambda downloader: downloader.get_music())


def list_music():
    download_mode(
        "Music from Playlist", lambda downloader: downloader.get_music_playlist()
    )


def list_video():
    download_mode(
        "Video from Playlist", lambda downloader: downloader.get_video_playlist()
    )


def thumb_mode():
    download_mode("Thumbnail", lambda downloader: downloader.get_thumbnail())


def folder_mode():
    while True:
        system("cls")
        print(f"{decoration*20}-")
        print("               Open Folder               ")
        print(f"{decoration*20}-")
        print("0 - Go back")
        print("1 - Music Folder")
        print("2 - Video Folder")
        print("3 - Temp Folder")
        print(f"{decoration*20}-")

        opcao = input("-> ")
        folder_actions = {
            "1": dirmanager.open_music_dir,
            "2": dirmanager.open_video_dir,
            "3": dirmanager.open_temp_dir,
        }

        if opcao == "0" or opcao == "":
            break
        elif opcao in folder_actions:
            folder_actions[opcao]()
        else:
            print("Opção inválida. Tente novamente!")


def home():
    while True:

        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Vimp CLI               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Exit")
        print("1 - Download Video")
        print("2 - Download Music")
        print("3 - Download Music from Playlist")
        print("4 - Download Video from Playlist")
        print("5 - Download Thumbnail")
        print("6 - Folder Navigation")
        print("-+" * 20)

        opcao = input("-> ")

        if opcao == "1":
            video_mode()
        elif opcao == "2":
            music_mode()
        elif opcao == "3":
            list_music()
        elif opcao == "4":
            list_video()
        elif opcao == "5":
            thumb_mode()
        elif opcao == "6":
            folder_mode()
        elif opcao == "0" or opcao == "":
            break
        else:
            print("Opção inválida. Tente novamente!")


if __name__ == "__main__":
    home()
