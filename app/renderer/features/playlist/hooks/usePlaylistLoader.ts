import { PlaylistWithItems } from '@shared/types/entities';
import { playlistService } from '@renderer/services/playlistService';
import { useState, useEffect } from 'react';

export default function usePlaylistLoader(
  id?: string,
): PlaylistWithItems | null {
  const [data, setData] = useState<PlaylistWithItems | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      if (!id) {
        setData(null);
        return;
      }

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        setData(null);
        return;
      }

      playlistService
        .getItems(numericId)
        .then(setData)
        .catch(() => setData(null));
    };

    loadItems();
  }, [id]);

  return data;
}
