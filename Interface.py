from customtkinter import *
from PIL import Image

set_appearance_mode("dark")  # Modes: system (default), light, dark
set_default_color_theme("blue")  # Themes: blue (default), dark-blue, green

img_size = (240, 160)

class App(CTk):
    def __init__(self):
        super().__init__()
        
        self.title("Project Vimp")
        self.geometry(f"{950}x{600}")
        self.grid_columnconfigure((0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11), weight=1)
        self.grid_rowconfigure((0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11), weight=0)

        self.grid_columnconfigure((0, 11), weight=0)
        
        self.placeholderImg = CTkImage(Image.open("images/placeholder.png"), size=img_size)
        self.font = CTkFont(family="Poppins")

        self.menu = CTkFrame(self)
        self.menu.grid(row=0, column=0, padx=0, pady=0, sticky="nsew", rowspan=12)

        self.gap = CTkFrame(self)
        self.gap.grid(row=0, column=11, padx=0, pady=0, sticky="nsew", rowspan=12)

        self.apptitle = CTkLabel(self, text="Project Vimp", font=self.font)
        self.apptitle.grid(row=0, column=1, padx=10, pady=20, sticky="nsew", columnspan=10)
        self.apptitle.cget("font").configure(size=36)


        self.linkbox = CTkEntry(self, placeholder_text="Enter link here...")
        self.linkbox.grid(row=1, column=1, padx=20, pady=20, sticky="ew", columnspan=10)

        self.thumbbox = CTkLabel(self, text="", image=self.placeholderImg)
        self.thumbbox.grid(row=2, column=2, padx=(10, 20), pady=10, sticky="nsew", columnspan=2, rowspan=3)

        self.titlebox = CTkEntry(self, placeholder_text="Titulo")
        self.titlebox.grid(row=2, column=4, padx=(20, 10), pady=10, sticky="ew", columnspan=5)

        self.modebox = CTkEntry(self, placeholder_text="Modo")
        self.modebox.grid(row=3, column=4, padx=(20, 10), pady=10, sticky="ew", columnspan=5)

        self.qualitybox = CTkEntry(self, placeholder_text="Qualidade")
        self.qualitybox.grid(row=4, column=4, padx=(20, 10), pady=10, sticky="ew", columnspan=5)

    def update_img(self):
        image = CTkImage(Image.open("images/selected.png"), size=img_size)
        self.thumbbox.image = image


if __name__ == "__main__":
    app = App()
    app.mainloop()