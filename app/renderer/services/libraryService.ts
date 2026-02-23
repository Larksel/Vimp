export const LibraryService = {
  scanFolders: async (paths?: string[]) => {
    await window.VimpAPI.library.scanAndSave(paths);
  },
};
