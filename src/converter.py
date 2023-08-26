from os import system


class Converter:
    @staticmethod
    def video_to_audio(videofile, audiofile):
        system(f'ffmpeg -y -i "{videofile}" "{audiofile}" -loglevel quiet -stats')

    @staticmethod
    def merge(videofile, audiofile):
        pass
