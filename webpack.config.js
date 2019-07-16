const webpack = require("webpack");

module.exports = {
  entry: __dirname + "/src/app.js",
  output: {
    path: __dirname + "/dist/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['@babel/react', '@babel/env'],
        }
      }
    ]
  },
  plugins: [

  ]
}