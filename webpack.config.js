const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';
const isProd = mode === 'production';

const filename = (ext) => (isDev ? `[name]${ext}` : `[name].[hash]${ext}`);

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode,
  entry: {
    main: './index.js',
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist'),
    filename: filename('.js'),
    assetModuleFilename: isDev ? '[file]' : '[hash][ext][query]',
  },
  resolve: {
    extensions: ['.js', 'jsx', '.json', '.ts', '.tsx'],
    alias: {},
  },
  optimization: {
    runtimeChunk: 'single',
    minimize: isProd,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HTMLWebpackPlugin({
      favicon: './assets/images/favicon.ico',
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: filename('.css'),
    }),
    new ESLintPlugin({
      fix: true,
    }),
    new StylelintPlugin({
      fix: true,
    }),
  ],
  devServer: {
    compress: isProd,
    hot: isDev,
    port: 8080,
  },
  devtool: isDev && 'source-map',
  target: isDev ? 'web' : 'browserslist',
  stats: {
    children: isDev,
  },
  module: {
    rules: [
      {
        test: /\.html?$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.jsx$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
