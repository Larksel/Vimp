import CardList from '@components/CardList';
import EmptyLibrary from '@components/EmptyLibrary';
import { sortUtils } from '@render-utils/sortUtils';
import { TrackModel } from '@shared/types/vimp';
import useLibraryStore from '@stores/useLibraryStore';

export default function HomeView() {
  const tracks = useLibraryStore((state) => state.contents.tracks);

  const recents = sortUtils.sortByDate<TrackModel>(
    tracks,
    'lastPlayed',
    'desc',
  );
  const favorites = sortUtils.sortByDate<TrackModel>(
    tracks,
    'dateFavorited',
    'desc',
  );
  const mostPlayed = sortUtils.sortByNumber<TrackModel>(
    tracks,
    'playCount',
    'desc',
    true,
  );
  const recentlyAdded = sortUtils.sortByDate<TrackModel>(
    tracks,
    'dateAdded',
    'desc',
  );

  return (
    <div className='flex flex-col gap-4 p-4'>
      {recents.length > 0 && (
        <div>
          <h3 className='text-text-primary mb-2 text-lg font-semibold capitalize'>
            Recentemente Tocadas
          </h3>
          <CardList max={5} data={recents} />
        </div>
      )}
      {favorites.length > 0 && (
        <div>
          <h3 className='text-text-primary mb-2 text-lg font-semibold capitalize'>
            Favoritas
          </h3>
          <CardList max={5} data={favorites} />
        </div>
      )}
      {mostPlayed.length > 0 && (
        <div>
          <h3 className='text-text-primary mb-2 text-lg font-semibold capitalize'>
            Mais Tocadas
          </h3>
          <CardList max={5} data={mostPlayed} />
        </div>
      )}
      {recentlyAdded.length > 0 && (
        <div>
          <h3 className='text-text-primary mb-2 text-lg font-semibold capitalize'>
            Recentemente Adicionadas
          </h3>
          <CardList max={10} data={recentlyAdded} />
        </div>
      )}
      {tracks.length === 0 && <EmptyLibrary viewName='HomeView' />}
    </div>
  );
}
