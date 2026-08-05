import { ReactNode } from 'react';
import { CM } from '@renderer/components/common';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { AudioItem } from '@shared/types/entities';
import { AddPlaylistSub } from '@renderer/features/playlist';

interface TrackMenuProps {
  children: ReactNode;
  track: AudioItem;
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
    playerAPI.removeTracksFromQueue(track.id);
  };

  return (
    <CM.ContextMenu>
      <CM.ContextMenuTrigger>{children}</CM.ContextMenuTrigger>
      <CM.ContextMenuContent>
        <CM.ContextMenuItem onClick={handleAddToQueue}>
          Adicionar à fila
        </CM.ContextMenuItem>
        <CM.ContextMenuItem onClick={handleAddNext}>
          Tocar em seguida
        </CM.ContextMenuItem>
        <AddPlaylistSub track={track} />
        <CM.ContextMenuItem onClick={handleRemoveFromQueue}>
          Remover da fila
        </CM.ContextMenuItem>
      </CM.ContextMenuContent>
    </CM.ContextMenu>
  );
}
