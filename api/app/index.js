'use strict';

const express = require('express');
const app = express();
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({
    data: 'Hello, world!'
  });
});

app.use('/api', router);

module.exports = app;
