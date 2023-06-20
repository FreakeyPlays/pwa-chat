const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: './src/main.ts',
    sw: './src/sw.ts'
  },
  output: {
    path: path.resolve(__dirname, 'src/dist'),
    filename: `[name].js`,
    clean: true,
    assetModuleFilename: pathData => {
      const filepath = path
        .dirname(pathData.filename)
        .split('/')
        .slice(1)
        .join('/');
      return `${filepath}/[name][ext]`;
    }
  },
  resolve: {
    extensions: ['.ts', '.js', '.sass']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: 'PWA Chat',
      favicon: './src/favicon.ico',
      chunks: ['main']
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/pages',
          to: './pages'
        },
        {
          from: './src/components',
          to: './components'
        },
        {
          from: './src/assets',
          to: './assets'
        }
      ]
    })
  ]
};
