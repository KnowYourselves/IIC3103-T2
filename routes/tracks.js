const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { annotateTrack } = require('../lib/annotate_urls');

const router = express.Router();
const prisma = new PrismaClient({
  rejectOnNotFound: true,
});

/*
* GET REQUESTS
*/

// GET all tracks.
router.get('/', async (req, res) => {
  const tracks = await prisma.track.findMany({
    include: {
      album: {
        select: { artist_id: true },
      },
    },
  });
  res.json(tracks.map((track) => annotateTrack(track, req)));
});

// GET a track
router.get('/:id', async (req, res, next) => {
  try {
    const track = await prisma.track.findUnique({
      where: { id: req.params.id },
      include: {
        album: {
          select: { artist_id: true },
        },
      },
    });
    res.json(annotateTrack(track, req));
  } catch (err) {
    next(err);
  }
});

/*
* PUT REQUESTS
*/

// PUT (reproduce) a track
router.put('/:id/play', async (req, res, next) => {
  try {
    await prisma.track.update({
      where: { id: req.params.id },
      data: {
        times_played: { increment: 1 },
      },
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

/*
* DELETE REQUESTS
*/

// DELETE a track
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.track.delete({
      where: { id: req.params.id },
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
