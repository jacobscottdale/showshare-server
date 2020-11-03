const express = require('express');
const logger = require('../logger');
const AccountsService = require('./accounts-service');
const accountsRouter = express.Router();
const bodyParser = express.json();

accountsRouter
  .route('/api/accounts')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    AccountsService.getAllAccounts(knexInstance)
      .then(accounts => {
        res.json(accounts);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res) => {
    const knexInstance = req.app.post
  })

accountsRouter
  .route('/api/accounts/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    AccountsService.getById(knexInstance, req.params.id)
      .then(account => {
        if (!account) {
          return res.status(404).json({
            error: { message: `Account doesn't exist` }
          })
        }
        res.json(account);
      })
      .catch(next);
  });

module.exports = accountsRouter;