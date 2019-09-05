let path = require("path");

module.exports = {
  entry: __dirname + "/src/index.js",
  output: {
    path: __dirname + "/app/static/webpack",
    filename: "bundle.js"
  },
  resolve: {
    modules: [
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, './node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        exclude: /node_modules/,
        loaders: ["cache-loader", {
          loader: "babel-loader",
          query: {
            presets: ['@babel/react', '@babel/typescript', '@babel/env'],
          }
        }]
      },
      {
        test: /\.css$/,
        exclude: /\.module.css$/,
        use: [
          "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              mode: "global"
            }
          }
        }]
      },
      {
        test: /\.module.css$/,
        use: [
          "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              mode: 'local',
              localIdentName: '[local]_[hash:base64:5]',
            }
          }
        }]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../app/static'), // TODO: fix this
    port: 8000
  },
  plugins: [

  ]
}