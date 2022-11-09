from pytube import YouTube, Playlist
from moviepy.editor import *
import os.path
from GerenciaDiretorio import *

userfolder = os.path.expanduser("~")
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

