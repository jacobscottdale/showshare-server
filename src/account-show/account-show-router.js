const express = require('express');
const { end } = require('../middleware/logger');
const logger = require('../middleware/logger');
const path = require('path');
const AccountShowService = require('./account-show-service');
const accountShowRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

accountShowRouter
  .route('/:id')
  .get(requireAuth, (req, res, next) => {
    AccountShowService.getUserShows(req.app.get('db'), req.params.id)
      .then(userShows => {
        let showPromise = userShows.map(userShow =>
          AccountShowService.getShowDetails(req.app.get('db'), userShow));

        return Promise.all(showPromise)
          .then(showDetails => showDetails);
      })
      .then(shows => res
        .status(200)
        .json(shows)
      )
      .catch(next);
  });


accountShowRouter
  .route('/')
  .post(requireAuth, bodyParser, (req, res, next) => {
    for (const field of ['user_id', 'trakt_id', 'watch_status'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    AccountShowService.insertUserShow(req.app.get('db'), req.body)
      .then(userShow =>
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${userShow.user_id}`))
          .send(userShow)
      )
      .catch(next);
  })
  .patch(requireAuth, bodyParser, (req, res, next) => {
    for (const field of ['user_id', 'trakt_id', 'watch_status'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    AccountShowService.updateWatchStatus(req.app.get('db'), req.body)
      .then(userShow =>
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${userShow.user_id}`))
          .send(userShow)
      )
      .catch(next);
  })
  .delete(requireAuth, bodyParser, (req, res, next) => {
    for (const field of ['user_id', 'trakt_id'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    AccountShowService.removeUserShow(req.app.get('db'), req.body)
      .then(() =>
        res.status(204).end())
      .catch(next);
  });

module.exports = accountShowRouter;