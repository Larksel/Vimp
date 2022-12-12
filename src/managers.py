import os

import music_tag


class FileManager:
    def set_audio_metadata(audiofile, titulo, thumbImg):
        file = music_tag.load_file(audiofile)

        file['album'] = titulo
        with open(thumbImg, 'rb') as img:
            file['artwork'] = img.read()
        file['tracktitle'] = titulo

        file.save()

    # Removes every non supported character from the filename
    def format_filename(filename):
        blacklist = set(".'?*,<;>|:\/" + '"')
        for ch in filename:
            if ch in blacklist:
                filename = filename.replace(ch, "")
        return filename

    def remove_tempfile(file):
        if os.path.exists(file):
            os.remove(file)    


class DirManager:
    def make_dir(dir):
        if not os.path.exists(dir):
            os.mkdir(dir)

    def remove_dir(dir):
        if os.path.exists(dir):
            os.rmdir(dir)


class DependenciesManager:
    pass

