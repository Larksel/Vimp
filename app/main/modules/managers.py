import os

import music_tag


class FileManager:
    @staticmethod
    def set_audio_metadata(audiofile, titulo, thumbimg):
        file = music_tag.load_file(audiofile)

        file['album'] = titulo
        with open(thumbimg, 'rb') as img:
            file['artwork'] = img.read()
        file['tracktitle'] = titulo

        file.save()

    #TODO use regex
    # Removes every non-supported character from the filename
    @staticmethod
    def format_filename(filename):
        blacklist = set("?*<>|:\/" + '"')
        for ch in filename:
            if ch in blacklist:
                filename = filename.replace(ch, "")
        return filename

    @staticmethod
    def remove_tempfile(file):
        if os.path.exists(file):
            os.remove(file)


class DirManager:
    def __init__(self):
        self.USER_FOLDER = os.path.expanduser("~")
        self.tempfolder = self.USER_FOLDER + "/Documents/Vimp Temp/"
        self.musicfolder = self.USER_FOLDER + "/Desktop/Vimp Music/"
        self.videofolder = self.USER_FOLDER + "/Desktop/Vimp Videos/"

    @staticmethod
    def make_dir(dir):
        if not os.path.exists(dir):
            os.mkdir(dir)

    @staticmethod
    def remove_dir(dir):
        if os.path.exists(dir):
            os.rmdir(dir)

    def open_music_dir(self):
        os.startfile(self.musicfolder)

    def open_video_dir(self):
        os.startfile(self.videofolder)

    def open_temp_dir(self):
        os.startfile(self.tempfolder)


class DependenciesManager:
    pass
