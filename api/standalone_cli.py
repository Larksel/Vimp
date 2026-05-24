#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path

from modules.managers import DirManager


def download_music(link: str, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        [
            "yt-dlp",
            "--no-mtime",
            "-x",
            "--audio-format",
            "mp3",
            "--embed-thumbnail",
            "--add-metadata",
            "--paths",
            str(output_dir),
            '-o %(title)s.%(ext)s',
            link,
        ],
        check=True,
    )


def main() -> int:
    music_dir = Path(DirManager().MUSIC_FOLDER).expanduser().resolve()

    while True:
        try:
            link = input("Link: ").strip()

            if not link:
                break

            download_music(link, music_dir)
            print("\n")
            print(f"Download finalizado em: {music_dir}")
            print("\n\n")
        except KeyboardInterrupt:
            print("\nEncerrando a aplicacao")
            break
        except FileNotFoundError:
            print("yt-dlp nao foi encontrado no PATH.", file=sys.stderr)
            return 1
        except subprocess.CalledProcessError as error:
            print(f"Falha ao baixar o audio: {error}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
