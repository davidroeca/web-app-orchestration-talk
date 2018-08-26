'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');

const app = express();
app.use(bodyParser());
const router = express.Router();

router.get('/items', (req, res) => {
  models.ListItem.findAll()
    .then(items => {
      res.json({
        data: items,
        error: null,
      });
    })
    .catch(error => {
      res.json({
        data: [],
        error: error,
      })
    });
});

router.post('/items', (req, res) => {
  const { items } = req.body;
  models.ListItem.bulkCreate(items)
    .then(item => {
      res.json({
        data: items,
        error: null,
      })
    })
    .catch(error => {
      res.json({
        data: [],
        error: error,
      });
    });
});

app.use('/api', router);

module.exports = app;
