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

module.exports = accountShowRouter;