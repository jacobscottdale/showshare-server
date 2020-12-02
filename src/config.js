module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DB_URL: process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/bookmarks',
  JWT_SECRET: process.env.JWT_SECRET || 'temporary',
  TRAKT_API_URL: process.env.TRAKT_API_URL || 'https://api.trakt.tv',
  TRAKT_API_KEY: process.env.TRAKT_API_KEY,
  TMDB_API_URL: process.env.TMDB_API_URL || 'https://api.themoviedb.org/3',
  TMDB_API_KEY: process.env.TMDB_API_KEY,
}