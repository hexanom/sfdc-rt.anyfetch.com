var autoload = require('auto-load');

module.exports = {
  handlers: autoload(__dirname + '/handlers'),
  middlewares: autoload(__dirname + '/middlewares'),
  helpers: autoload(__dirname + '/helpers')
};

