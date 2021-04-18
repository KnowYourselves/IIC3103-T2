const express = require('express');

const router = express.Router();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const test = await prisma.test.create({
    data: { test: 'wena xoro' },
  });

  res.status(201).json({
    test,
  });
});

module.exports = router;
