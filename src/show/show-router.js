const express = require('express');
const path = require('path');
const ShowService = require('./show-service');
const showRouter = express.Router();
const bodyParser = express.json();

const validateResults = showResults => {
  const hasIds = showResults.filter(showObj => showObj.show.ids.imdb
    && showObj.show.ids.tmdb);
  const tmdbIds = hasIds.map(showObj => showObj.show.ids.tmdb);
  const filtered = showResults.filter((showObj, index) => !tmdbIds.includes(showObj.show.ids.tmdb, index + 1));
  return filtered;
};

showRouter
  .route('/')
  .get((req, res, next) => {
    ShowService.getAllShows(req.app.get('db'))
      .then(shows => {
        if (!shows[0])
          return res.status(400).json({
            error: 'No shows available',
          });
        return res
          .status(200)
          .json(shows);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of [
      'trakt_id',
      'title',
      'slug',
      'imdb_id',
      'year',
      'overview',
      'network',
      'updated_at',
      'aired_episodes',
      'status',
      'tvdb_id'])
      if (!req.body[field])
        return res
          .status(400)
          .json({
            error: `Missing '${field}' in request body`
          });

    ShowService.idInUse(
      req.app.get('db'),
      req.body.trakt_id
    )
      .then(idInUse => {
        if (idInUse)
          return res
            .status(400)
            .json({
              error: 'Show already exists in database'
            });
        ShowService.insertShow(
          req.app.get('db'),
          req.body
        )
          .then(show => {
            return res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${show.trakt_id}`))
              .json(show);
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
          // If show is not already in the database, fetch show details from trakt and insert into the database
          ShowService.fetchShow(showId)
            .then(fetchedShow => {
              ShowService.fetchShowImage(fetchedShow.tmdb_id)
                .then(tmdb_image_path => {
                  const showObject = { ...fetchedShow, tmdb_image_path };
                  ShowService.insertShow(
                    req.app.get('db'),
                    showObject
                  )
                    .then(insertedShow => res
                      .status(200)
                      .json(insertedShow)
                    );
                });
            })
            .catch(next);
        } else {
          // If show is already in the database simply return the database entry
          return res
            .status(200)
            .json(dbShow);
        }
      })
      .catch(next);
  });

showRouter
  .route('/search/:searchTerm')
  .get((req, res, next) => {
    const { searchTerm } = req.params;
    ShowService.fetchSearch(searchTerm)
      .then(showResults => res
        .status(200)
        .json(validateResults(showResults)))
      .catch(next);
  });

module.exports = showRouter;