CREATE TABLE `artist_tags` (
	`tag_id` integer NOT NULL,
	`artist_id` integer NOT NULL,
	PRIMARY KEY(`tag_id`, `artist_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `artist_tracks` (
	`artist_id` integer NOT NULL,
	`track_id` integer NOT NULL,
	PRIMARY KEY(`artist_id`, `track_id`),
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `artist_tracks_track_idx` ON `artist_tracks` (`track_id`);--> statement-breakpoint
CREATE TABLE `artists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`favorite` integer DEFAULT false NOT NULL,
	`date_favorited` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `artists_name_idx` ON `artists` (`name`);--> statement-breakpoint
CREATE INDEX `artists_favorite_idx` ON `artists` (`favorite`);--> statement-breakpoint
CREATE TABLE `playlist_tags` (
	`tag_id` integer NOT NULL,
	`playlist_id` integer NOT NULL,
	PRIMARY KEY(`tag_id`, `playlist_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `playlist_tracks` (
	`playlist_id` integer NOT NULL,
	`track_id` integer NOT NULL,
	`position` integer NOT NULL,
	`added_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	PRIMARY KEY(`playlist_id`, `track_id`),
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `playlist_tracks_track_idx` ON `playlist_tracks` (`track_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `playlist_tracks_playlist_order_idx` ON `playlist_tracks` (`playlist_id`,`position`);--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`cover` text,
	`description` text,
	`favorite` integer DEFAULT false NOT NULL,
	`date_favorited` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `playlists_title_idx` ON `playlists` (`title`);--> statement-breakpoint
CREATE INDEX `playlists_favorite_idx` ON `playlists` (`favorite`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `tags_name_idx` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `track_tags` (
	`tag_id` integer NOT NULL,
	`track_id` integer NOT NULL,
	PRIMARY KEY(`tag_id`, `track_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`duration` integer NOT NULL,
	`path` text NOT NULL,
	`cover` text,
	`play_count` integer DEFAULT 0 NOT NULL,
	`last_played` integer,
	`date_modified` integer,
	`favorite` integer DEFAULT false NOT NULL,
	`date_favorited` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tracks_path_unique_idx` ON `tracks` (`path`);--> statement-breakpoint
CREATE INDEX `tracks_title_idx` ON `tracks` (`title`);--> statement-breakpoint
CREATE INDEX `tracks_play_count_idx` ON `tracks` (`play_count`);--> statement-breakpoint
CREATE INDEX `tracks_favorite_idx` ON `tracks` (`favorite`);--> statement-breakpoint
CREATE INDEX `tracks_last_played_idx` ON `tracks` (`last_played`);