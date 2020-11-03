CREATE TABLE accounts (
  user_id serial PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password VARCHAR(50) NOT NULL,
  created_on TIMESTAMPTZ NOT NULL,
  last_login TIMESTAMPTZ
);