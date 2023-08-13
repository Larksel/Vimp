from os import startfile, path, system

from src.downloader import Downloader
from src.managers import DirManager


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


def FolderMode():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Open Folder               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Go back")
        print("1 - Music Folder")
        print("2 - Video Folder")
        print("3 - Vimp Folder")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")

        opcao = input("-> ")
        if opcao == "1":
            DirManager.open_music_dir()
        elif opcao == "2":
            DirManager.open_video_dir()
        elif opcao == "3":
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
        print("5 - Folder Navigation")
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
            FolderMode()
        elif opcao == "0" or opcao == "":
            break
        else:
            print("Opção inválida. Tente novamente!")


Home()
