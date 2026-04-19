const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const bigmodelEnv = {
  REACT_APP_BIGMODEL_API_KEY: process.env.REACT_APP_BIGMODEL_API_KEY || '',
  REACT_APP_BIGMODEL_TEXT_MODEL: process.env.REACT_APP_BIGMODEL_TEXT_MODEL || 'glm-4-flash-250414',
  REACT_APP_BIGMODEL_VISION_MODEL: process.env.REACT_APP_BIGMODEL_VISION_MODEL || 'glm-4.6v-flash',
};

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'AI职场搭子'
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_BIGMODEL_API_KEY': JSON.stringify(bigmodelEnv.REACT_APP_BIGMODEL_API_KEY),
      'process.env.REACT_APP_BIGMODEL_TEXT_MODEL': JSON.stringify(bigmodelEnv.REACT_APP_BIGMODEL_TEXT_MODEL),
      'process.env.REACT_APP_BIGMODEL_VISION_MODEL': JSON.stringify(bigmodelEnv.REACT_APP_BIGMODEL_VISION_MODEL),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true
  },
  devtool: 'source-map'
}; 