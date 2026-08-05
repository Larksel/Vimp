import { CM } from '@renderer/components/common';
import { usePlaylistAPI } from '@renderer/stores/usePlaylistStore';
import { Playlist } from '@shared/types/entities';
import { ReactNode } from 'react';

interface PlaylistMenuProps {
  children: ReactNode;
  playlist: Playlist;
}

export default function PlaylistMenu(props: PlaylistMenuProps) {
  const { children, playlist } = props;
  const playlistAPI = usePlaylistAPI();

  const handleRemove = async () => {
    playlistAPI.removePlaylist(playlist);
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
