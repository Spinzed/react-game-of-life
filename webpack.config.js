let path = require("path");

module.exports = {
  entry: __dirname + "/src/index.js",
  output: {
    path: __dirname + "/app/static/webpack",
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
      },
      {
        test: /\.css$/,
        use: "css-loader"
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../app/static'), // TODO: fix this
    compress: true,
    port: 8000
  },
  plugins: [

  ]
}