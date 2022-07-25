from moviepy.editor import *
from sys import argv

mp4_file = argv[1]
mp3_file = argv[2]

videoclip = VideoFileClip(mp4_file)
audioclip = videoclip.audio
audioclip.write_audiofile(mp3_file)
audioclip.close()
videoclip.close()
