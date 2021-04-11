const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    bcs: "./src/index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
    library: "vladnets_bcs",
    libraryTarget: "umd",
  },

  target: "web",
  mode: "development",
  devtool: "inline-source-map",

  devServer: {
    publicPath: "/build/"
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ],
  },

  resolve: {
    extensions: [ ".ts", ".tsx", ".js" ],
    alias: {
      "@vladnets": path.resolve(__dirname, "./@vladnets/"),
    }
  },

  plugins: [
    // new CopyPlugin({
    //   patterns: [
    //     { from: "scripts", to: "build" },
    //   ],
    // }),

    // new HtmlWebpackPlugin({
    //   template: "index.html"
    // })
  ]
};