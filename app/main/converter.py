import ffmpeg


class Converter:
    @staticmethod
    def video_to_audio(videofile, audiofile):
        (
            ffmpeg
            .input(videofile)
            .output(audiofile)
            .overwrite_output()
            .run(quiet=True)
        )

    @staticmethod
    def merge(videofile, audiofile):
        pass
