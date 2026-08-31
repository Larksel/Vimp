import fs from 'fs';
import path from 'path';
import { Track } from '@shared/types/vimp';
import { Repositories } from '@main/db/types';
import { createCrudService } from './serviceHelper';
import { MediaType } from '@shared/types/entities';

// TODO executar verificações iniciais

/**
 * Garante que o valor seja um Array sem valores duplicados ou vazios
 */
function normalizeList(value?: string | string[]): string[] {
  if (!value) return [];

  const list = Array.isArray(value) ? value : [value];
  return [...new Set(list.map((item) => item.trim()).filter(Boolean))];
}

export default function createMediaService(repositories: Repositories) {
  const crudMethods = createCrudService(repositories.mediaRepository);

  const withRelations = {
    with: {
      albums: {
        columns: {
          title: true,
        },
      },
      artists: {
        columns: {
          name: true,
        },
      },
      playlists: {
        columns: {
          id: true,
          name: true,
        },
      },
      audioTracking: {
        columns: {
          playCount: true,
          lastPlayedAt: true,
        },
      },
      videoTracking: {
        columns: {
          completed: true,
          stoppedAt: true,
          playedAt: true,
        },
      },
      tags: true,
    },
  };

  function normalizeAudioItem<T extends Record<string, unknown>>(media: T): T {
    if (media.type !== MediaType.AUDIO) return media;

    const historyRelation = media.audioTracking;
    const audioHistoryEntry = Array.isArray(historyRelation)
      ? historyRelation[0]
      : historyRelation;

    const normalizedHistory =
      audioHistoryEntry && typeof audioHistoryEntry === 'object'
        ? audioHistoryEntry
        : { playCount: 0, lastPlayedAt: null };

    return {
      ...media,
      playCount: (normalizedHistory as { playCount: number }).playCount ?? 0,
      lastPlayedAt:
        (normalizedHistory as { lastPlayedAt: Date | null }).lastPlayedAt ??
        null,
    };
  }

  function normalizeAudioItems<T extends Record<string, unknown>>(media: T[]) {
    return media.map(normalizeAudioItem);
  }

  function getAll() {
    return normalizeAudioItems(crudMethods.getAll(withRelations));
  }

  function getById(id: number) {
    const media = crudMethods.getById(id, withRelations);
    return media ? normalizeAudioItem(media) : media;
  }

  function insertTrack(track: Track) {
    const resolvedPath = path.resolve(track.path);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Cannot import missing media file: ${resolvedPath}`);
    }

    return repositories.transaction((tx) => {
      // Detecta se ja existe no banco
      const existingMedia = tx.mediaRepository.getByPath(resolvedPath);

      if (existingMedia) {
        if (existingMedia.isMissing) {
          tx.mediaRepository.markAsFound(existingMedia.id);
        }

        return { id: existingMedia.id, created: false };
      }

      // Adiciona ao banco e guarda o id
      const insertedMedia = tx.mediaRepository.insert({
        type: 'audio',
        title: track.title,
        path: resolvedPath,
        duration: track.duration,
        coverPath: track.cover,
        modifiedAt: track.dateModified,
      });

      const mediaId = insertedMedia.id;

      // Cria um registro no histórico de reprodução
      tx.audioHistoryRepository.insert({ mediaId });

      // Adiciona os artistas ao banco
      const artistIds = normalizeList(track.artist).map((name) => {
        const existingArtist = tx.artistRepository.getByName(name);
        if (existingArtist) return existingArtist.id;

        const insertedArtist = tx.artistRepository.insert({ name });
        return insertedArtist.id;
      });

      // Linka cada artista à musica
      artistIds.forEach((artistId) => {
        tx.mediaArtistRepository.insert({ mediaId, artistId });
      });

      // Adiciona ou linka a música a um album no banco
      if (track.album) {
        const existingAlbum = tx.albumRepository.getByTitle(track.album);
        const albumId =
          existingAlbum?.id ??
          tx.albumRepository.insert({ title: track.album }).id;

        tx.mediaAlbumRepository.insert({ mediaId, albumId });

        normalizeList(track.albumartist).forEach((name) => {
          const existingArtist = tx.artistRepository.getByName(name);
          const artistId =
            existingArtist?.id ?? tx.artistRepository.insert({ name }).id;

          tx.albumArtistRepository.insert({ albumId, artistId });
        });
      }

      // Adiciona ou linka os generos musicais
      normalizeList(track.genre).forEach((name) => {
        const existingTag = tx.tagRepository.getByNameAndType(name, 'genre');
        const tagId =
          existingTag?.id ??
          tx.tagRepository.insert({ name, type: 'genre' }).id;

        tx.mediaTagRepository.insert({ mediaId, tagId });
      });

      // Finaliza retornando sucesso
      return { id: mediaId, created: true };
    });
  }

  function insertManyTracks(tracks: Track | Track[]) {
    const normalizedTracks = Array.isArray(tracks) ? tracks : [tracks];
    return normalizedTracks.map((track) => insertTrack(track));
  }

  function scanMissingMedia() {
    const mediaRepository = repositories.mediaRepository;
    const allMedia = mediaRepository.getAllSync();
    const missing: number[] = [];
    const found: number[] = [];

    allMedia.forEach((media) => {
      const exists = fs.existsSync(media.path);

      if (!exists && !media.isMissing) {
        mediaRepository.markAsMissing(media.id);
        missing.push(media.id);
      }

      if (exists && media.isMissing) {
        mediaRepository.markAsFound(media.id);
        found.push(media.id);
      }
    });

    return { missing, found };
  }

  function getByType(type: 'audio' | 'video') {
    return normalizeAudioItems(
      repositories.mediaRepository.getByType(type, withRelations),
    );
  }

  function toggleFavorite(id: number) {
    return repositories.mediaRepository.toggleFavorite(id);
  }

  function recordAudioPlayback(mediaId: number) {
    return repositories.audioHistoryRepository.incrementPlayCount(mediaId);
  }

  function deleteByPath(mediaPath: string) {
    const resolvedPath = path.resolve(mediaPath);
    const mediaRepository = repositories.mediaRepository;
    const media = mediaRepository.getByPath(resolvedPath);

    if (!media) return null;

    mediaRepository.deleteById(media.id);
    return media;
  }

  function getByPath(mediaPath: string) {
    return repositories.mediaRepository.getByPath(path.resolve(mediaPath));
  }

  return {
    ...crudMethods,
    getByPath,
    getByType,
    insertTrack,
    insertManyTracks,
    scanMissingMedia,
    toggleFavorite,
    recordAudioPlayback,
    deleteByPath,
    getAll,
    getById,
  };
}
