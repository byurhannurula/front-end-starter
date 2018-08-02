const path = require('path');

module.exports = {
  entry: {
    main: './src/scripts/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './build/js')
  },
  mode: 'development'
};