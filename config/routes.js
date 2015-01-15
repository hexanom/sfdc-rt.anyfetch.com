"use strict";
/**
 * @file Defines the routes available on the server

 * Will define all availables exposed HTTP paths, and their methods (GET / POST / ...).
 */
var lib = require('../lib/');
var handlers = lib.handlers;
var middlewares = lib.middlewares;

// Routes client requests to handlers
module.exports = function(server) {
  server.get("/documents", middlewares.sfdcAuth, handlers.documents.index);
  server.get("/documents/:identifier", middlewares.sfdcAuth, handlers.documents.identifier);
};
