from customtkinter import *
from PIL import Image
from src.downloader import *

set_appearance_mode("dark")  # Modes: system (default), light, dark
set_default_color_theme("blue")  # Themes: blue (default), dark-blue, green


class ErrorWindow(CTkToplevel):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.geometry("400x100")

        self.label = CTkLabel(self, text_color="#f22", text="O arquivo da thumbnail nao foi encontrado.")
        self.label.pack(padx=20, pady=20)


class App(CTk):
    def __init__(self):
        super().__init__()
        
        self.title("Project Vimp")
        self.geometry(f"{950}x{600}")
        self.grid_columnconfigure((0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11), weight=1)
        self.grid_rowconfigure((0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11), weight=1)

        self.grid_columnconfigure((0, 11), weight=0)
        
        self.img_size = (240, 160)
        self.placeholderImg = CTkImage(Image.open("images/placeholder.png"), size=self.img_size)
        self.font = CTkFont(family="Poppins")
        self.error_window = None

        self.menu = CTkFrame(self)
        self.menu.grid(row=0, column=0, padx=0, pady=0, sticky="nsew", rowspan=12)

        self.gap = CTkFrame(self)
        self.gap.grid(row=0, column=11, padx=0, pady=0, sticky="nsew", rowspan=12)

        self.apptitle = CTkLabel(self, text="Project Vimp", font=self.font)
        self.apptitle.grid(row=0, column=1, padx=10, pady=20, sticky="nsew", columnspan=10)
        self.apptitle.cget("font").configure(size=36)

        self.linkbox = CTkEntry(self, placeholder_text="Insira o link aqui...")
        self.linkbox.grid(row=1, column=1, padx=20, pady=20, sticky="ew", columnspan=10)

        self.thumbbox = CTkLabel(self, text="", image=self.placeholderImg)
        self.thumbbox.grid(row=2, column=2, padx=(10, 20), pady=10, sticky="nsew", columnspan=2, rowspan=3)

        self.titlebox = CTkEntry(self, placeholder_text="Título")
        self.titlebox.grid(row=2, column=4, padx=(20, 10), pady=10, sticky="ew", columnspan=5)

        self.modebox = CTkComboBox(self, values=["Música", "Vídeo", "Playlist de Música", "Playlist de Vídeo"])
        self.modebox.grid(row=3, column=4, padx=(20, 10), pady=10, sticky="ew", columnspan=5)

        self.qualitybox = CTkComboBox(self, values=["720p"])
        self.qualitybox.grid(row=4, column=4, padx=(20, 10), pady=10, sticky="ew", columnspan=5)

        self.testbtn = CTkButton(self, text="Teste img", command=self.selected_thumb)
        self.testbtn.grid(row=5, column=5, padx=20, columnspan=2, sticky="nsew")

        self.testbtn = CTkButton(self, text="Download", command=self.download_handle)
        self.testbtn.grid(row=5, column=3, columnspan=2, sticky="nsew")


    def selected_thumb(self):
        get_thumbnail("selected", self.linkbox.get())
        self.update_img


    def update_img(self):
        try:
            self.img = CTkImage(Image.open(tempfolder + "selected.jpg"), size=self.img_size)
            self.thumbbox.configure(image=self.img)
        except FileNotFoundError:
            print("O arquivo da thumbnail nao foi encontrado.")
            if self.error_window is None or not self.error_window.winfo_exists():
                self.error_window = ErrorWindow(self)
            else:
                self.error_window.focus()
        finally:
            print("Tentativa de alterar imagem realizada")


    # ! parte das funcoes que pegam a info do video
    def get_video_quality(self):
        pass


    # ! Ainda falta arrumar o lag da parte visual
    def download_handle(self):
        link = self.linkbox.get()
        modo = self.modebox.get()

        self.linkbox.configure(text="")

        if modo == "Música":
            get_music(link)

        elif modo == "Vídeo":
            get_video(link)

        elif modo == "Playlist de Música":
            get_music_playlist(link)

        elif modo == "Playlist de Vídeo":
            get_video_playlist(link)


if __name__ == "__main__":
    app = App()
    app.mainloop()
