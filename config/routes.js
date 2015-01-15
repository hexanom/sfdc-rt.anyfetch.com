"use strict";
/**
 * @file Defines the routes available on the server

 * Will define all availables exposed HTTP paths, and their methods (GET / POST / ...).
 */
var lib = require('../lib/');
var handlers = lib.handlers;

// Routes client requests to handlers
module.exports = function(server) {
  server.get("/documents", handlers.documents.index);
  server.get("/documents/:identifier", handlers.documents.identifier);
};
