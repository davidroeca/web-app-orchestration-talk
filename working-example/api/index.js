'use strict';

const http = require('http');
const app = require('./app');

const server = http.createServer(app)

const serverConfig = {
  host: '0.0.0.0',
  port: 5000,
};

const serverCallback = () => {
  console.log('Listening on port 5000...');
};

server.listen(serverConfig, serverCallback);
