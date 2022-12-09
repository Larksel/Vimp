import music_tag
import os

def SetMetaData(mp3_file, tituloVideo, thumbPath):
	file = music_tag.load_file(mp3_file)

	file['album'] = tituloVideo
	with open(thumbPath, 'rb') as img:
		file['artwork'] = img.read()
	file['tracktitle'] = tituloVideo

	file.save()

# Function to remove every non supported character from the filename
def formatFilename(filename):
    blacklist = set(".'?*,<;>|:\/" + '"')
    for ch in filename:
        if ch in blacklist:
            filename = filename.replace(ch, "")
    return filename

def removeTemp(file):
    if os.path.exists(file):
        os.remove(file)