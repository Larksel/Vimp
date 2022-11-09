import Downloader
from os import startfile, path, system

def VideoMode():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Download Video               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Cancel")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        Downloader.Video(link)

def MusicMode():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Download Music               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Cancel")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        Downloader.Music(link)

def ListMusic():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Download Music from Playlist               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Cancel")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        Downloader.MusicPlaylist(link)

def ListVideo():
    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Download Video from Playlist               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Cancel")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        link = input("Link: -> ")
        if link == "0" or link == "":
            break
        Downloader.VideoPlaylist(link)

def FolderMode():
    userFolder = path.expanduser("~")

    while True:
        system("cls")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("               Open Folder               ")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        print("0 - Cancel")
        print("1 - Music Folder")
        print("2 - Video Folder")
        print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")

        opcao = input("-> ")
        if opcao == "1":
            startfile(userFolder + r"\Desktop\Vimp Music")
        elif opcao == "2":
            startfile(userFolder + r"\Desktop\Videos")
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
        print("0 - Cancel")
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
