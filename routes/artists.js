const express = require('express');

const router = express.Router();

/*
* GET REQUESTS
*/

// GET all artists.
router.get('/', async (req, res) => {
  res.json({
    endpoint: 'get all artists',
  });
});

// GET an artist
router.get('/:id', async (req, res) => {
  res.json({
    endpoint: `get artist ${req.params.id}`,
  });
});

// GET all albums from an artist
router.get('/:id/albums', async (req, res) => {
  res.json({
    endpoint: `get all albums from artist ${req.params.id}`,
  });
});

// GET all tracks from an artist
router.get('/:id/tracks', async (req, res) => {
  res.json({
    endpoint: `get all tracks from artist ${req.params.id}`,
  });
});

/*
* POST REQUESTS
*/

// POST a new artist
router.post('/', async (req, res) => {
  res.json({
    endpoint: 'create a new artist',
  });
});

// POST a new album from an artist
router.post('/:id/albums', async (req, res) => {
  res.json({
    endpoint: `create a new album from artist ${req.params.id}`,
  });
});

/*
* PUT REQUESTS
*/

// PUT (reproduce) all the songs from all the albums from an artist
router.put('/:id/albums/play', async (req, res) => {
  res.json({
    endpoint: `play all albums from artist ${req.params.id}`,
  });
});

/*
* DELETE REQUESTS
*/

// DELETE an artist in cascade
router.delete('/:id', async (req, res) => {
  res.json({
    endpoint: `delete artist ${req.params.id}`,
  });
});

module.exports = router;
