'use strict';

var nforce = require('nforce');

/**
 * @file Defines the app settings.
 *
 * Most of the configuration can be done using system environment variables.
 */

// Load environment variables from .env file
var dotenv = require('dotenv');
dotenv.load();

// node_env can either be "development" or "production"
var nodeEnv = process.env.NODE_ENV || "development";
var port = process.env.PORT || 8000;

// nforce org
var org = nforce.createConnection({
  clientId: 'SFDC_CLIENT_ID' || process.env.SFDC_CLIENT_ID,
  clientSecret: 'SFDC_CLIENT_SECRET' || process.env.SFDC_CLIENT_SECRET,
  redirectUri: process.env.SFDC_REDIRECT_URI || 'http://localhost:' + port + '/oauth/callback',
  apiVersion: 'v27.0',
  environment: (nodeEnv === 'production') ? 'production' : 'sandbox'
});

// Exports configuration
module.exports = {
  env: nodeEnv,
  port: port,
  sfdcOrg: (nodeEnv === 'test') ? require('../test/mock/org.js') : org
};
