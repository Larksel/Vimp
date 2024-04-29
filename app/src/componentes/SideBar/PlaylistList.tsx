import { useNavigate } from 'react-router-dom';

import placeholderImage from '../../assets/images/placeholder.png';

import { Button } from '../ui/button';
import ScrollBar from '../ScrollBar/ScrollBar';
import ListHeader from './ListHeader';
import InfoText from '../InfoText/InfoText';

interface PlaylistListProps {
  collapsed: boolean;
}

//TODO animar texto grande quando o mouse passar por cima
//TODO puxar playlists salvas no BD

export default function PlaylistList({ collapsed }: PlaylistListProps) {
  const navigate = useNavigate();

  return (
    <div className='relative h-full w-full overflow-clip rounded-lg bg-zinc-900'>
      <ListHeader collapsed={collapsed} />
      <ScrollBar className='pt-11'>
        {Array.from({ length: 10 }).map((_, index) => (
          <Button
            key={index}
            variant='ghost'
            onClick={() => console.log(`Playlist ${index + 1}`)}
            className='flex h-16 w-full justify-start gap-4 rounded-none p-2 active:bg-[#fff3]'
          >
            <img
              src={'' || placeholderImage}
              className='h-12 w-12 shrink-0 rounded-sm bg-zinc-800 object-cover'
            />

            <div
              className={`flex w-full flex-col overflow-clip whitespace-nowrap transition-all ${collapsed ? '-translate-x-3 opacity-0' : ''}`}
              style={{
                transitionDelay: !collapsed ? `${(index + 1) * 75}ms` : '',
              }}
            >
              <InfoText variant='primary'>{`Playlist ${index + 1}`}</InfoText>
              <InfoText variant='secondary'>Playlist</InfoText>
            </div>
          </Button>
        ))}
      </ScrollBar>
    </div>
  );
}
