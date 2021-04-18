const express = require('express');

const router = express.Router();

/*
* GET REQUESTS
*/

// GET all tracks.
router.get('/', async (req, res) => {
  res.json({
    endpoint: 'get all tracks',
  });
});

// GET an track
router.get('/:id', async (req, res) => {
  res.json({
    endpoint: `get track ${req.params.id}`,
  });
});

/*
* PUT REQUESTS
*/

// PUT (reproduce) a track
router.put('/:id/play', async (req, res) => {
  res.json({
    endpoint: `play the track ${req.params.id}`,
  });
});

/*
* DELETE REQUESTS
*/

// DELETE a track
router.delete('/:id', async (req, res) => {
  res.json({
    endpoint: `delete track ${req.params.id}`,
  });
});

module.exports = router;
