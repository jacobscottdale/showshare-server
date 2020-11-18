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

  updateShow(db, id, newShowField) {

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
          throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        return {
          trakt_id: data.ids.trakt,
          title: data.title,
          slug: data.ids.slug,
          imdb_id: data.ids.imdb,
          year: data.year,
          overview: data.overview,
          network: data.network,
          updated_at: data.updated_at,
          aired_episodes: data.aired_episodes,
          status: data.status
        }
      })
      .catch(err => {
        console.log(err);
      });
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
      .catch(err => {
        console.log(err);
      });
  }
};

module.exports = ShowService;