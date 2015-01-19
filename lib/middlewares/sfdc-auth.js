"use strict";

var config = require('../../config/configuration.js');
var restify = require('restify');

/**
 * Adds a `sfdcOAuth` property to the `req` object with the provided creds.
 *
 * QueryString Credentials:
 *  - username
 *  - password
 */
module.exports = function(req, res, next) {
  config.sfdcOrg.authenticate({
      username: req.query.username,
      password: req.query.password
  }, function authd(err, oauth) {
    if(err || !oauth) {
      return next(err);
    }
    req.sfdcOAuth = oauth;
    next();
  });
};

