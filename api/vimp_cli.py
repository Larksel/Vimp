from os import system

from modules.downloader import Downloader
from modules.managers import DirManager


class VimpCLI:
    def __init__(self) -> None:
        self.dirmanager = DirManager()

    def VideoMode(self):
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

    def MusicMode(self):
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

    def ListMusic(self):
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
            downloader.get_music_from_playlist()

    def ListVideo(self):
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
            downloader.get_video_from_playlist()

    def ThumbMode(self):
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

    def FolderMode(self):
        while True:
            system("cls")
            print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
            print("               Open Folder               ")
            print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
            print("0 - Go back")
            print("1 - Music Folder")
            print("2 - Video Folder")
            print("3 - Temp Folder")
            print("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")

            opcao = input("-> ")
            if opcao == "1":
                self.dirmanager.open_music_dir()
            elif opcao == "2":
                self.dirmanager.open_video_dir()
            elif opcao == "3":
                self.dirmanager.open_temp_dir()
            elif opcao == "0" or opcao == "":
                break
            else:
                print("Opção inválida. Tente novamente!")

    def Home(self):
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
                self.VideoMode()
            elif opcao == "2":
                self.MusicMode()
            elif opcao == "3":
                self.ListMusic()
            elif opcao == "4":
                self.ListVideo()
            elif opcao == "5":
                self.ThumbMode()
            elif opcao == "6":
                self.FolderMode()
            elif opcao == "0" or opcao == "":
                break
            else:
                print("Opção inválida. Tente novamente!")


if __name__ == "__main__":
    VimpCLI().Home()
