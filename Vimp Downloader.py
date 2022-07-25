from pytube import YouTube
from sys import argv

link = argv[1]
yt = YouTube(link)

print(f"Título: {yt.title}")

video = yt.streams.get_highest_resolution()
video.download("C:/Users/Lemuel/Desktop/Videos")
