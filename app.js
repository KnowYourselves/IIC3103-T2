const express = require('express');
const logger = require('morgan');
const indexRouter = require('./routes');

const app = express();

// general config
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/', indexRouter);

// 405
app.use((req, res, next) => {
  const allowed = ['GET', 'PUT', 'POST', 'DELETE'];
  if (!allowed.includes(req.method)) {
    res.sendStatus(405);
  }
  next();
});

// error handling
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

module.exports = app;
