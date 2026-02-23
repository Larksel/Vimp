export const libraryService = {
  scanFolders: async (paths?: string[]) => {
    await window.VimpAPI.library.scanAndSave(paths);
  },
};
