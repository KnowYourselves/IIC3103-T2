const express = require('express');

const router = express.Router();

const artistsRouter = require('./artists');
const albumsRouter = require('./albums');
const tracksRouter = require('./tracks');

router.use('/artists', artistsRouter);
router.use('/albums', albumsRouter);
router.use('/tracks', tracksRouter);

module.exports = router;
