import {
  ContextMenuCheckboxItem,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@renderer/components/common/context-menu';
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
    <ContextMenuSub>
      <ContextMenuSubTrigger>Adicionar à playlist</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem icon={<PlusIcon size={20} />}>
          Nova Playlist
        </ContextMenuItem>
        {playlists.map((pl) => {
          return (
            <ContextMenuCheckboxItem
              key={pl._id}
              checked={pl.tracks.includes(track._id)}
              onSelect={(e) => addRemovePlaylist(e, pl)}
            >
              {pl.title}
            </ContextMenuCheckboxItem>
          );
        })}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
