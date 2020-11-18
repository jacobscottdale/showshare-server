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
      .then(shows => {
        AccountShowService.getShowDetails(req.app.get('db'), shows)
          .then(showDetails => res.json(showDetails))
      })
      .catch(next);
  });


module.exports = accountShowRouter;