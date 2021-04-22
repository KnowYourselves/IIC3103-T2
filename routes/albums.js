const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { annotateAlbum, annotateTrack } = require('../lib/annotate_urls');
const stringToID = require('../lib/string_to_id');

const prisma = new PrismaClient({
  rejectOnNotFound: true,
});
const router = express.Router();

/*
* GET REQUESTS
*/

// GET all albums.
router.get('/', async (req, res) => {
  const albums = await prisma.album.findMany();
  res.json(albums.map((album) => annotateAlbum(album, req)));
});

// GET an album
router.get('/:id', async (req, res, next) => {
  try {
    const album = await prisma.album.findUnique({
      where: { id: req.params.id },
    });
    res.json(annotateAlbum(album, req));
  } catch (err) {
    next(err);
  }
});

// GET all tracks from an album
router.get('/:id/tracks', async (req, res, next) => {
  try {
    const { tracks, artist_id: artistId } = await prisma.album.findUnique({
      where: { id: req.params.id },
      include: {
        tracks: true,
      },
    });
    res.json(tracks.map((track) => annotateTrack(track, artistId, req)));
  } catch (err) {
    next(err);
  }
});

/*
* POST REQUESTS
*/

// POST a new track in an album
router.post('/:id/tracks', async (req, res, next) => {
  const { artist_id: artistId } = await prisma.album.findUnique({
    where: { id: req.params.id },
  });

  try {
    const { name, duration } = req.body;
    const track = await prisma.track.create({
      data: {
        id: stringToID(`${name}:${req.params.id}`),
        name,
        duration,
        times_played: 0,
        album: {
          connect: {
            id: req.params.id,
          },
        },
      },
    });
    res.status(201).json(annotateTrack(track, artistId, req));
  } catch (err) {
    if (err.code === 'P2002') {
      const track = await prisma.track.findUnique({
        where: { id: stringToID(`${req.body.name}:${req.params.id}`) },
      });
      err.instance = annotateTrack(track, artistId, req);
    }
    next(err);
  }
});

/*
* PUT REQUESTS
*/

// PUT (reproduce) all the songs from an album
router.put('/:id/tracks/play', async (req, res, next) => {
  try {
    await prisma.album.update({
      where: { id: req.params.id },
      data: {
        tracks: {
          updateMany: {
            where: {
              album_id: req.params.id,
            },
            data: {
              times_played: { increment: 1 },
            },
          },
        },
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

// DELETE an album in cascade
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.album.update({
      where: { id: req.params.id },
      data: {
        tracks: {
          deleteMany: {},
        },
      },
    });
    await prisma.album.delete({
      where: { id: req.params.id },
    });
    res.sendStatus(204);
  } catch (err) {
    if (err.code === 'P2025') {
      err.code = '404';
    }
    next(err);
  }
});

module.exports = router;
