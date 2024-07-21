const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  entry: "./src/client/index.js",
  mode: "production",
  output: {
    libraryTarget: "var",
    library: "Client",
    // Thêm đường dẫn output
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // Đặt tên cho file bundle
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Sửa /.js$/ thành /\.js$/
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // Sử dụng MiniCssExtractPlugin để tạo file CSS riêng
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|avif|jpeg|webp|png)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[hash:6].[ext]",
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
    new MiniCssExtractPlugin({
      filename: "[name].css", // Đặt tên cho file CSS
    }),
    new WorkboxPlugin.GenerateSW(),
    // Tối ưu hóa code với TerserPlugin
    new TerserPlugin(),
  ],
};