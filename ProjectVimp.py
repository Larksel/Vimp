from pytube import YouTube
from moviepy.editor import *
import os
from tkinter import *
from threading import Thread
from time import sleep

from Downloader import Music

userfolder = os.path.expanduser("~")
tempfolder = userfolder + "/Documents/Vimp Temp/"
musicfolder = userfolder + "/Desktop/Vimp Music/"

class Application:
    def __init__(self, master=None):
        self.fontePadrao = ("Arial", 10)

        # Titulo
        self.topo = Frame(master)
        self.topo["pady"] = 20
        self.topo.pack(fill="x")

        self.titulo = Label(self.topo, text="Project Vimp")
        self.titulo["font"] = ("Arial", 28, "bold")
        self.titulo.pack()

        # Link
        self.link = Frame(master)
        self.link.pack(expand=1)

        self.linkcontainer = Frame(self.link)
        self.linkcontainer.pack()

        self.linkLabel = Label(self.linkcontainer, text="Link:", font=self.fontePadrao)
        self.linkLabel.pack(side="left")

        self.linkbox = Entry(self.linkcontainer, font=self.fontePadrao)
        self.linkbox["width"] = 60
        self.linkbox.pack(side="left")

        # botao
        self.botaocontainer = Frame(self.link)
        self.botaocontainer["pady"] = 10
        self.botaocontainer.pack(side="bottom", fill="x")

        self.botaolink = Button(self.botaocontainer, font=self.fontePadrao)
        self.botaolink["text"] = "Baixar"
        self.botaolink["command"] = self.iniciarVimp
        self.botaolink.pack()

        self.statuslabel = Label(self.botaocontainer, text="", font=self.fontePadrao)
        self.statuslabel.pack()

    def iniciarVimp(self):
        tarefa = Thread(target=self.Vimp)
        tarefa.start()
        tarefa.join

    def Vimp(self):
        link = self.linkbox.get()
        yt = YouTube(link)
        self.statuslabel["text"] = f"Downloading: {yt.title}"
        self.linkbox.delete(0,"end")

        Music(link)

        self.statuslabel["text"] = "Done"
        sleep(1)
        self.statuslabel["text"] = ""  

root = Tk()
root.title("Project Vimp")
Application(root)
root.mainloop()
