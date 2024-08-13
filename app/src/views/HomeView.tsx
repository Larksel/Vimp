import { useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { RootLoaderData } from '@/views/RootView';

import CardList from '@/componentes/CardList/CardList';
import { Button } from '@/componentes/ui/button';

export default function HomeView() {
  const revalidator = useRevalidator();
  const { tracks } = useRouteLoaderData('root') as RootLoaderData;

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

  const favorites = tracks.filter((track) => track.favorite === true);

  const mostPlayed = tracks
    .filter((track) => track.playCount > 5)
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
    const pathsToScan = await window.VimpAPI.config.get('musicFolders');
    const trackPaths = await window.VimpAPI.library.scanTracks(pathsToScan);

    const tracksDB = await window.VimpAPI.library.importTracks(trackPaths);
    console.log(tracksDB);

    revalidator.revalidate();
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
        <div className='flex h-80 flex-col items-center justify-center space-y-4 text-neutral-400'>
          <h1>Sua biblioteca está vazia</h1>
          <Button variant={'outline'} onClick={forceScan}>
            Escanear arquivos
          </Button>
        </div>
      )}
    </div>
  );
}
