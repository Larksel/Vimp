import { useState, useMemo, useRef, useEffect } from 'react';
import TrackList from '@renderer/components/TrackList';
import placeholder from '@renderer/assets/images/placeholder.png';
import { HeartStraightIcon } from '@phosphor-icons/react/dist/csr/HeartStraight';
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { useParams } from 'react-router-dom';
import InfoText from '@renderer/components/InfoText';
import { Button } from '@renderer/components/common/button';
import usePlaylistLoader from '@renderer/hooks/usePlaylistLoader';
import { formatDuration } from '@renderer/utils/utils';
import { usePlaylistAPI } from '@renderer/stores/usePlaylistStore';
import useAudioData from '@renderer/hooks/useAudioData';

export default function PlaylistView() {
  const { id } = useParams();
  const loading = useLibraryStore((state) => state.loading);
  const playerAPI = usePlayerAPI();
  const playlistAPI = usePlaylistAPI();
  const loaderData = usePlaylistLoader(id);
  const [scroll, setScroll] = useState(0);
  const audioDataRef = useAudioData();
  const bgImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const animationLoop = () => {
      if (bgImageRef.current && audioDataRef.current) {
        const { rmsLevel } = audioDataRef.current;
        const brightness = 0.2 + rmsLevel * 0.2;
        const blur = 9 + rmsLevel * 7;
        const scale = 1 + rmsLevel * 0.015;

        bgImageRef.current.style.transform = `scale(${scale})`;
        bgImageRef.current.style.filter = `brightness(${brightness}) blur(${blur}px)`;
      }
      animationFrameId = requestAnimationFrame(animationLoop);
    };
    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioDataRef]);

  const scrollProgress = useMemo(() => {
    const scrollThreshold = 147; // Magic number, for now...
    const progress = Math.min(1, scroll / scrollThreshold);
    return 1 - Math.pow(1 - progress, 3); // ease-out
  }, [scroll]);

  const headerHeight = useMemo(() => {
    const maxHeight = 260;
    const minHeight = 120;
    const height = maxHeight - scrollProgress * (maxHeight - minHeight);
    return Math.max(minHeight, Math.min(maxHeight, height));
  }, [scrollProgress]);

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
        className='z-1 flex gap-4 px-4 pb-4 transition-all duration-500 ease-out'
        style={{
          height: `${headerHeight}px`,
        }}
      >
        <img
          src={playlist.cover ?? placeholder}
          alt='playlist cover'
          className='z-1 aspect-square h-full rounded-lg object-cover shadow-md select-none'
        />
        <div
          className={`relative flex w-full flex-col justify-center transition-all ${scrollProgress < 0.75 ? 'gap-2' : 'gap-0'}`}
        >
          <InfoText
            variant={'secondary'}
            className={`text-sm transition-all ${scrollProgress > 0.75 ? 'h-0 opacity-0' : 'opacity-100'}`}
          >
            Playlist
          </InfoText>

          <InfoText
            variant={'primary'}
            className={`w-full truncate font-bold transition-all duration-500 ${scrollProgress > 0.75 ? 'text-3xl' : 'text-5xl'}`}
          >
            {playlist.title}
          </InfoText>

          <InfoText
            variant={scrollProgress > 0.75 ? 'secondary' : 'primary'}
            className='text-sm transition-colors'
          >
            {`${tracks.length} tracks - ${totalDuration()}`}
          </InfoText>

          {playlist.description && (
            <InfoText
              variant={'secondary'}
              className={`line-clamp-2 w-full pr-24 text-sm whitespace-normal transition-all duration-300 sm:line-clamp-3 md:line-clamp-4 ${scrollProgress > 0.75 ? 'h-0 opacity-0' : 'opacity-100'}`}
            >
              {playlist.description}
            </InfoText>
          )}

          <div
            className={`flex gap-2 transition-all duration-500 ${
              scrollProgress > 0.75 ? 'absolute right-0' : 'mt-auto'
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
      </div>
      <div className='z-1 h-full'>
        <TrackList
          queue={tracks}
          onItemClick={handleItemClick}
          onScroll={handleScroll}
        />
      </div>
      <img
        ref={bgImageRef}
        src={playlist.cover ?? placeholder}
        alt=''
        className='absolute inset-0 z-0 h-full w-full object-cover blur-lg brightness-[0.2]'
      />
    </div>
  );
}
