const express = require('express');

const router = express.Router();

const artistsRouter = require('./artists');
const albumsRouter = require('./albums');

router.use('/artists', artistsRouter);
router.use('/albums', albumsRouter);

module.exports = router;
