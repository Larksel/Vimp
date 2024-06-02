import CardList from '@/componentes/CardList/CardList';
import { useRouteLoaderData } from 'react-router-dom';
import { RootLoaderData } from '@/Root';

export default function HomePage() {
  const { tracks } = useRouteLoaderData('root') as RootLoaderData;

  const recents = tracks //TODO ordenar por data
    .filter((track) => track.lastPlayed !== null)
    .slice(0, 7);
  const favorites = tracks
    .filter((track) => track.favorite === true)
    .slice(0, 7);
  const mostPlayed = tracks
    .filter((track) => track.playCount > 0)
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 7);

  return (
    <div className='space-y-10'>
      {recents.length > 0 && (
        <div>
          <h1>Músicas recentes</h1>
          <CardList data={recents} />
        </div>
      )}
      {favorites.length > 0 && (
        <div>
          <h1>Favoritas</h1>
          <CardList data={favorites} />
        </div>
      )}
      {mostPlayed.length > 0 && (
        <div>
          <h1>Mais tocadas</h1>
          <CardList data={mostPlayed} />
        </div>
      )}
      {recents.length === 0 &&
        favorites.length === 0 &&
        mostPlayed.length === 0 && (
          <div className='flex h-80 items-center justify-center text-neutral-400'>
            Sua biblioteca está vazia
          </div>
        )}
    </div>
  );
}
