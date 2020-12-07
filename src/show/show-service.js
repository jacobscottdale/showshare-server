const config = require('../config');
const fetch = require('node-fetch');

const ShowService = {
  getAllShows(db) {
    return db.select('*').from('show');
  },

  insertShow(db, newShow) {
    return db
      .insert(newShow)
      .into('show')
      .returning('*')
      .then(([show]) => show);
  },

  getById(db, trakt_id) {
    return db
      .from('show')
      .select('*')
      .where({ trakt_id })
      .first();
  },

  idInUse(db, trakt_id) {
    return db('show')
      .where({ trakt_id })
      .first()
      .then(show => !!show);
  },

  fetchShow(id) {
    return fetch(`${config.TRAKT_API_URL}/shows/${id}?extended=full`, {
      headers: {
        'Content-type': 'application/json',
        'trakt-api-key': config.TRAKT_API_KEY,
        'trakt-api-version': '2'
      }
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Trakt response was not ok');
        return res.json();
      })
      .then(traktData => {
        console.log(traktData);
        return {
          trakt_id: traktData.ids.trakt,
          title: traktData.title,
          slug: traktData.ids.slug,
          imdb_id: traktData.ids.imdb,
          year: traktData.year,
          overview: traktData.overview,
          network: traktData.network,
          updated_at: traktData.updated_at,
          aired_episodes: traktData.aired_episodes,
          status: traktData.status,
          tmdb_id: traktData.ids.tmdb
        };
      })
      .catch(err => {
        console.log(err);
      });
  },

  fetchShowImage(tmdb_id) {
    return fetch(`${config.TMDB_API_URL}/tv/${tmdb_id}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${config.TMDB_API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok)
          return 'false';
        return res.json();
      })
      .then(tmdbData => tmdbData.poster_path)
      .catch(err => console.log(err));
  },

  fetchSearch(searchTerm) {
    return fetch(`${config.TRAKT_API_URL}/search/show?query=${searchTerm}`, {
      headers: {
        'Content-type': 'application/json',
        'trakt-api-key': config.TRAKT_API_KEY,
        'trakt-api-version': '2'
      }
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Network response was not ok');
        return res.json();
      })
      .then(resJson => {
        return resJson
      })
      .catch(err => {
        console.log(err);
      });
  }
};

module.exports = ShowService;