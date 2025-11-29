import { useMemo } from 'react';
import CardList from '@renderer/components/CardList';
import EmptyLibrary from '@renderer/components/EmptyLibrary';
import { sortUtils } from '@shared/utils/sortUtils';
import useLibraryStore from '@renderer/stores/useLibraryStore';

export default function HomeView() {
  const tracks = useLibraryStore((state) => state.contents.tracks);
  const loading = useLibraryStore((state) => state.loading);

  const recents = useMemo(
    () => sortUtils.sortByDate(tracks, 'lastPlayed', 'desc'),
    [tracks],
  );
  const recentlyModified = useMemo(
    () => sortUtils.sortByDate(tracks, 'dateModified', 'desc'),
    [tracks],
  );
  const favorites = useMemo(
    () => sortUtils.sortByDate(tracks, 'dateFavorited', 'desc'),
    [tracks],
  );
  const mostPlayed = useMemo(
    () => sortUtils.sortByNumber(tracks, 'playCount', 'desc', true),
    [tracks],
  );
  const recentlyAdded = useMemo(
    () => sortUtils.sortByDate(tracks, 'dateAdded', 'desc'),
    [tracks],
  );

  const sections = useMemo(() => [
    { title: 'Recentemente Tocadas', data: recents, max: 5 },
    { title: 'Favoritas', data: favorites, max: 5 },
    { title: 'Mais Tocadas', data: mostPlayed, max: 5 },
    { title: 'Recentemente Modificadas', data: recentlyModified, max: 5 },
    { title: 'Recentemente Adicionadas', data: recentlyAdded, max: 10 },
  ], [recents, favorites, mostPlayed, recentlyModified, recentlyAdded]);

  if (loading.playlists || loading.tracks) {
    return (
      <div className='flex items-center justify-center'>Carregando...</div>
    );
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      {sections.map(({ title, data, max }) => 
        data.length > 0 && (
          <div key={title}>
            <h3 className='text-text-primary mb-2 font-semibold capitalize'>
              {title}
            </h3>
            <CardList max={max} data={data} />
          </div>
        )
      )}
      {tracks.length === 0 && <EmptyLibrary viewName='HomeView' />}
    </div>
  );
}
