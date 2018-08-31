'use strict';

const http = require('http');

const express = require('express');

// --------------------------------------------------------
// Define the app
// --------------------------------------------------------
const app = express();
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({
    data: 'Hello, world!  '.trimEnd(), // introduce bug for node < 10
  });
});

app.use('/api', router);

// --------------------------------------------------------
// Run the app
// --------------------------------------------------------
const server = http.createServer(app)

const serverConfig = {
  host: '0.0.0.0',
  port: 5000,
};

const serverCallback = () => {
  console.log('Listening on port 5000...');
};

server.listen(serverConfig, serverCallback);
