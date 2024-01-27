import { ipcMain } from 'electron';
import { TracksDB } from '../db';
import { Track, TrackModel } from '../../shared/types/vimp';

//TODO canais ipc em constantes em um arquivo
export default function setupIPCDatabase() {
  // * CRUD operations

  ipcMain.handle('insertMany', async (_, tracks: Track[]) => {
    await TracksDB.insertMany(tracks)
  })
  
  ipcMain.handle('getTracks', async () => {
    return TracksDB.getAll()
  })

  ipcMain.handle('updateTrack', async (_, track: TrackModel) => {
    return TracksDB.update(track)
  })

  ipcMain.handle('deleteTrack', async (_, trackID: string) => {
    await TracksDB.delete(trackID)
  })

  // * Getter functions

  ipcMain.handle('getById', async (_, trackID: string) => {
    return TracksDB.getById(trackID)
  })

  ipcMain.handle('getByPath', async (_, trackPath: string) => {
    return TracksDB.getByPath(trackPath)
  })

  // * Features
  
  ipcMain.handle('incrementPlayCount', async (_, track: TrackModel) => {
    await TracksDB.incrementPlayCount(track)
  })

  ipcMain.handle('updateFavorite', async (_, track: TrackModel) => {
    await TracksDB.updateFavorite(track)
  })

  ipcMain.handle('updateLastPlayed', async (_, track: TrackModel) => {
    await TracksDB.updateLastPlayed(track)
  })
  
  // * Helpers 
  
  ipcMain.handle('clearTracks', async () => {
    await TracksDB.clear()
  })
}