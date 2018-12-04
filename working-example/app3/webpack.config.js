'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const publicPath = '/app3/';

const PATHS = {
  src: path.join(__dirname, 'src'),
  // Make sure build has relative paths to publicPath
  build: path.join(__dirname, 'build', publicPath.replace(/\/$/, '')),
};


const config = {
  mode: 'development',
  entry: [
    '@babel/polyfill',
    path.join(PATHS.src, 'index.js'),
  ],
  output: {
    filename: 'bundle.js',
    path: PATHS.build,
    publicPath,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index_template.ejs',
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [PATHS.src],
        exclude: [/node_modules/],
        loader: 'babel-loader',
      },
    ],
  },
};

module.exports = config;
