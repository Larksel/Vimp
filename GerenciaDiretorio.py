import os

def verificaDiretorio(dir):
    if not os.path.exists(dir):
        os.mkdir(dir)

def formatFilename(filename):
    blacklist = set(".',|:\/" + '"')
    for ch in filename:
        if ch in blacklist:
            filename = filename.replace(ch, "")
    return filename

def removeTemp(file):
    if os.path.exists(file):
        os.remove(file)