from os import startfile, system

from app.main.modules.downloader import Downloader
from app.main.modules.managers import DirManager


dirmanager = DirManager()


def VideoMode():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Download Video               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Go back")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        downloader = Downloader(link)
        downloader.get_video()


def MusicMode():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Download Music               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Go back")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        downloader = Downloader(link)
        downloader.get_music()


def ListMusic():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Download Music from Playlist               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Go back")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        downloader = Downloader(link)
        downloader.get_music_playlist()


def ListVideo():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Download Video from Playlist               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Go back")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        downloader = Downloader(link)
        downloader.get_video_playlist()


def ThumbMode():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("                     Download Thumbnail                     ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Go back")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        downloader = Downloader(link)
        downloader.get_thumbnail()


def FolderMode():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Open Folder               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Go back")
        print("1 - Music Folder")
        print("2 - Video Folder")
        print("3 - Temp Folder")
        print("4 - Vimp Folder")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")

        opcao = input("-> ")
        if opcao == "1":
            dirmanager.open_music_dir()
        elif opcao == "2":
            dirmanager.open_video_dir()
        elif opcao == "3":
            dirmanager.open_temp_dir()
        elif opcao == "4":
            startfile(dirmanager.USER_FOLDER + r"\Desktop\Vimp Project")
        elif opcao == "0" or opcao == "":
            break
        else:
            print("Opção inválida. Tente novamente!")


def Home():
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
            VideoMode()
        elif opcao == "2":
            MusicMode()
        elif opcao == "3":
            ListMusic()
        elif opcao == "4":
            ListVideo()
        elif opcao == "5":
            ThumbMode()
        elif opcao == "6":
            FolderMode()
        elif opcao == "0" or opcao == "":
            break
        else:
            print("Opção inválida. Tente novamente!")


if __name__ == "__main__":
    Home()
