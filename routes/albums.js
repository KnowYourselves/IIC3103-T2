const express = require('express');

const router = express.Router();

/*
* GET REQUESTS
*/

// GET all albums.
router.get('/', async (req, res) => {
  res.json({
    endpoint: 'get all albums',
  });
});

// GET an album
router.get('/:id', async (req, res) => {
  res.json({
    endpoint: `get album ${req.params.id}`,
  });
});

// GET all tracks from an album
router.get('/:id/tracks', async (req, res) => {
  res.json({
    endpoint: `get all tracks from album ${req.params.id}`,
  });
});

/*
* POST REQUESTS
*/

// POST a new track in an album
router.post('/:id/tracks', async (req, res) => {
  res.json({
    endpoint: `create a new track in album ${req.params.id}`,
  });
});

/*
* PUT REQUESTS
*/

// PUT (reproduce) all the songs from an album
router.put('/:id/tracks/play', async (req, res) => {
  res.json({
    endpoint: `play all tracks from album ${req.params.id}`,
  });
});

/*
* DELETE REQUESTS
*/

// DELETE an album in cascade
router.delete('/:id', async (req, res) => {
  res.json({
    endpoint: `delete album ${req.params.id}`,
  });
});

module.exports = router;
