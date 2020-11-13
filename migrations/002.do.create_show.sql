CREATE TABLE show (
  trakt_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  imdb_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  overview TEXT NOT NULL,
  network TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  aired_episodes INTEGER NOT NULL,
  status TEXT NOT NULL
);