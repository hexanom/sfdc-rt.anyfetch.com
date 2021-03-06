"use strict";

var config = require('../../config/configuration.js');

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
      password: req.query.password,
      securityToken: req.query.stoken
  }, function authd(err, oauth) {
    if(err || !oauth) {
      return next(err);
    }
    req.sfdcOAuth = oauth;
    next();
  });
};

