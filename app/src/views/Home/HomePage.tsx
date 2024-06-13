import { useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { RootLoaderData } from '@/Root';

import CardList from '@/componentes/CardList/CardList';
import { Button } from '@/componentes/ui/button';

export default function HomePage() {
  const revalidator = useRevalidator();
  const { tracks } = useRouteLoaderData('root') as RootLoaderData;

  const recents = tracks //TODO ordenar por data
    .filter((track) => track.lastPlayed !== null)
  const favorites = tracks
    .filter((track) => track.favorite === true)
  const mostPlayed = tracks
    .filter((track) => track.playCount > 0)
    .sort((a, b) => b.playCount - a.playCount)

  const forceScan = async () => {
    const pathsToScan = await window.VimpAPI.config.get('musicFolders');
    const trackPaths = await window.VimpAPI.library.scanTracks(pathsToScan);

    const tracksDB = await window.VimpAPI.library.importTracks(trackPaths);
    console.log(tracksDB);

    revalidator.revalidate();
  }

  return (
    <div className='space-y-10'>
      {recents.length > 0 && (
        <div>
          <h1>Músicas recentes</h1>
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
      {tracks.length > 0 && (
        <div>
          <h1>Aleatórias</h1>
          <CardList max={10} data={tracks} />
        </div>
      )}
      {recents.length === 0 &&
        favorites.length === 0 &&
        mostPlayed.length === 0 &&
        tracks.length === 0 && (
          <div className='flex flex-col h-80 items-center justify-center text-neutral-400 space-y-4'>
            <h1>Sua biblioteca está vazia</h1>
            <Button variant={'outline'} onClick={forceScan}>
              Escanear arquivos
            </Button>
          </div>
        )}
    </div>
  );
}
