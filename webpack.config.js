const path = require('path');
module.exports = {
  entry: {
    jqueery: "./lib/jqueery.js",
    app: "./memepool/app.js"
  },
  output: {
  	filename: "./bundle-[name].js",
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [".js", "*"],
  },
  devtool: 'source-map'
};