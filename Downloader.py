from pytube import YouTube
from moviepy.editor import *
import os.path
from GerenciaDiretorio import formatFilename, removeTemp, verificaDiretorio
from time import sleep

userfolder = os.path.expanduser("~")
tempfolder = userfolder + "/Documents/Vimp Temp/"
musicfolder = userfolder + "/Desktop/Vimp Music/"
videofolder = userfolder + "/Desktop/Videos"


def Video(link):
	yt = YouTube(link)

	print(f"Título: {yt.title}")

	verificaDiretorio(videofolder)

	video = yt.streams.get_highest_resolution()
	video.download(videofolder)

def Music(link):
	yt = YouTube(link)

	# Download the video to a temp file

	verificaDiretorio(tempfolder)

	print(f"Título: {yt.title}")
	video = yt.streams.get_lowest_resolution()
	video.download(tempfolder)

	# Convert to mp3

	verificaDiretorio(musicfolder)

	mp4_file = tempfolder + formatFilename(f"{yt.title}") + ".mp4"
	mp3_file = musicfolder + formatFilename(f"{yt.title}") + ".mp3"

	videoclip = VideoFileClip(mp4_file)
	audioclip = videoclip.audio
	audioclip.write_audiofile(mp3_file)
	audioclip.close()
	videoclip.close()

	# Remove temp files and finish

	removeTemp(mp4_file)