import { app, BrowserWindow, Menu } from 'electron';
import createWindow from './mainWindow';


if (require('electron-squirrel-startup')) {
  app.quit();
}

Menu.setApplicationMenu(null)

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
