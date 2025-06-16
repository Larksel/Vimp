import CardList from '@components/CardList';
import EmptyLibrary from '@components/EmptyLibrary';
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
