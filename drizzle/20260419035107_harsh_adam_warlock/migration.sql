CREATE TABLE `album_artists` (
	`album_id` integer NOT NULL,
	`artist_id` integer NOT NULL,
	PRIMARY KEY(`album_id`, `artist_id`),
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `album_artists_artist_idx` ON `album_artists` (`artist_id`);--> statement-breakpoint
CREATE TABLE `albums` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`cover_path` text,
	`external_id` text,
	`external_source` text,
	`created_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	`modified_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `artists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`cover_path` text,
	`is_favorite` integer DEFAULT false NOT NULL,
	`favorited_at` integer,
	`external_id` text,
	`external_source` text,
	`created_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	`modified_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `artists_name_idx` ON `artists` (`name`);--> statement-breakpoint
CREATE INDEX `artists_is_favorite_idx` ON `artists` (`is_favorite`);--> statement-breakpoint
CREATE TABLE `audio_history` (
	`media_id` integer PRIMARY KEY NOT NULL,
	`play_count` integer DEFAULT 0 NOT NULL,
	`last_played_at` integer,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`path` text NOT NULL,
	`duration` real,
	`cover_path` text,
	`resolution_w` integer,
	`resolution_h` integer,
	`codec` text,
	`language` text,
	`bitrate` integer,
	`sample_rate` integer,
	`is_missing` integer DEFAULT false NOT NULL,
	`external_id` text,
	`external_source` text,
	`created_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	`modified_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_path_unique` ON `media` (`path`);--> statement-breakpoint
CREATE INDEX `media_type_idx` ON `media` (`type`);--> statement-breakpoint
CREATE INDEX `media_is_missing_idx` ON `media` (`is_missing`);--> statement-breakpoint
CREATE TABLE `media_albums` (
	`media_id` integer NOT NULL,
	`album_id` integer NOT NULL,
	PRIMARY KEY(`media_id`, `album_id`),
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `media_albums_album_idx` ON `media_albums` (`album_id`);--> statement-breakpoint
CREATE TABLE `media_artists` (
	`media_id` integer NOT NULL,
	`artist_id` integer NOT NULL,
	PRIMARY KEY(`media_id`, `artist_id`),
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `media_artists_artist_idx` ON `media_artists` (`artist_id`);--> statement-breakpoint
CREATE TABLE `media_tags` (
	`media_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`media_id`, `tag_id`),
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `media_tags_tag_idx` ON `media_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `playlist_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`playlist_id` integer NOT NULL,
	`media_id` integer NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`added_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `playlist_items_playlist_idx` ON `playlist_items` (`playlist_id`);--> statement-breakpoint
CREATE INDEX `playlist_items_media_idx` ON `playlist_items` (`media_id`);--> statement-breakpoint
CREATE INDEX `playlist_items_playlist_position_idx` ON `playlist_items` (`playlist_id`,`position`);--> statement-breakpoint
CREATE UNIQUE INDEX `playlist_items_playlist_media_uidx` ON `playlist_items` (`playlist_id`,`media_id`);--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`cover` text,
	`type` text NOT NULL,
	`kind` text DEFAULT 'normal' NOT NULL,
	`sort_mode` text DEFAULT 'added_at' NOT NULL,
	`filters` text,
	`created_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	`modified_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `tags_type_idx` ON `tags` (`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_type_uidx` ON `tags` (`name`,`type`);--> statement-breakpoint
CREATE TABLE `video_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`media_id` integer NOT NULL,
	`stopped_at` real,
	`completed` integer,
	`played_at` integer,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `video_history_media_idx` ON `video_history` (`media_id`);--> statement-breakpoint
CREATE INDEX `video_history_played_at_idx` ON `video_history` (`played_at`);--> statement-breakpoint
CREATE TABLE `watched_folders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`last_scanned_at` integer,
	`created_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	`modified_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `watched_folders_path_unique` ON `watched_folders` (`path`);