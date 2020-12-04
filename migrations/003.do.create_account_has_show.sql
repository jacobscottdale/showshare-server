CREATE TABLE account_has_show (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  trakt_id INTEGER NOT NULL,
  watch_status TEXT NOT NULL,
  added_on TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_on TIMESTAMPTZ NOT NULL DEFAULT now(),
  foreign key (user_id) references accounts (user_id),
  foreign key (trakt_id) references show (trakt_id)
);