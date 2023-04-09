const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TenserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.cjs');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TenserPlugin()]
  },
  plugins: [new CleanWebpackPlugin()]
});
