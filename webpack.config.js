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
    },
  },

  entry: path.resolve(__dirname, './src/IFS/bundle_entry.ts'),

  output: {
    path: path.resolve(__dirname, 'public/webpack/'),
    globalObject: 'this',
    filename: 'IFS.bundle.js',
    library: {
      type: 'umd'
    },
  },
};
