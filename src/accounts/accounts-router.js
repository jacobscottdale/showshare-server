const express = require('express');
const { end } = require('../middleware/logger');
const logger = require('../middleware/logger');
const AccountsService = require('./accounts-service');
const accountsRouter = express.Router();
const bodyParser = express.json();
const bcrypt = require('bcryptjs');
const { requireAuth } = require('../middleware/jwt-auth')

accountsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    AccountsService.getAllAccounts(knexInstance)
      .then(accounts => {
        res.json(accounts);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { first_name, last_name, username, password } = req.body;
    bcrypt.hash(password, 10)
    bcrypt.compare
    const newAccount = { first_name, last_name, username, password };
    AccountsService.createAccount(
      req.app.get('db'),
      newAccount
    )
      .then(account => {
        res
          .status(201)
          .location(`/api/accounts/${account.id}`)
          .json(account);
      })
      .catch(next);
  });

accountsRouter
  .route('/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    AccountsService.getById(knexInstance, req.params.id)
      .then(account => {
        if (!account) {
          return res.status(404).json({
            error: { message: `Account doesn't exist` }
          });
        }
        res.json(account);
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    AccountsService.getById(knexInstance, req.params.id)
      .then(account => {
        if (!account) {
          return res.status(404).json({
            error: { message: `Account doesn't exist` }
          });
        } else {
          AccountsService.deleteAccount(
            knexInstance, req.params.id
          )
            .then(res.status(204).end());
        }
      })
      .catch(next);
  });

module.exports = accountsRouter;