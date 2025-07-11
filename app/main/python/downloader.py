import urllib.request

from pytubefix import YouTube, Playlist
from pytubefix.cli import on_progress

if __name__ != "__main__":
    from .managers import DirManager, FileManager
    from .converter import Converter

    dirmanager = DirManager()


class Downloader:
    def __init__(self, link: str) -> None:
        # Carrega todos os atributos necessarios
        self.link = link

        self.yt = YouTube(self.link, on_progress_callback=on_progress)
        if "&list=" in self.link:
            try:
                self.pl = Playlist(self.link)
                self.pl_list = self.pl.video_urls
                self.pl_length = self.pl.length
                self.pl_title = self.pl.title
            except:
                ind = self.link.find("&list=")
                if ind != -1:
                    self.link = self.link.replace(self.link[ind:], "")
                else:
                    print("Não foi possível alcançar o link do vídeo")

        self.title = self.yt.title
        self.formatted_title = FileManager.format_filename(self.title)
        self.thumbnail_url = self.yt.thumbnail_url
        self.thumbnail_path = dirmanager.TEMP_FOLDER + f"{self.formatted_title}.jpg"

    def get_thumbnail(self) -> None:
        opener = urllib.request.build_opener()
        opener.addheaders = [
            (
                "User-Agent",
                "Mozilla/5.0 (Windows NT 6.1; WOW64) "
                + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1941.0 Safari/537.36",
            )
        ]
        urllib.request.install_opener(opener)

        image_url = self.thumbnail_url

        urllib.request.urlretrieve(image_url, self.thumbnail_path)

    # TODO pegar vídeo com base na resolução passada
    # Downloads the highest (max 720p) resolution of the video.
    def get_video(self) -> None:
        print(f"Downloading: {self.title}")

        dirmanager.make_dir(dirmanager.VIDEO_FOLDER)

        video = self.yt.streams.get_highest_resolution()
        if video is not None:
            video.download(dirmanager.VIDEO_FOLDER)

    def get_music(self) -> None:
        print(f"Downloading: {self.title}")
        dirmanager.make_dir(dirmanager.TEMP_FOLDER)

        video = self.yt.streams.get_audio_only()

        if video is None:
            return

        mp4_file = dirmanager.TEMP_FOLDER + f"{self.formatted_title}.mp4"
        mp3_file = dirmanager.MUSIC_FOLDER + f"{self.formatted_title}.mp3"

        self.get_thumbnail()

        video.download(dirmanager.TEMP_FOLDER, f"{self.formatted_title}.mp4")

        # Convert to mp3
        dirmanager.make_dir(dirmanager.MUSIC_FOLDER)

        Converter.video_to_audio(mp4_file, mp3_file)
        FileManager.set_audio_metadata(mp3_file, self.title, self.thumbnail_path)

        # Clean temp files
        FileManager.remove_tempfile(mp4_file)
        FileManager.remove_tempfile(self.thumbnail_path)

    # Downloads every music from a playlist.
    def get_music_from_playlist(self) -> None:
        print(f"Downloading {self.pl_length} audios from {self.pl_title}")

        for url in self.pl_list:
            downloader = Downloader(url)
            downloader.get_music()

    # Downloads every video from a playlist.
    def get_video_from_playlist(self) -> None:
        print(f"Downloading {self.pl_length} videos from {self.pl_title}")

        for url in self.pl_list:
            downloader = Downloader(url)
            downloader.get_video()


if __name__ == "__main__":
    from managers import DirManager, FileManager
    from converter import Converter

    dirmanager = DirManager()

    # Test code goes here
