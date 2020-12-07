module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/showshare',
  JWT_SECRET: process.env.JWT_SECRET || 'temporary',
  TRAKT_API_URL: process.env.TRAKT_API_URL || 'https://api.trakt.tv',
  TRAKT_API_KEY: process.env.TRAKT_API_KEY,
  TMDB_API_URL: process.env.TMDB_API_URL || 'https://api.themoviedb.org/3',
  TMDB_API_KEY: process.env.TMDB_API_KEY,
}