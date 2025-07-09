import os

import music_tag


class FileManager:
    @staticmethod
    def set_audio_metadata(file_path: str, title: str, img_path: str) -> None:
        audio_file = music_tag.load_file(file_path)

        audio_file["album"] = title
        with open(img_path, "rb") as img:
            audio_file["artwork"] = img.read()
        audio_file["tracktitle"] = title

        audio_file.save()

    # TODO use regex
    # Removes every non-supported character from the filename
    @staticmethod
    def format_filename(filename: str) -> str:
        blacklist = set("?*<>|:\\/" + '"')
        for ch in filename:
            if ch in blacklist:
                filename = filename.replace(ch, "")
        return filename

    @staticmethod
    def remove_tempfile(file: str) -> None:
        if os.path.exists(file):
            os.remove(file)


class DirManager:
    def __init__(self):
        self.USER_FOLDER = os.path.expanduser("~")
        self.TEMP_FOLDER = self.USER_FOLDER + "/Documents/Vimp Temp/"
        self.MUSIC_FOLDER = self.USER_FOLDER + "/Desktop/Vimp Music/"
        self.VIDEO_FOLDER = self.USER_FOLDER + "/Desktop/Vimp Videos/"

    @staticmethod
    def make_dir(dir: str) -> None:
        if not os.path.exists(dir):
            os.mkdir(dir)

    @staticmethod
    def remove_dir(dir: str) -> None:
        if os.path.exists(dir):
            os.rmdir(dir)

    def open_music_dir(self) -> None:
        os.startfile(self.MUSIC_FOLDER)

    def open_video_dir(self) -> None:
        os.startfile(self.VIDEO_FOLDER)

    def open_temp_dir(self) -> None:
        os.startfile(self.TEMP_FOLDER)
