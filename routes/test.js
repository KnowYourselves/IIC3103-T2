const express = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const tests = await prisma.test.findMany();

  res.json({
    tests,
  });
});

module.exports = router;
