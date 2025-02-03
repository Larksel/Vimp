import log from 'electron-log/renderer';

import CardList from '@components/CardList';
import { Button } from '@components/common/button';
import useLibraryStore from '@stores/useLibraryStore';

export default function HomeView() {
  const tracks = useLibraryStore((state) => state.contents.tracks);

  const recents = tracks
    .filter((track) => track.lastPlayed !== undefined)
    .toSorted((a, b) => {
      if (a.lastPlayed && b.lastPlayed) {
        return (
          new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
        );
      }
      return 0;
    });

  const favorites = tracks
    .filter((track) => track.favorite === true)
    .toSorted((a, b) => {
      if (a.dateFavorited && b.dateFavorited) {
        return (
          new Date(b.dateFavorited).getTime() -
          new Date(a.dateFavorited).getTime()
        );
      }
      return 0;
    });

  const mostPlayed = tracks
    .filter((track) => track.playCount > 0)
    .toSorted((a, b) => b.playCount - a.playCount);

  const recentlyAdded = tracks
    .filter((track) => track.dateAdded !== undefined)
    .toSorted((a, b) => {
      if (a.dateAdded && b.dateAdded) {
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      }
      return 0;
    });

  const forceScan = async () => {
    log.debug('[HomeView] Triggered library scan and save');
    const importedFiles = await window.VimpAPI.library.scanAndSave();
    console.log(importedFiles);
  };

  return (
    <div className='space-y-10'>
      {recents.length > 0 && (
        <div>
          <h1>Músicas recentemente tocadas</h1>
          <CardList max={5} data={recents} />
        </div>
      )}
      {favorites.length > 0 && (
        <div>
          <h1>Favoritas</h1>
          <CardList max={5} data={favorites} />
        </div>
      )}
      {mostPlayed.length > 0 && (
        <div>
          <h1>Mais tocadas</h1>
          <CardList max={5} data={mostPlayed} />
        </div>
      )}
      {recentlyAdded.length > 0 && (
        <div>
          <h1>Recentemente Adicionadas</h1>
          <CardList max={10} data={recentlyAdded} />
        </div>
      )}
      {tracks.length === 0 && (
        <div className='text-text-secondary flex h-80 flex-col items-center justify-center space-y-4'>
          <h1>Sua biblioteca está vazia</h1>
          <Button variant={'outline'} onClick={forceScan}>
            Escanear arquivos
          </Button>
        </div>
      )}
    </div>
  );
}
