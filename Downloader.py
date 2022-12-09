from pytube import YouTube, Playlist
from os import path
from DirManager import *
from Converter import *
from FileManager import *
import urllib.request

userfolder = path.expanduser("~")
tempfolder = userfolder + "/Documents/Vimp Temp/"
musicfolder = userfolder + "/Desktop/Vimp Music/"
videofolder = userfolder + "/Desktop/Videos"


def GetThumbnail(title, link):
	opener = urllib.request.build_opener()
	opener.addheaders=[("User-Agent","Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1941.0 Safari/537.36")]
	urllib.request.install_opener(opener)

	filename = tempfolder + f"{title}.jpg"
	image_url = link

	urllib.request.urlretrieve(image_url, filename)

# Downloads the highest resolution of the video
def Video(link):
	yt = YouTube(link)

	print(f"Título: {yt.title}")

	adicionaDiretorio(videofolder)

	video = yt.streams.get_highest_resolution()
	video.download(videofolder)

# Function to download and convert the video in music
def Music(link):
	yt = YouTube(link)
	tituloVideo = yt.title
	urlThumbnail = yt.thumbnail_url

	# Download the video to a temp file
	adicionaDiretorio(tempfolder)

	print(f"Baixando: {tituloVideo}")

	GetThumbnail(tituloVideo, urlThumbnail)
	thumbPath = tempfolder + f"{tituloVideo}.jpg"

	video = yt.streams.get_lowest_resolution()
	video.download(tempfolder)

	# Convert to mp3
	adicionaDiretorio(musicfolder)

	mp4_file = tempfolder + formatFilename(f"{tituloVideo}") + ".mp4"
	mp3_file = musicfolder + formatFilename(f"{tituloVideo}") + ".mp3"
	VideoToAudio(mp4_file, mp3_file)

	SetMetaData(mp3_file, tituloVideo, thumbPath)

	removeTemp(mp4_file)
	removeTemp(thumbPath)

# Function to download every music from a playlist
def MusicPlaylist(playlist):
	p = Playlist(playlist)

	print(f"Downloading {p.length} videos from {p.title}")

	for url in p.video_urls:
		Music(url)

# Function to download every video from a playlist
def VideoPlaylist(playlist):
	p = Playlist(playlist)

	print(f"Downloading {p.length} videos from {p.title}")

	for url in p.video_urls:
		Video(url)

if __name__ == "__main__":
	Music("https://www.youtube.com/watch?v=59r6sluvqo4&list=PLExP5Z-pht115Ca1PhsosERNvtgt4yx1m&index=1")