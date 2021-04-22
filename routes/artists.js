const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { annotateArtist, annotateAlbum, annotateTrack } = require('../lib/annotate_urls');
const stringToID = require('../lib/string_to_id');

const router = express.Router();

const prisma = new PrismaClient({
  rejectOnNotFound: true,
});

/*
 * AUX FUNCTIONS
*/

const getAllTracks = async (req) => {
  const { albums } = await prisma.artist.findUnique({
    where: { id: req.params.id },
    include: {
      albums: {
        select: {
          tracks: true,
        },
      },
    },
  });
  return albums.reduce((prev, current) => [...prev, ...current.tracks], []);
};

/*
* GET REQUESTS
*/

// GET all artists.
router.get('/', async (req, res) => {
  const artists = await prisma.artist.findMany();
  res.json(
    artists.map((artist) => annotateArtist(artist, req)),
  );
});

// GET an artist
router.get('/:id', async (req, res, next) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.json(annotateArtist(artist, req));
  } catch (err) {
    next(err);
  }
});

// GET all albums from an artist
router.get('/:id/albums', async (req, res, next) => {
  try {
    const { albums } = await prisma.artist.findUnique({
      where: { id: req.params.id },
      include: { albums: true },
    });
    res.json(albums.map((album) => annotateAlbum(album, req)));
  } catch (err) {
    next(err);
  }
});

// GET all tracks from an artist
router.get('/:id/tracks', async (req, res, next) => {
  try {
    const tracks = await getAllTracks(req);
    res.json(tracks.map((track) => annotateTrack(track, req.params.id, req)));
  } catch (err) {
    next(err);
  }
});

/*
* POST REQUESTS
*/

// POST a new artist
router.post('/', async (req, res, next) => {
  try {
    const { name, age } = req.body;
    const artist = await prisma.artist.create({
      data: {
        id: stringToID(name),
        name,
        age,
      },
    });
    res.status(201).json(annotateArtist(artist, req));
  } catch (err) {
    if (err.code === 'P2002') {
      const artist = await prisma.artist.findUnique({
        where: { id: stringToID(req.body.name) },
      });
      err.instance = annotateArtist(artist, req);
    }
    next(err);
  }
});

// POST a new album from an artist
router.post('/:id/albums', async (req, res, next) => {
  try {
    const { name, genre } = req.body;
    const album = await prisma.album.create({
      data: {
        id: stringToID(`${name}:${req.params.id}`),
        name,
        genre,
        artist: {
          connect: {
            id: req.params.id,
          },
        },
      },
    });
    res.status(201).json(annotateAlbum(album, req));
  } catch (err) {
    if (err.code === 'P2002') {
      const album = await prisma.album.findUnique({
        where: { id: stringToID(`${req.body.name}:${req.params.id}`) },
      });
      err.instance = annotateAlbum(album, req);
    }
    next(err);
  }
});

/*
* PUT REQUESTS
*/

// PUT (reproduce) all the songs from all the albums from an artist
router.put('/:id/albums/play', async (req, res, next) => {
  try {
    const tracks = await getAllTracks(req);
    await Promise.all(tracks.map(async ({ id }) => prisma.track.update({
      where: { id },
      data: { times_played: { increment: 1 } },
    })));
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

/*
* DELETE REQUESTS
*/

// DELETE an artist in cascade
router.delete('/:id', async (req, res, next) => {
  try {
    const albums = await prisma.album.findMany({
      where: {
        artist_id: req.params.id,
      },
    });

    await Promise.all(albums.map(async ({ id }) => {
      await prisma.album.update({
        where: { id },
        data: {
          tracks: {
            deleteMany: {},
          },
        },
      });
      await prisma.album.delete({
        where: { id },
      });
    }));

    await prisma.artist.delete({
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
