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

module.exports = app;
