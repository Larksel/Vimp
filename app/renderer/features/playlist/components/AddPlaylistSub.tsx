import { CM } from '@renderer/components/common';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { AudioItem, Playlist } from '@shared/types/entities';
import { usePlaylistAPI } from '@renderer/stores/usePlaylistStore';

interface AddPlaylistSubProps {
  track: AudioItem;
}

export default function AddPlaylistSub(props: AddPlaylistSubProps) {
  const { track } = props;
  const playlistAPI = usePlaylistAPI();
  const playlists = useLibraryStore((state) => state.contents.playlists);

  const handleSelect = (e: Event, playlist: Playlist) => {
    e.preventDefault();
    playlistAPI.addMedia(playlist.id, track.id);
  };

  return (
    <CM.ContextMenuSub>
      <CM.ContextMenuSubTrigger>Adicionar à playlist</CM.ContextMenuSubTrigger>
      <CM.ContextMenuSubContent>
        <CM.ContextMenuItem icon={<PlusIcon size={20} />}>
          Nova Playlist
        </CM.ContextMenuItem>
        {playlists.map((pl) => (
          <CM.ContextMenuItem
            key={pl.id}
            onSelect={(e) => handleSelect(e, pl)}
          >
            {pl.name}
          </CM.ContextMenuItem>
        ))}
      </CM.ContextMenuSubContent>
    </CM.ContextMenuSub>
  );
}
