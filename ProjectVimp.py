from pytube import YouTube
from moviepy.editor import *
import os
from tkinter import *
from threading import Thread
from time import sleep

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

        # Download the video to a temp file
        self.statuslabel["text"] = f"Downloading: {yt.title}"
        print(f"Downloading: {yt.title}")
        video = yt.streams.get_lowest_resolution()
        video.download(os.path.expanduser("~") + "/Documents/Vimp Temp")

        # Convert to mp3

        self.statuslabel["text"] = "Converting to mp3..."
        def FormatFilename(filename):
            blacklist = set(".',|:\/" + '"')
            for ch in filename:
                if ch in blacklist:
                    filename = filename.replace(ch, "")
            return filename

        mp4_file = os.path.expanduser("~") + "/Documents/Vimp Temp/" + FormatFilename(f"{yt.title}") + ".mp4"
        mp3_file = os.path.expanduser("~") + "/Desktop/Vimp Music/" + FormatFilename(f"{yt.title}") + ".mp3"

        videoclip = VideoFileClip(mp4_file)
        audioclip = videoclip.audio
        audioclip.write_audiofile(mp3_file)
        audioclip.close()
        videoclip.close()

        # Remove temp files

        if os.path.exists(mp4_file):
            os.remove(mp4_file)    

        self.statuslabel["text"] = "Done"
        sleep(1)
        self.statuslabel["text"] = ""  

root = Tk()
root.title("Project Vimp")
Application(root)
root.mainloop()
