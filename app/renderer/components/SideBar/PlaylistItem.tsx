import placeholderImage from '@renderer/assets/images/placeholder.png';
import { Button } from '@renderer/components/common/button';
import InfoText from '@renderer/components/InfoText';
import { PlaylistModel } from '@shared/types/vimp';

interface PlaylistItemProps {
  playlist: PlaylistModel;
  index: number;
  collapsed: boolean;
  onClick: (playlistID: string) => void;
}

export default function PlaylistItem(props: PlaylistItemProps) {
  const { playlist, index, collapsed, onClick } = props;

  return (
    <Button
      variant='surface'
      onClick={() => onClick(playlist._id)}
      className='flex h-16 w-full justify-start gap-4 p-2'
    >
      <img
        src={playlist.cover ?? placeholderImage}
        alt=''
        className='h-12 w-12 shrink-0 rounded-sm object-cover'
      />

      <div
        className={`flex w-full flex-col overflow-clip whitespace-nowrap transition-all ${collapsed ? '-translate-x-3 opacity-0' : ''}`}
        style={{
          transitionDelay: !collapsed ? `${(index + 1) * 75}ms` : '',
        }}
      >
        <InfoText variant='primary'>{playlist.title}</InfoText>
        <InfoText variant='secondary'>Playlist</InfoText>
      </div>
    </Button>
  );
}
