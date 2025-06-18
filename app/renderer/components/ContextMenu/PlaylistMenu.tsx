import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@components/common/context-menu';
import { PlaylistModel } from '@shared/types/vimp';
import { usePlaylistAPI } from '@stores/usePlaylistStore';
import { ReactNode } from 'react';

interface PlaylistMenuProps {
  children: ReactNode;
  playlist: PlaylistModel;
}

export default function PlaylistMenu(props: PlaylistMenuProps) {
  const { children, playlist } = props;
  const playlistAPI = usePlaylistAPI();

  const handleRemove = async () => {
    playlistAPI.removePlaylist(playlist);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleRemove}>Excluir Playlist</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
