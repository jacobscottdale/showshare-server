CREATE TABLE accounts (
  user_id serial PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_on TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);