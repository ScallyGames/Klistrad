const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const coreConfig = require('./webpack.config');

module.exports = {
    ... coreConfig,
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 3000,
    },
};