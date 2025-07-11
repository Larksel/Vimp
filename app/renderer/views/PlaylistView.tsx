import { useState } from 'react';
import TrackList from '@components/TrackList';
import placeholder from '@assets/images/placeholder.png';
import { HeartStraightIcon, PlayIcon } from '@phosphor-icons/react';
import useLibraryStore from '@stores/useLibraryStore';
import { usePlayerAPI } from '@stores/usePlayerStore';
import { useParams } from 'react-router-dom';
import InfoText from '@components/InfoText';
import { Button } from '@components/common/button';
import usePlaylistLoader from '@hooks/usePlaylistLoader';
import { formatDuration } from '@render-utils/utils';
import { usePlaylistAPI } from '@stores/usePlaylistStore';

export default function PlaylistView() {
  const { id } = useParams();
  const loading = useLibraryStore((state) => state.loading);
  const playerAPI = usePlayerAPI();
  const playlistAPI = usePlaylistAPI();
  const loaderData = usePlaylistLoader(id);
  const [scroll, setScroll] = useState(0);

  const handleScroll = (scrollTop: number) => {
    setScroll(scrollTop);
  };

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
    playerAPI.startPlayback(tracks);
  };

  const toggleFavorite = async () => {
    await playlistAPI.toggleFavorite(playlist._id);
  };

  const handleItemClick = (trackID: string) => {
    playerAPI.startPlayback(tracks, trackID);
  };

  const totalDuration = () => {
    let totalSeconds = 0;

    tracks.forEach(({ duration }) => {
      totalSeconds += duration;
    });

    return formatDuration(totalSeconds);
  };

  return (
    <div className='z-1 flex flex-col'>
      <div
        className={`z-1 flex max-h-[50vh] min-h-24 gap-4 px-4 pb-4 transition-all duration-300 ${scroll > 0 ? 'h-[20%]' : 'h-full'}`}
      >
        <img
          src={playlist.cover ?? placeholder}
          alt=''
          className='z-1 aspect-square h-full rounded-lg object-cover shadow-md transition-all select-none'
        />
        <div
          className={`relative flex w-full flex-col justify-center overflow-hidden *:transition-all ${scroll === 0 && 'gap-2'}`}
        >
          <InfoText
            variant={'secondary'}
            className={`text-sm ${scroll > 0 && 'hidden'}`}
          >
            Playlist
          </InfoText>

          <InfoText
            variant={'primary'}
            className={`w-full truncate font-bold ${scroll > 0 ? 'text-4xl' : 'text-6xl'}`}
          >
            {playlist.title}
          </InfoText>

          <InfoText
            variant={scroll > 0 ? 'secondary' : 'primary'}
            className='text-sm'
          >{`${tracks.length} tracks - ${totalDuration()}`}</InfoText>

          {playlist.description && (
            <InfoText
              variant={'secondary'}
              className={`line-clamp-2 w-full text-sm whitespace-normal sm:line-clamp-3 md:line-clamp-4 ${scroll > 0 && 'hidden'}`}
            >
              {playlist.description}
            </InfoText>
          )}

          <div
            className={`flex gap-2 ${scroll > 0 ? 'absolute right-0' : 'mt-auto'}`}
          >
            <Button
              variant={'filled'}
              className='bg-accent text-text-primary aspect-square size-10 shrink-0 rounded-full p-0'
              onClick={playTracks}
            >
              <PlayIcon size={20} weight='fill' />
            </Button>
            <Button
              variant={'glass'}
              className='aspect-square size-10 shrink-0 rounded-full bg-transparent p-0'
              onClick={toggleFavorite}
            >
              <HeartStraightIcon
                size={24}
                weight={playlist.favorite ? 'fill' : 'regular'}
                className={`transition-all ${playlist.favorite && 'text-danger'}`}
              />
            </Button>
          </div>
        </div>
      </div>
      <div className='z-1 h-full'>
        <TrackList
          queue={tracks}
          onItemClick={handleItemClick}
          onScroll={handleScroll}
        />
      </div>
      <img
        src={playlist.cover ?? placeholder}
        alt=''
        className='absolute inset-0 z-0 h-full w-full object-cover blur-lg brightness-[0.2]'
      />
    </div>
  );
}
