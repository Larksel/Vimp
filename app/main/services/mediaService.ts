import fs from 'fs';
import path from 'path';

import createAlbumArtistRepository from '@main/db/repositories/albumArtistRepository';
import createAlbumRepository from '@main/db/repositories/albumRepository';
import createArtistRepository from '@main/db/repositories/artistRepository';
import createAudioHistoryRepository from '@main/db/repositories/audioHistoryRepository';
import createMediaAlbumRepository from '@main/db/repositories/mediaAlbumRepository';
import createMediaArtistRepository from '@main/db/repositories/mediaArtistRepository';
import createMediaRepository from '@main/db/repositories/mediaRepository';
import createMediaTagRepository from '@main/db/repositories/mediaTagRepository';
import createTagRepository from '@main/db/repositories/tagRepository';
import { Track } from '@shared/types/vimp';
import { VimpDBExecutor, VimpDatabase } from '@main/types';

function normalizeList(value?: string | string[]) {
  if (!value) return [];

  const list = Array.isArray(value) ? value : [value];
  return [...new Set(list.map((item) => item.trim()).filter(Boolean))];
}

function createTxRepositories(db: VimpDBExecutor) {
  return {
    albumArtistRepository: createAlbumArtistRepository(db),
    albumRepository: createAlbumRepository(db),
    artistRepository: createArtistRepository(db),
    audioHistoryRepository: createAudioHistoryRepository(db),
    mediaAlbumRepository: createMediaAlbumRepository(db),
    mediaArtistRepository: createMediaArtistRepository(db),
    mediaRepository: createMediaRepository(db),
    mediaTagRepository: createMediaTagRepository(db),
    tagRepository: createTagRepository(db),
  };
}

export default function createMediaService(db: VimpDatabase) {
  function importTrack(track: Track) {
    const resolvedPath = path.resolve(track.path);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Cannot import missing media file: ${resolvedPath}`);
    }

    return db.transaction((tx) => {
      const repositories = createTxRepositories(tx);
      const existingMedia =
        repositories.mediaRepository.getByPath(resolvedPath);

      if (existingMedia) {
        if (existingMedia.isMissing) {
          repositories.mediaRepository.markAsFound(existingMedia.id);
        }

        return { id: existingMedia.id, created: false };
      }

      const insertedMedia = repositories.mediaRepository.insert({
        type: 'audio',
        title: track.title,
        path: resolvedPath,
        duration: track.duration,
        coverPath: track.cover,
      });

      const mediaId = insertedMedia.id;
      repositories.audioHistoryRepository.insert({ mediaId });

      const artistIds = normalizeList(track.artist).map((name) => {
        const existingArtist = repositories.artistRepository.getByName(name);
        if (existingArtist) return existingArtist.id;

        const insertedArtist = repositories.artistRepository.insert({ name });
        return insertedArtist.id;
      });

      artistIds.forEach((artistId) => {
        repositories.mediaArtistRepository.insert({ mediaId, artistId });
      });

      if (track.album) {
        const existingAlbum = repositories.albumRepository.getByTitle(
          track.album,
        );
        const albumId =
          existingAlbum?.id ??
          repositories.albumRepository.insert({ title: track.album }).id;

        repositories.mediaAlbumRepository.insert({ mediaId, albumId });

        normalizeList(track.albumartist).forEach((name) => {
          const existingArtist = repositories.artistRepository.getByName(name);
          const artistId =
            existingArtist?.id ??
            repositories.artistRepository.insert({ name }).id;

          repositories.albumArtistRepository.insert({ albumId, artistId });
        });
      }

      normalizeList(track.genre).forEach((name) => {
        const existingTag = repositories.tagRepository.getByNameAndType(
          name,
          'genre',
        );
        const tagId =
          existingTag?.id ??
          repositories.tagRepository.insert({ name, type: 'genre' }).id;

        repositories.mediaTagRepository.insert({ mediaId, tagId });
      });

      return { id: mediaId, created: true };
    });
  }

  function importTracks(tracks: Track[]) {
    return tracks.map((track) => importTrack(track));
  }

  function scanMissingMedia() {
    const repositories = createTxRepositories(db);
    const allMedia = repositories.mediaRepository.getAll();
    const missing: number[] = [];
    const found: number[] = [];

    allMedia.forEach((media) => {
      const exists = fs.existsSync(media.path);

      if (!exists && !media.isMissing) {
        repositories.mediaRepository.markAsMissing(media.id);
        missing.push(media.id);
      }

      if (exists && media.isMissing) {
        repositories.mediaRepository.markAsFound(media.id);
        found.push(media.id);
      }
    });

    return { missing, found };
  }

  function recordAudioPlayback(mediaId: number) {
    return db.transaction((tx) => {
      const audioHistoryRepository = createAudioHistoryRepository(tx);

      audioHistoryRepository.insert({ mediaId });
      audioHistoryRepository.incrementPlayCount(mediaId);

      return audioHistoryRepository.getByMediaId(mediaId);
    });
  }

  function deleteByPath(mediaPath: string) {
    const resolvedPath = path.resolve(mediaPath);
    const mediaRepository = createMediaRepository(db);
    const media = mediaRepository.getByPath(resolvedPath);

    if (!media) return null;

    mediaRepository.deleteById(media.id);
    return media;
  }

  return {
    importTrack,
    importTracks,
    scanMissingMedia,
    recordAudioPlayback,
    deleteByPath,
  };
}
