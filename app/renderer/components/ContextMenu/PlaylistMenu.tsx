import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@renderer/components/common/context-menu';
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
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleRemove}>
          Excluir Playlist
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
