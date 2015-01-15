'use strict';
/**
 * @file Configure the application.
 */

var restify = require('restify');

var config = require('./config/configuration.js');

var lib = require('./lib/');
var handlers = lib.handlers;

var server = restify.createServer();


server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.use(restify.authorizationParser());

require("./config/routes.js")(server, handlers);

// Log errors
/* istanbul ignore next */
server.on('uncaughtException', function(req, res, route, err) {
  if(!res.headersSent) {
    if(config.env !== "production") {
      res.send(new restify.InternalServerError(err, err.message || 'unexpected error'));
    }
    else {
      res.send(new restify.InternalServerError("An unexpected error occurred :("));
    }

    return true;
  }

  return false;
});

module.exports = server;

