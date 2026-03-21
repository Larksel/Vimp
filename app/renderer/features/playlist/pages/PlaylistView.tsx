import { useState, useRef } from 'react';
import TrackList from '@renderer/components/TrackList';
import placeholder from '@renderer/assets/images/placeholder.png';
import { HeartStraightIcon } from '@phosphor-icons/react/dist/csr/HeartStraight';
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play';
import { CaretDownIcon } from '@phosphor-icons/react/dist/csr/CaretDown';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { useParams } from 'react-router-dom';
import InfoText from '@renderer/components/InfoText';
import { Button } from '@renderer/components/common';
import usePlaylistLoader from '../hooks/usePlaylistLoader';
import { formatDuration } from '@renderer/utils/utils';
import { useAudioAnimation } from '@renderer/features/audioReaction';
import { usePlaylistAPI } from '@renderer/stores/usePlaylistStore';

export default function PlaylistView() {
  const { id } = useParams();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(true);
  const loading = useLibraryStore((state) => state.loading);
  const playerAPI = usePlayerAPI();
  const playlistAPI = usePlaylistAPI();
  const loaderData = usePlaylistLoader(id);
  const bgImageRef = useRef<HTMLImageElement>(null);

  useAudioAnimation([bgImageRef], (audioData) => {
    const brightness = 0.2 + audioData.bass * 0.2;
    const blur = 9 + audioData.bass * 7;
    const scale = 1 + audioData.bass * 0.02;
    return {
      transform: `scale(${scale})`,
      filter: `brightness(${brightness}) blur(${blur}px)`,
    };
  });

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

  const toggleFavorite = () => {
    playlistAPI.toggleFavorite(playlist._id);
  };

  const handleItemClick = (trackID: string) => {
    playerAPI.startPlayback(tracks, trackID);
  };

  const handleItemMove = (from: number, to: number) => {
    playlistAPI.reorderTracks(playlist._id, from, to);
  };

  const totalDuration = () => {
    let totalSeconds = 0;

    tracks.forEach(({ duration }) => {
      totalSeconds += duration;
    });

    return formatDuration(totalSeconds);
  };

  return (
    <div className='flex flex-col'>
      <img
        ref={bgImageRef}
        src={playlist.cover ?? placeholder}
        alt=''
        className='absolute inset-0 h-full w-full object-cover blur-lg brightness-[0.2]'
      />
      <header
        className={`relative z-10 flex gap-4 p-4 transition-all duration-500 ${isHeaderCollapsed ? 'h-30' : 'h-65'}`}
      >
        <Button
          variant={'glass'}
          className='absolute right-1/2 bottom-0 z-20 size-8 rounded-full bg-transparent p-0 transition-transform hover:bg-transparent active:bg-transparent'
          onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
        >
          <CaretDownIcon
            size={20}
            weight='bold'
            className={`transition-transform ${!isHeaderCollapsed && 'rotate-180'}`}
          />
        </Button>
        <img
          src={playlist.cover ?? placeholder}
          alt='playlist cover'
          className='aspect-square h-full rounded-lg object-cover shadow-md select-none'
        />
        <div
          className={`relative flex w-full flex-col justify-center transition-all ${isHeaderCollapsed ? 'gap-0' : 'gap-2'}`}
        >
          <InfoText
            variant={'secondary'}
            className={`text-sm transition-all ${isHeaderCollapsed ? 'h-0 opacity-0' : 'opacity-100'}`}
          >
            Playlist
          </InfoText>

          <InfoText
            variant={'primary'}
            className={`w-full truncate font-bold transition-all duration-500 ${isHeaderCollapsed ? 'text-3xl' : 'text-5xl'}`}
          >
            {playlist.title}
          </InfoText>

          <InfoText
            variant={isHeaderCollapsed ? 'secondary' : 'primary'}
            className='text-sm transition-colors'
          >
            {`${tracks.length} tracks - ${totalDuration()}`}
          </InfoText>

          {playlist.description && (
            <InfoText
              variant={'secondary'}
              className={`line-clamp-2 w-full pr-24 text-sm whitespace-normal transition-all duration-500 sm:line-clamp-3 md:line-clamp-4 ${isHeaderCollapsed ? 'h-0 opacity-0' : 'opacity-100'}`}
            >
              {playlist.description}
            </InfoText>
          )}

          <div
            className={`flex gap-2 transition-all duration-500 ${
              isHeaderCollapsed ? 'absolute right-0' : 'mt-auto'
            }`}
          >
            <Button
              variant={'filled'}
              className='bg-accent text-text-primary aspect-square size-10 shrink-0 rounded-full p-0 transition-transform hover:scale-105'
              onClick={playTracks}
            >
              <PlayIcon size={20} weight='fill' />
            </Button>

            <Button
              variant={'glass'}
              className='aspect-square size-10 shrink-0 rounded-full bg-transparent p-0 transition-transform hover:scale-105'
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
      </header>
      <div className='z-10 min-h-0 w-full flex-1'>
        <TrackList
          items={tracks}
          onItemClick={handleItemClick}
          onItemMove={handleItemMove}
        />
      </div>
    </div>
  );
}
