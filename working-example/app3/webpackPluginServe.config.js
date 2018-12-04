'use strict';

const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackConfig = require('./webpack.config.js');

const {
  plugins,
  entry,
  output: {
    path: outputPath,
  },
} = webpackConfig;

const serveOptions = {
  port: 5001,
  static: [
    'build',
  ],
};

const serveConfig = {
  ...webpackConfig,
  entry: [
    'webpack-plugin-serve/client',
    ...entry,
  ],
  plugins: [
    ...plugins,
    new Serve(serveOptions),
  ],
  watch: true,
};

module.exports = serveConfig;
