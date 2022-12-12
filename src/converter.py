from os import system


class Converter:
    def video_to_audio(videofile, audiofile):
        system(f'ffmpeg -y -i "{videofile}" "{audiofile}" -loglevel quiet -stats')

    def merge(videofile, audiofile):
        pass

