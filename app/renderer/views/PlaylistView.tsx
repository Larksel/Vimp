import TrackList from '@components/TrackList';
import placeholder from '@assets/images/placeholder.png';
import { HeartStraight, Play } from '@phosphor-icons/react';
import useLibraryStore, { usePlaylistAPI } from '@stores/useLibraryStore';
import { usePlayerAPI } from '@stores/usePlayerStore';
import { useParams } from 'react-router-dom';
import InfoText from '@components/InfoText';
import { Button } from '@components/common/button';
import usePlaylistLoader from '@hooks/usePlaylistLoader';

export default function PlaylistView() {
  const { id } = useParams();
  const loading = useLibraryStore((state) => state.loading);
  const playerAPI = usePlayerAPI();
  const playlistAPI = usePlaylistAPI();
  const loaderData = usePlaylistLoader(id);

  if (loading.playlists || loading.tracks) {
    return (
      <div className='flex items-center justify-center'>Carregando...</div>
    );
  }

  if (!loaderData) {
    return (
      <div className='flex items-center justify-center'>
        Playlist não encontrada
      </div>
    );
  }

  const { playlist, tracks } = loaderData;

  const playTracks = () => {
    playerAPI.start(tracks);
  };

  const toggleFavorite = async () => {
    await playlistAPI.toggleFavorite(playlist._id);
  };

  const handleItemClick = (trackID: string) => {
    playerAPI.start(tracks, trackID);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-4'>
        <img
          src={playlist.cover ?? placeholder}
          alt=''
          className='size-52 rounded-lg border border-black/30 object-cover shadow-md transition-all'
        />
        <div className='flex flex-col gap-2'>
          <InfoText variant={'secondary'} className='text-sm'>
            Playlist
          </InfoText>

          <InfoText
            variant={'primary'}
            className='text-6xl font-bold'
          >{`${playlist.title}`}</InfoText>

          {playlist.description && (
            <InfoText variant={'secondary'} className='text-sm'>
              {playlist.description}
            </InfoText>
          )}

          <InfoText
            variant={'primary'}
            className='text-sm'
          >{`${tracks.length} tracks`}</InfoText>

          <div className='mt-auto flex items-center gap-2'>
            <Button
              className='aspect-square shrink-0 rounded-full bg-green-500 p-0 hover:bg-green-600'
              onClick={playTracks}
            >
              <Play size={20} weight='fill' />
            </Button>
            <Button
              className='aspect-square shrink-0 rounded-full bg-transparent p-0'
              onClick={toggleFavorite}
            >
              <HeartStraight
                size={28}
                weight={`${playlist.favorite ? 'fill' : 'regular'}`}
                className={`${playlist.favorite ? 'text-red-500' : ''} transition-all`}
              />
            </Button>
          </div>
        </div>
      </div>
      <TrackList queue={tracks} onItemClick={handleItemClick} />
    </div>
  );
}
