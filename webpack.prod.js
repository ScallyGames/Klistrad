const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const coreConfig = require('./webpack.config');

module.exports = {
    ... coreConfig,
    mode: 'production',
};