from pytube import YouTube
from sys import argv
from moviepy.editor import *
import os

# Download the video to a temp file

link = argv[1]
yt = YouTube(link)

print(f"Downloading: {yt.title}")

video = yt.streams.get_lowest_resolution()
video.download("C:/Users/Lemuel/Documents/Vimp Temp")

# Convert to mp3

def FormatFilename(filename):
  blacklist = set(".',|:\/")
  for ch in filename:
    if ch in blacklist:
      filename = filename.replace(ch, "")
  return filename

mp4_file = "C:/Users/Lemuel/Documents/Vimp Temp/" + FormatFilename(f"{yt.title}") + ".mp4"
mp3_file = "C:/Users/Lemuel/Desktop/Music/Vimp Music/" + FormatFilename(f"{yt.title}") + ".mp3"

videoclip = VideoFileClip(mp4_file)
audioclip = videoclip.audio
audioclip.write_audiofile(mp3_file)
audioclip.close()
videoclip.close()

# Remove temp files

if os.path.exists(mp4_file):
  os.remove(mp4_file)
else:
  print("The file does not exist")
