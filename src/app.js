require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const accountsRouter = require('./accounts/accounts-router')
const errorHandler = require('./error-handler')

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors({
  origin: CLIENT_ORIGIN
}));

app.use(accountsRouter)

app.get('/api/*', (req, res) => {
  res.json({ok: true});
})

app.use(errorHandler)

module.exports = app;