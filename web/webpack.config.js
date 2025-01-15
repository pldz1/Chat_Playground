module.exports = {
  watchOptions: {
    ignored: /node_modules/,
  },
  loaders: [{ test: /\.js$/, loader: "babel", query: { compact: false } }],
};
