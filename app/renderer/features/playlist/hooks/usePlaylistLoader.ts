import { PlaylistWithItems } from '@shared/types/entities';
import { playlistService } from '@renderer/services/playlistService';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import { useState, useEffect, useMemo } from 'react';

export default function usePlaylistLoader(
  id?: string,
): PlaylistWithItems | null {
  const [playlist, setPlaylist] = useState<PlaylistWithItems | null>(null);
  const audio = useLibraryStore((state) => state.contents.audio);
  const videos = useLibraryStore((state) => state.contents.videos);

  useEffect(() => {
    let cancelled = false;

    const loadItems = async () => {
      if (!id) {
        setPlaylist(null);
        return;
      }

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        setPlaylist(null);
        return;
      }

      playlistService
        .getItems(numericId)
        .then((data) => {
          if (!cancelled) setPlaylist(data);
        })
        .catch(() => {
          if (!cancelled) setPlaylist(null);
        });
    };

    loadItems();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return useMemo(() => {
    if (!playlist) return null;

    const mediaById = new Map(
      [...audio, ...videos].map((item) => [item.id, item]),
    );

    return {
      ...playlist,
      items: playlist.items
        .map((item) => {
          const media = mediaById.get(item.mediaId);
          return media ? { ...item, media } : null;
        })
        .filter((item) => item !== null),
    };
  }, [audio, playlist, videos]);
}
