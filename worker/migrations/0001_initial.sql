CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  parent_id TEXT REFERENCES messages(id),
  author TEXT NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  delete_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  hidden INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS messages_roots ON messages(parent_id, created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  next_at INTEGER NOT NULL
);
