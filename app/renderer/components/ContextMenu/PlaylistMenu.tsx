import { CM } from '@renderer/components/common';
import { PlaylistService } from '@renderer/features/playlist';
import { PlaylistModel } from '@shared/types/vimp';
import { ReactNode } from 'react';

interface PlaylistMenuProps {
  children: ReactNode;
  playlist: PlaylistModel;
}

export default function PlaylistMenu(props: PlaylistMenuProps) {
  const { children, playlist } = props;

  const handleRemove = async () => {
    PlaylistService.removePlaylist(playlist);
  };

  return (
    <CM.ContextMenu>
      <CM.ContextMenuTrigger>{children}</CM.ContextMenuTrigger>
      <CM.ContextMenuContent>
        <CM.ContextMenuItem onClick={handleRemove}>
          Excluir Playlist
        </CM.ContextMenuItem>
      </CM.ContextMenuContent>
    </CM.ContextMenu>
  );
}
