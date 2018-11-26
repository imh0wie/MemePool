const path = require('path');
module.exports = {
  entry: "./lib/jqueery.js",
  output: {
  	filename: "bundle.js",
    path: path.resolve(__dirname, 'lib')
  },
  resolve: {
    extensions: [".js", "*"],
  },
  devtool: 'source-map'
};