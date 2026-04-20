ALTER TABLE `playlists` ADD `slug` text;--> statement-breakpoint
CREATE UNIQUE INDEX `playlists_slug_unique` ON `playlists` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `albums_title_unique` ON `albums` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `artists_name_unique` ON `artists` (`name`);