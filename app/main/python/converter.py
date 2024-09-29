from moviepy.editor import AudioFileClip


class Converter:
    @staticmethod
    def video_to_audio(videofile, audiofile):
        mp4 = AudioFileClip(videofile)
        mp4.write_audiofile(audiofile)
        mp4.close()
