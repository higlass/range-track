const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { VERSION, DEPENDENCIES } = require('./globals.js');

module.exports = (env, argv) => ({
  entry: './example/index.js',
  output: {
    path: `${__dirname}/docs`,
    publicPath: argv.mode === 'production' ? './' : '/',
    filename: 'example.js'
  },
  devServer: {
    contentBase: [
      './example',
      path.join(__dirname, 'node_modules/higlass/dist')
    ],
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION,
      DEPENDENCIES
    }),
    new HtmlWebpackPlugin({
      template: 'example/index.html',
      isProduction: argv.mode === 'production'
    })
  ]
});
