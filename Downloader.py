from pytube import YouTube, Playlist
from os import path, system
from GerenciaDiretorio import *


userfolder = path.expanduser("~")
tempfolder = userfolder + "/Documents/Vimp Temp/"
musicfolder = userfolder + "/Desktop/Vimp Music/"
videofolder = userfolder + "/Desktop/Videos"

# Function to download the highest resolution of the video
def Video(link):
	yt = YouTube(link)

	print(f"Título: {yt.title}")

	verificaDiretorio(videofolder)

	video = yt.streams.get_highest_resolution()
	video.download(videofolder)

# Function to download and convert the video in music
def Music(link):
	yt = YouTube(link)

	# Download the video to a temp file

	verificaDiretorio(tempfolder)

	print(f"Baixando: {yt.title}")
	video = yt.streams.get_lowest_resolution()
	video.download(tempfolder)

	# Convert to mp3

	verificaDiretorio(musicfolder)

	mp4_file = tempfolder + formatFilename(f"{yt.title}") + ".mp4"
	mp3_file = musicfolder + formatFilename(f"{yt.title}") + ".mp3"

	system(f'ffmpeg -y -i "{mp4_file}" "{mp3_file}" -loglevel quiet -stats')

	# Remove temp files and finish

	removeTemp(mp4_file)

# Function to download every video from a playlist
def MusicPlaylist(playlist):
	p = Playlist(playlist)

	print(f"Downloading {p.length} videos from {p.title}")

	for url in p.video_urls:
		Music(url)

def VideoPlaylist(playlist):
	p = Playlist(playlist)

	print(f"Downloading {p.length} videos from {p.title}")

	for url in p.video_urls:
		Video(url)

if __name__ == "__main__":
	Music("https://www.youtube.com/watch?v=63hoSNvS6Z4")