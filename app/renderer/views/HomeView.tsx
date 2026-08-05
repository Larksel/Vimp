import { useMemo } from 'react';
import CardList from '@renderer/components/CardList';
import EmptyLibrary from '@renderer/components/EmptyLibrary';
import { sortUtils } from '@shared/utils/sortUtils';
import useLibraryStore from '@renderer/stores/useLibraryStore';

export default function HomeView() {
  const audio = useLibraryStore((state) => state.contents.audio);
  const loading = useLibraryStore((state) => state.loading);

  const recents = useMemo(
    () => sortUtils.sortByDate(audio, 'lastPlayedAt', 'desc'),
    [audio],
  );
  const recentlyModified = useMemo(
    () => sortUtils.sortByDate(audio, 'modifiedAt', 'desc'),
    [audio],
  );
  const favorites = useMemo(
    () => sortUtils.sortByDate(audio, 'favoritedAt', 'desc'),
    [audio],
  );
  const mostPlayed = useMemo(
    () => sortUtils.sortByNumber(audio, 'playCount', 'desc', true),
    [audio],
  );
  const recentlyAdded = useMemo(
    () => sortUtils.sortByDate(audio, 'createdAt', 'desc'),
    [audio],
  );

  const sections = useMemo(
    () => [
      { title: 'Recentemente Tocadas', data: recents, max: 5 },
      { title: 'Favoritas', data: favorites, max: 5 },
      { title: 'Mais Tocadas', data: mostPlayed, max: 5 },
      { title: 'Recentemente Modificadas', data: recentlyModified, max: 5 },
      { title: 'Recentemente Adicionadas', data: recentlyAdded, max: 10 },
    ],
    [recents, favorites, mostPlayed, recentlyModified, recentlyAdded],
  );

  if (loading.playlists || loading.audio) {
    return (
      <div className='flex items-center justify-center'>Carregando...</div>
    );
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      {sections.map(
        ({ title, data, max }) =>
          data.length > 0 && (
            <div key={title}>
              <h3 className='text-text-primary mb-2 font-semibold capitalize'>
                {title}
              </h3>
              <CardList max={max} data={data} />
            </div>
          ),
      )}
      {audio.length === 0 && <EmptyLibrary viewName='HomeView' />}
    </div>
  );
}
