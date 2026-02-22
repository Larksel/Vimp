import { HeartStraightIcon } from '@phosphor-icons/react/dist/csr/HeartStraight';

import placeholderImage from '@renderer/assets/images/placeholder.png';
import useCurrentTrack from '@renderer/hooks/useCurrentTrack';

import InfoText from '@renderer/components/InfoText';
import { Button } from '@renderer/components/common';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '@renderer/routes/routes';

export default function MusicInfo() {
  const playerAPI = usePlayerAPI();
  const track = useCurrentTrack();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isExpandedView =
    pathname.replace('/', '') === routes.EXPANDED_VIEW.path;

  const expandedView = () => {
    if (!isExpandedView) {
      navigate(routes.EXPANDED_VIEW.path);
    } else {
      navigate(-1);
    }
  };

  const toggleFavorite = async () => {
    if (!track) return;
    playerAPI.toggleTrackFavorite(track._id);
  };

  return (
    <>
      <div className='flex h-full w-[30%] items-center'>
        <div
          onClick={expandedView}
          className={`flex h-full w-full items-center select-none ${isExpandedView ? 'gap-0' : 'gap-2'} hover:bg-surface-highlight overflow-hidden rounded-lg p-2 transition-all`}
        >
          <img
            src={track?.cover ?? placeholderImage}
            alt=''
            className={`size-16 rounded-sm object-cover transition-all ${isExpandedView ? 'w-0 opacity-0' : ''}`}
          />

          <div
            className='flex w-full flex-col overflow-hidden px-2 whitespace-nowrap'
            style={{
              maskImage:
                'linear-gradient(90deg,transparent 0,#000 8px,#000 calc(100% - 12px),transparent)',
            }}
          >
            {track ? (
              <>
                <InfoText variant='primary'>{track.title}</InfoText>
                <InfoText variant='secondary'>{track.artist[0]}</InfoText>
              </>
            ) : (
              <InfoText variant='primary'>Nenhuma música selecionada</InfoText>
            )}
          </div>
        </div>
        {track && (
          <Button
            variant={'glass'}
            className='mx-2 aspect-square size-6 shrink-0 rounded-full p-0'
            onClick={toggleFavorite}
          >
            <HeartStraightIcon
              size={24}
              weight={`${track.favorite ? 'fill' : 'regular'}`}
              className={`${track.favorite && 'text-red-500'}`}
            />
          </Button>
        )}
      </div>
    </>
  );
}
