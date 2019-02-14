let conf = require('@ionic/app-scripts/config/webpack.config');
var path = require('path');

conf.dev.resolve.alias = {
  "@pagesPRN": path.resolve("./src/pages"),
  "@componentsPRN": path.resolve("./src/components"),
  "@modelsPRN": path.resolve("./src/models"),
  "@servicesPRN": path.resolve("./src/services"),
  "@appPRN": path.resolve("./src/app")
}

conf.prod.resolve.alias = {
  "@pagesPRN": path.resolve("./src/pages"),
  "@componentsPRN": path.resolve("./src/components"),
  "@modelsPRN": path.resolve("./src/models"),
  "@servicesPRN": path.resolve("./src/services"),
  "@appPRN": path.resolve("./src/app")
}

module.exports = conf;