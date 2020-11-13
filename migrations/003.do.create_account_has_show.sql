CREATE TABLE account_has_show (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,
  watch_status TEXT NOT NULL DEFAULT 'Unwatched'
);