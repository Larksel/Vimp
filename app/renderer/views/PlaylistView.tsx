import { PlaylistModel } from "@shared/types/vimp";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PlaylistView() {
  const [playlist, setPlaylist] = useState<PlaylistModel>();
  const { id } = useParams();

  useEffect(() => {
    async function fetchPlaylists() {
      if (!id) return;
      const playlist = await window.VimpAPI.playlistsDB.getById(id);
      setPlaylist(playlist);
    }

    fetchPlaylists();
  }, [id])

  return (
    <div>
      <span>{playlist?.title}</span>
    </div>
  );
}