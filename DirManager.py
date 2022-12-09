import os

def adicionaDiretorio(dir):
    if not os.path.exists(dir):
        os.mkdir(dir)

def removeDiretorio(dir):
    if os.path.exists(dir):
        os.rmdir(dir)