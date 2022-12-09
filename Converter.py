from os import system


def VideoToAudio(videofile, audiofile):
    system(f'ffmpeg -y -i "{videofile}" "{audiofile}" -loglevel quiet -stats')

def Merge(videofile, audiofile):
    pass
