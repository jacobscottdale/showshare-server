CREATE TABLE account_has_show (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  trakt_id INTEGER NOT NULL,
  watch_status TEXT NOT NULL,
  foreign key (user_id) references accounts (user_id),
  foreign key (trakt_id) references show (trakt_id)
);