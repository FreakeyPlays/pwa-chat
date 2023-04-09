const common = require('./webpack.common.cjs');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: 'localhost',
    port: 8080,
    open: true,
    historyApiFallback: true
  }
});
