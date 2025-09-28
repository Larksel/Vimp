import { CM } from '@renderer/components/common';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import { PlaylistService } from '@renderer/features/playlist';

interface AddPlaylistSubProps {
  track: TrackModel;
}

export default function AddPlaylistSub(props: AddPlaylistSubProps) {
  const { track } = props;
  const playlists = useLibraryStore((state) => state.contents.playlists);

  const addRemovePlaylist = (e: Event, playlist: PlaylistModel) => {
    e.preventDefault();

    if (playlist.tracks.includes(track._id)) {
      PlaylistService.removeTracks(playlist._id, track);
    } else {
      PlaylistService.addTracks(playlist._id, track);
    }
  };

  return (
    <CM.ContextMenuSub>
      <CM.ContextMenuSubTrigger>Adicionar à playlist</CM.ContextMenuSubTrigger>
      <CM.ContextMenuSubContent>
        <CM.ContextMenuItem icon={<PlusIcon size={20} />}>
          Nova Playlist
        </CM.ContextMenuItem>
        {playlists.map((pl) => {
          return (
            <CM.ContextMenuCheckboxItem
              key={pl._id}
              checked={pl.tracks.includes(track._id)}
              onSelect={(e) => addRemovePlaylist(e, pl)}
            >
              {pl.title}
            </CM.ContextMenuCheckboxItem>
          );
        })}
      </CM.ContextMenuSubContent>
    </CM.ContextMenuSub>
  );
}
