const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.join(__dirname, 'public'), // boolean | string | array | object, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false,
  },
  module: {
    rules: [
      {
        test: /\.(sass|css|scss)$/,
        use: [
          'style-loader', // 3. Inject styles into DOM
          'css-loader', // 2. Turns css into common JS
          'sass-loader', // 1. Turns sass into css
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.svg$/,
        use: ['svg-inline-loader?classPrefix!'],
      },
      {
        test: /\.(png|gif|jpg|webp)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'img',
          },
        },
      },
      {
        test: /\.(mp3)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'audio',
            },
          },
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
    ],
  },
  devtool: 'inline-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  externals: {
    map: 'google',
  },
};
