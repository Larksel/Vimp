import { defineRelations } from 'drizzle-orm';
import { albums } from './schema/albums';
import { artists } from './schema/artists';
import { albumArtists } from './schema/albumArtists';
import { audioHistory } from './schema/audioHistory';
import { media } from './schema/media';
import { mediaAlbums } from './schema/mediaAlbums';
import { mediaArtists } from './schema/mediaArtists';
import { mediaTags } from './schema/mediaTags';
import { playlistItems } from './schema/playlistItems';
import { tags } from './schema/tags';
import { videoHistory } from './schema/videoHistory';
import { playlists } from './schema/playlists';

export const relations = defineRelations(
  {
    albumArtists,
    albums,
    artists,
    audioHistory,
    media,
    mediaAlbums,
    mediaArtists,
    mediaTags,
    playlists,
    playlistItems,
    tags,
    videoHistory,
  },
  (r) => ({
    albums: {
      artists: r.many.artists({
        from: r.albums.id.through(r.albumArtists.albumId),
        to: r.artists.id.through(r.albumArtists.artistId),
      }),
      media: r.many.media({
        from: r.albums.id.through(r.mediaAlbums.albumId),
        to: r.media.id.through(r.mediaAlbums.mediaId),
      }),
    },

    artists: {
      albums: r.many.albums(),
      media: r.many.media({
        from: r.artists.id.through(r.mediaArtists.artistId),
        to: r.media.id.through(r.mediaArtists.mediaId),
      }),
    },

    audioHistory: {
      track: r.one.media({
        from: r.audioHistory.mediaId,
        to: r.media.id,
        where: {
          type: 'audio',
        },
      }),
    },

    videoHistory: {
      items: r.one.media({
        from: r.videoHistory.mediaId,
        to: r.media.id,
        where: {
          type: 'video',
        },
      }),
    },

    media: {
      albums: r.many.albums(),
      artists: r.many.artists(),
      tags: r.many.tags(),
      playlists: r.many.playlists(),
      videoHistoryEntries: r.many.videoHistory(),
    },

    tags: {
      media: r.many.media({
        from: r.tags.id.through(r.mediaTags.tagId),
        to: r.media.id.through(r.mediaTags.mediaId),
      }),
    },

    playlists: {
      items: r.many.media({
        from: r.playlists.id.through(r.playlistItems.playlistId),
        to: r.media.id.through(r.playlistItems.mediaId),
      }),
    },
  }),
);
