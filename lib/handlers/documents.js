"use strict";

module.exports.index = function(req, res, next) {
  next(new Error("TODO /"));
};

module.exports.identifier = function(req, res, next) {
  next(new Error("TODO /:identifier"));
};
