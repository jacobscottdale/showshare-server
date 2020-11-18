const express = require('express');
const { end } = require('../middleware/logger');
const logger = require('../middleware/logger');
const path = require('path');
const ShowService = require('./show-service');
const showRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

showRouter
  .route('/')
  .get((req, res, next) => {
    ShowService.getAllShows(req.app.get('db'))
      .then(shows => {
        if (!shows[0])
          return res.status(400).json({
            error: 'No shows available',
          });
        return res.json(shows);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ['trakt_id', 'title', 'slug', 'imdb_id', 'year', 'overview', 'network', 'updated_at', 'aired_episodes', 'status'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    ShowService.idInUse(req.app.get('db'), req.body.trakt_id)
      .then(idInUse => {
        if (idInUse)
          return res.status(400).json({ error: 'Show already exists in database' });
        ShowService.insertShow(req.app.get('db'), req.body)
          .then(show => {
            return res.status(201)
              .location(path.posix.join(req.originalUrl, `/${show.trakt_id}`))
              .send(show);
          });
      })
      .catch(next);
  });

showRouter
  .route('/:id')
  .get((req, res, next) => {
    const showId = req.params.id;
    ShowService.getById(
      req.app.get('db'),
      showId
    )
      .then(dbShow => {
        if (!dbShow) {
          console.log('show not in db')
          ShowService.fetchShow(showId)
            .then(fetchedShow => {
              ShowService.insertShow(req.app.get('db'), fetchedShow)
                .then(insertedShow => {
                  return res.json(insertedShow);
                });
            })
            .catch(next)
        } else {
          console.log('show in db')
          return res.json(dbShow);
        }
      })
      .catch(next);
  });

showRouter
  .route('/search/:searchTerm')
  .get((req, res, next) => {
    const { searchTerm } = req.params
    ShowService.fetchSearch(searchTerm)
      .then(showResults => {
        console.log(showResults)
        return res.json(showResults)
      })
      
  })

module.exports = showRouter;