import {
  ContextMenuCheckboxItem,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@components/common/context-menu';
import useLibraryStore, { usePlaylistAPI } from '@stores/useLibraryStore';
import { Plus } from '@phosphor-icons/react';
import { PlaylistModel, TrackModel } from '@shared/types/vimp';

interface AddPlaylistSubProps {
  track: TrackModel;
}

export default function AddPlaylistSub({ track }: AddPlaylistSubProps) {
  const playlists = useLibraryStore((state) => state.contents.playlists);
  const playlistAPI = usePlaylistAPI();

  const addRemovePlaylist = (e: Event, playlist: PlaylistModel) => {
    e.preventDefault();

    if (playlist.tracks.includes(track._id)) {
      playlistAPI.removeTracks(playlist._id, track);
    } else {
      playlistAPI.addTracks(playlist._id, track);
    }
  };

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Adicionar à playlist</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem icon={<Plus size={20} />}>
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
