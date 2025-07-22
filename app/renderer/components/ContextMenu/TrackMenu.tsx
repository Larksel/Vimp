import { ReactNode } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@renderer/components/common/context-menu';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { TrackModel } from '@shared/types/vimp';
import AddPlaylistSub from './common/AddPlaylistSub';

interface TrackMenuProps {
  children: ReactNode;
  track: TrackModel;
}

export default function TrackMenu(props: TrackMenuProps) {
  const { children, track } = props;
  const playerAPI = usePlayerAPI();

  const handleAddToQueue = () => {
    playerAPI.addToQueue(track);
  };

  const handleAddNext = () => {
    playerAPI.queueNext(track);
  };

  const handleRemoveFromQueue = () => {
    playerAPI.removeTracksFromQueue(track._id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleAddToQueue}>
          Adicionar à fila
        </ContextMenuItem>
        <ContextMenuItem onClick={handleAddNext}>
          Tocar em seguida
        </ContextMenuItem>
        <AddPlaylistSub track={track} />
        <ContextMenuItem onClick={handleRemoveFromQueue}>
          Remover da fila
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
