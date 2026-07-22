PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_albums` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL UNIQUE,
	`cover_path` text,
	`external_id` text,
	`external_source` text,
	`created_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	`modified_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_albums`(`id`, `title`, `cover_path`, `external_id`, `external_source`, `created_at`, `modified_at`) SELECT `id`, `title`, `cover_path`, `external_id`, `external_source`, `created_at`, `modified_at` FROM `albums`;--> statement-breakpoint
DROP TABLE `albums`;--> statement-breakpoint
ALTER TABLE `__new_albums` RENAME TO `albums`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`path` text NOT NULL UNIQUE,
	`duration` real,
	`cover_path` text,
	`resolution_w` integer,
	`resolution_h` integer,
	`codec` text,
	`language` text,
	`is_missing` integer DEFAULT false NOT NULL,
	`external_id` text,
	`external_source` text,
	`created_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	`modified_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_media`(`id`, `type`, `title`, `path`, `duration`, `cover_path`, `resolution_w`, `resolution_h`, `codec`, `language`, `is_missing`, `external_id`, `external_source`, `created_at`, `modified_at`) SELECT `id`, `type`, `title`, `path`, `duration`, `cover_path`, `resolution_w`, `resolution_h`, `codec`, `language`, `is_missing`, `external_id`, `external_source`, `created_at`, `modified_at` FROM `media`;--> statement-breakpoint
DROP TABLE `media`;--> statement-breakpoint
ALTER TABLE `__new_media` RENAME TO `media`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_playlists` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`cover` text,
	`type` text NOT NULL,
	`kind` text DEFAULT 'normal' NOT NULL,
	`sort_mode` text DEFAULT 'added_at' NOT NULL,
	`filters` text,
	`slug` text UNIQUE,
	`created_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	`modified_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_playlists`(`id`, `name`, `cover`, `type`, `kind`, `sort_mode`, `filters`, `slug`, `created_at`, `modified_at`) SELECT `id`, `name`, `cover`, `type`, `kind`, `sort_mode`, `filters`, `slug`, `created_at`, `modified_at` FROM `playlists`;--> statement-breakpoint
DROP TABLE `playlists`;--> statement-breakpoint
ALTER TABLE `__new_playlists` RENAME TO `playlists`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_watched_folders` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`path` text NOT NULL UNIQUE,
	`last_scanned_at` integer,
	`created_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	`modified_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_watched_folders`(`id`, `path`, `last_scanned_at`, `created_at`, `modified_at`) SELECT `id`, `path`, `last_scanned_at`, `created_at`, `modified_at` FROM `watched_folders`;--> statement-breakpoint
DROP TABLE `watched_folders`;--> statement-breakpoint
ALTER TABLE `__new_watched_folders` RENAME TO `watched_folders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_audio_history` (
	`media_id` integer PRIMARY KEY,
	`play_count` integer DEFAULT 0 NOT NULL,
	`last_played_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	CONSTRAINT `audio_history_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_audio_history`(`media_id`, `play_count`, `last_played_at`) SELECT `media_id`, `play_count`, `last_played_at` FROM `audio_history`;--> statement-breakpoint
DROP TABLE `audio_history`;--> statement-breakpoint
ALTER TABLE `__new_audio_history` RENAME TO `audio_history`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_video_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`media_id` integer NOT NULL,
	`stopped_at` real,
	`completed` integer,
	`played_at` integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
	CONSTRAINT `video_history_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_video_history`(`id`, `media_id`, `stopped_at`, `completed`, `played_at`) SELECT `id`, `media_id`, `stopped_at`, `completed`, `played_at` FROM `video_history`;--> statement-breakpoint
DROP TABLE `video_history`;--> statement-breakpoint
ALTER TABLE `__new_video_history` RENAME TO `video_history`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `albums_title_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `artists_name_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `media_path_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `playlists_slug_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `watched_folders_path_unique`;--> statement-breakpoint
CREATE INDEX `media_type_idx` ON `media` (`type`);--> statement-breakpoint
CREATE INDEX `media_is_missing_idx` ON `media` (`is_missing`);--> statement-breakpoint
CREATE INDEX `video_history_media_idx` ON `video_history` (`media_id`);--> statement-breakpoint
CREATE INDEX `video_history_played_at_idx` ON `video_history` (`played_at`);