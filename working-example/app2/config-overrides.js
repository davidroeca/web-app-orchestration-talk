'use strict';
const webpack = require('webpack');
const express = require('express');

const getClientEnvironment = require('react-scripts/config/env');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const { paths } = require('react-app-rewired')
const removeWebpackPlugins = require('react-app-rewire-unplug');

const publicPath = '/app2/'
const publicUrl = '/app2/'

module.exports = {
  webpack: (config, env) => {
    if (env === 'production') {
      return config;
    }
    config = removeWebpackPlugins(config, env, {
      pluginNames: ['InterpolateHtmlPlugin', 'DefinePlugin'],
      verbose: true,
    });
    const clientEnv = getClientEnvironment(publicPath);
    return {
      ...config,
      output: {
        ...config.output,
        publicPath,
      },
      plugins: [
        new InterpolateHtmlPlugin(clientEnv.raw),
        new webpack.DefinePlugin(clientEnv.stringified),
        ...config.plugins,
      ],
    };
  },
  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const devConfig = configFunction(proxy, allowedHost);
      return {
        ...devConfig,
        contentBase: paths.appPublic,
        publicPath: publicPath,
        historyApiFallback: {
          ...devConfig.historyApiFallback,
          index: publicPath,
        },
      };
    };
  },
};
