CREATE VIRTUAL TABLE IF NOT EXISTS media_fts USING fts5(
  title,
  content='media',
  content_rowid='id'
);

CREATE TRIGGER IF NOT EXISTS media_fts_insert AFTER INSERT ON media BEGIN
  INSERT INTO media_fts(rowid, title) VALUES (new.id, new.title);
END;

CREATE TRIGGER IF NOT EXISTS media_fts_update AFTER UPDATE ON media BEGIN
  INSERT INTO media_fts(media_fts, rowid, title) VALUES ('delete', old.id, old.title);
  INSERT INTO media_fts(rowid, title) VALUES (new.id, new.title);
END;

CREATE TRIGGER IF NOT EXISTS media_fts_delete AFTER DELETE ON media BEGIN
  INSERT INTO media_fts(media_fts, rowid, title) VALUES ('delete', old.id, old.title);
END;