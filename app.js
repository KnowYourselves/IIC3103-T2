const express = require('express');
const logger = require('morgan');
const { Prisma } = require('@prisma/client');
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
  console.log({
    err,
  });

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.sendStatus(400);
  } else if (err.code === '404' || err.name === 'NotFoundError') {
    res.sendStatus(404);
  } else if (err.code === 'P2002') {
    res.status(409).send(err.instance);
  } else if (err.code === 'P2025') {
    res.sendStatus(422);
  } else {
    res.sendStatus(500);
  }
});

module.exports = app;
