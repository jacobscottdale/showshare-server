const express = require('express');
const path = require('path');
const AccountShowService = require('./account-show-service');
const accountShowRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

accountShowRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    AccountShowService.getUserShows(
      req.app.get('db'),
      req.user.user_id
    )
      .then(userShows => {
        let showPromise = userShows.map(userShow =>
          AccountShowService.getShowDetails(
            req.app.get('db'),
            userShow));

        return Promise.all(showPromise)
          .then(showDetails => showDetails);
      })
      .then(shows =>
        res
          .status(200)
          .json(shows)
      )
      .catch(next);
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    for (const field of [
      'trakt_id',
      'watch_status'
    ])
      if (!req.body[field])
        return res
          .status(400)
          .json({
            error: `Missing '${field}' in request body`
          });

    const user_id = req.user.user_id;
    const { trakt_id, watch_status } = req.body;

    AccountShowService.getUserShows(
      req.app.get('db'),
      user_id
    )
      .then(userShows => {
        if (userShows.find(show => show.trakt_id === trakt_id)) {
          return res
            .status(400)
            .json({
              error: `User already has show with trakt_id ${trakt_id}`
            });
        }
        else {
          AccountShowService.insertUserShow(
            req.app.get('db'),
            user_id,
            trakt_id,
            watch_status
          )
            .then(userShow =>
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${userShow.user_id}`))
                .send(userShow)
            );
        }
      })
      .catch(next);
  })
  .patch(requireAuth, bodyParser, (req, res, next) => {
    for (const field of [
      'trakt_id',
      'watch_status'
    ])
      if (!req.body[field])
        return res
          .status(400)
          .json({
            error: `Missing '${field}' in request body`
          });

    const user_id = req.user.user_id;
    const { trakt_id, watch_status } = req.body;

    AccountShowService.updateWatchStatus(
      req.app.get('db'),
      user_id,
      trakt_id,
      watch_status
    )
      .then(userShow =>
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${userShow.user_id}`))
          .send(userShow)
      )
      .catch(next);
  })
  .delete(requireAuth, bodyParser, (req, res, next) => {
    if (!req.body.trakt_id)
      return res
        .status(400)
        .json({
          error: `Missing '${field}' in request body`
        });

    const user_id = req.user.user_id;
    const { trakt_id } = req.body;

    AccountShowService.removeUserShow(
      req.app.get('db'),
      user_id, trakt_id)
      .then(res.status(204).end())
      .catch(next);
  });

module.exports = accountShowRouter;