import CardList from '@renderer/components/CardList';
import EmptyLibrary from '@renderer/components/EmptyLibrary';
import { sortUtils } from '@shared/utils/sortUtils';
import useLibraryStore from '@renderer/stores/useLibraryStore';

export default function HomeView() {
  const tracks = useLibraryStore((state) => state.contents.tracks);
  const loading = useLibraryStore((state) => state.loading);

  if (loading.playlists || loading.tracks) {
    return (
      <div className='flex items-center justify-center'>Carregando...</div>
    );
  }

  const recents = sortUtils.sortByDate(tracks, 'lastPlayed', 'desc');
  const recentlyModified = sortUtils.sortByDate(tracks, 'dateModified', 'desc');
  const favorites = sortUtils.sortByDate(tracks, 'dateFavorited', 'desc');
  const mostPlayed = sortUtils.sortByNumber(tracks, 'playCount', 'desc', true);
  const recentlyAdded = sortUtils.sortByDate(tracks, 'dateAdded', 'desc');

  return (
    <div className='flex flex-col gap-4 p-4'>
      {recents.length > 0 && (
        <div>
          <h3 className='text-text-primary mb-2 font-semibold capitalize'>
            Recentemente Tocadas
          </h3>
          <CardList max={5} data={recents} />
        </div>
      )}
      {favorites.length > 0 && (
        <div>
          <h3 className='text-text-primary mb-2 font-semibold capitalize'>
            Favoritas
          </h3>
          <CardList max={5} data={favorites} />
        </div>
      )}
      {mostPlayed.length > 0 && (
        <div>
          <h3 className='text-text-primary mb-2 font-semibold capitalize'>
            Mais Tocadas
          </h3>
          <CardList max={5} data={mostPlayed} />
        </div>
      )}
      {recentlyModified.length > 0 && (
        <div>
          <h3 className='text-text-primary mb-2 font-semibold capitalize'>
            Recentemente Modificadas
          </h3>
          <CardList max={5} data={recentlyModified} />
        </div>
      )}
      {recentlyAdded.length > 0 && (
        <div>
          <h3 className='text-text-primary mb-2 font-semibold capitalize'>
            Recentemente Adicionadas
          </h3>
          <CardList max={10} data={recentlyAdded} />
        </div>
      )}
      {tracks.length === 0 && <EmptyLibrary viewName='HomeView' />}
    </div>
  );
}
