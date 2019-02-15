const path = require('path');
module.exports = {
  entry: {
    a: "./lib/jqueery.js"
  },
  output: {
  	filename: "bundle.js",
    path: path.resolve(__dirname, 'lib')
  },
  plugins: [ new webpack.optimize.CommonsChunkPlugin("init.js") ],
  resolve: {
    extensions: [".js", "*"],
  },
  devtool: 'source-map'
};