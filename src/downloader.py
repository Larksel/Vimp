from os import path
import urllib.request

from pytube import YouTube, Playlist
from pytube.cli import on_progress

from .managers import DirManager, FileManager
from .converter import Converter


USER_FOLDER = path.expanduser("~")
tempfolder = USER_FOLDER + "/Documents/Vimp Temp/"
musicfolder = USER_FOLDER + "/Desktop/Vimp Music/"
videofolder = USER_FOLDER + "/Desktop/Videos"

# Downloads the video's thumbnail image
def get_thumbnail(title, link):
	opener = urllib.request.build_opener()
	opener.addheaders=[("User-Agent","Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1941.0 Safari/537.36")]
	urllib.request.install_opener(opener)

	filename = tempfolder + f"{title}.jpg"
	image_url = link

	urllib.request.urlretrieve(image_url, filename)

# Downloads the highest (max 720p) resolution of the video.
def get_video(link):
	yt = YouTube(link, on_progress_callback=on_progress)
	print(f"Downloading: {yt.title}")

	DirManager.make_dir(videofolder)

	video = yt.streams.get_highest_resolution()
	video.download(videofolder)

# Downloads and converts the video in music with album art.
def get_music(link):
	yt = YouTube(link, on_progress_callback=on_progress)
	video_title = yt.title
	formatted_title = FileManager.format_filename(video_title)

	# Download the video and the thumbnail to a temp file
	print(f"Downloading: {video_title}")
	DirManager.make_dir(tempfolder)

	get_thumbnail(formatted_title, yt.thumbnail_url)
	thumbnail_image = tempfolder + f"{formatted_title}.jpg"

	video = yt.streams.get_lowest_resolution()
	video.download(tempfolder)

	# Convert to mp3
	DirManager.make_dir(musicfolder)

	mp4_file = tempfolder + f"{formatted_title}.mp4"
	mp3_file = musicfolder + f"{formatted_title}.mp3"
	Converter.video_to_audio(mp4_file, mp3_file)
	FileManager.set_audio_metadata(mp3_file, video_title, thumbnail_image)

	FileManager.remove_tempfile(mp4_file)
	FileManager.remove_tempfile(thumbnail_image)

# Downloads every music from a playlist.
def get_music_playlist(playlist):
	pl = Playlist(playlist)

	print(f"Downloading {pl.length} audios from {pl.title}")

	for url in pl.video_urls:
		get_music(url)

# Downloads every video from a playlist.
def get_video_playlist(playlist):
	pl = Playlist(playlist)

	print(f"Downloading {pl.length} videos from {pl.title}")

	for url in pl.video_urls:
		get_video(url)
