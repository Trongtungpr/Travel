const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: "./src/client/index.js",
  output: {
    libraryTarget: "var",
    library: "Client",
    // Add output path for build files
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js' 
  },
  mode: "development",
  devtool: "source-map",
  stats: "verbose",
  module: {
    rules: [
      {
        // Fix regex to match .js files correctly
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|avif|jpeg|webp|png)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[hash:6].[ext]",
          // Use consistent output and public paths
          outputPath: "img", 
          publicPath: "img", 
          emitFile: true,
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/client/views/index.html",
      filename: "./index.html",
    }),
    new CleanWebpackPlugin({
      // Clean the 'dist' folder
      cleanOnceBeforeBuildPatterns: ['dist'], 
    }),
    new WorkboxPlugin.GenerateSW()
  ],
};