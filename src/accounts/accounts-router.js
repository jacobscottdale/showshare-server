const express = require('express');
const { end } = require('../middleware/logger');
const logger = require('../middleware/logger');
const path = require('path');
const AccountsService = require('./accounts-service');
const accountsRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

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
    const { password, username, first_name, last_name } = req.body;

    for (const field of ['first_name', 'last_name', 'username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    const passwordError = AccountsService.validatePassword(password);

    if (passwordError)
      return res.status(400).json({ error: passwordError });

    AccountsService.usernameInUse(
      req.app.get('db'),
      username
    )
      .then(usernameInUse => {
        if (usernameInUse)
          return res.status(400).json({ error: `Username already taken` });
        return AccountsService.hashPassword(password)
          .then(hashedPassword => {
            const newAccount = {
              first_name,
              last_name,
              username,
              password: hashedPassword,
              created_on: 'now()',
            };

            return AccountsService.createAccount(
              req.app.get('db'),
              newAccount
            )
              .then(account => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${account.user_id}`))
                  .json(AccountsService.serializeAccount(account));
              });
          });
      })
      .catch(next);
  });

accountsRouter
  .route('/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    AccountsService.getById(knexInstance, req.params.user_id)
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
    AccountsService.getById(knexInstance, req.params.user_id)
      .then(account => {
        if (!account) {
          return res.status(404).json({
            error: { message: `Account doesn't exist` }
          });
        } else {
          AccountsService.deleteAccount(
            knexInstance, req.params.user_id
          )
            .then(res.status(204).end());
        }
      })
      .catch(next);
  });

module.exports = accountsRouter;