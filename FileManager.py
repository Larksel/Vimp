import music_tag
import os

def SetMetaData(audiofile, titulo, thumbImg):
	file = music_tag.load_file(audiofile)

	file['album'] = titulo
	with open(thumbImg, 'rb') as img:
		file['artwork'] = img.read()
	file['tracktitle'] = titulo

	file.save()

# Removes every non supported character from the filename
def formatFilename(filename):
    blacklist = set(".'?*,<;>|:\/" + '"')
    for ch in filename:
        if ch in blacklist:
            filename = filename.replace(ch, "")
    return filename

def removeTemp(file):
    if os.path.exists(file):
        os.remove(file)