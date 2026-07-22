ALTER TABLE `albums` ADD `is_favorite` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `albums` ADD `favorited_at` integer;--> statement-breakpoint
ALTER TABLE `media` ADD `is_favorite` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `media` ADD `favorited_at` integer;--> statement-breakpoint
ALTER TABLE `playlists` ADD `is_favorite` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `playlists` ADD `favorited_at` integer;--> statement-breakpoint
CREATE INDEX `album_is_favorite_idx` ON `albums` (`is_favorite`);--> statement-breakpoint
CREATE INDEX `media_is_favorite_idx` ON `media` (`is_favorite`);--> statement-breakpoint
CREATE INDEX `playlist_is_favorite_idx` ON `playlists` (`is_favorite`);