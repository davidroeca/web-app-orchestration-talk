'use strict';

const path = require('path');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');
const webpackConfig = require('./webpack.config');

const { publicPath } = webpackConfig.output;

const config = {
  ...webpackConfig,
  serve: {
    host: '0.0.0.0',
    port: 8080,
    hotClient: {
      port: 34341,
      host: '0.0.0.0',
      allEntries: true,
      autoConfigure: true,
      reload: false,
      hmr: true,
    },
    open: {
      path: publicPath,
    },
    devMiddleware: {
      publicPath,
    },
    add: (app, middleware, options) => {
      const historyOptions = {
        index: path.join(publicPath, 'index.html'),
      };
      app.use(convert(history(historyOptions)));
    },
  },
};

module.exports = config;
