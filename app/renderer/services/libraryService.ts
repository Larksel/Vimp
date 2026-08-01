export const libraryService = {
  scanFolders: async (paths?: string[]): Promise<void> => {
    await window.VimpAPI.library.scanAndSave(paths);
  },
};
