'use strict';

const presets = [
  '@babel/preset-env',
  '@babel/preset-react',
];
const plugins = [
  'react-hot-loader/babel',
  '@babel/proposal-object-rest-spread',
  '@babel/proposal-optional-chaining',
  '@babel/proposal-class-properties',
];

module.exports = {
  presets,
  plugins,
}
