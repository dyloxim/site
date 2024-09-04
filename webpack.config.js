const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@IFS": path.resolve(__dirname, "src/IFS"),
      "@Util": path.resolve(__dirname, "src/util"),
    },
  },

  entry: path.resolve(__dirname, './src/IFS/index.ts'),

  output: {
    path: path.resolve(__dirname, 'public/webpack/'),
    globalObject: 'this',
    filename: 'ifs.bundle.js',
    library: {
      type: 'umd'
    },
  },

  mode: 'development'

};
