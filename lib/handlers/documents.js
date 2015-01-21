"use strict";

var async = require('async');
var restify = require('restify');

var strictify = require('../helpers/strictify.js');

var config = require('../../config/configuration.js');

function createSobjectToDocument(org, oauth) {
  return function sobjectToDocument(sobject, cb) {
    async.waterfall([
        function sobjectToRecord(cb) {
          org.getRecord({
            id: sobject.Id,
            type: sobject.attributes.type,
            oauth: oauth,
            raw: true
          }, cb);
        },
        function recordToDocument(record, cb) {
          var url = "https://emea.salesforce.com/" + sobject.Id; // TODO: NA addresses support

          cb(null, {
              "identifier": sobject.attributes.type + '/' + sobject.Id,
              "creation_date": record.CreatedDate,
              "modification_date": record.LastModifiedDate,
              "actions": {
                "show": url
              },
              "data": {
                "title": record.Name,
                "s_object": record // TODO: better deflation
              }
          });
        }
    ], cb);
  };
}

module.exports.index = function(req, res, next) {
  // Sanitize
  var start = parseInt(req.query.start) || 0;
  var limit = parseInt(req.query.limit) || 10;
  var strict = ((req.query.strict || true) !== "false");
  var search = req.query.search || false; // TODO: escaping
  var end = start + limit;

  // Validate
  if(start < 0 || limit <= 0 || limit > 100) {
    return next(new restify.BadRequestError("Bad start/limit window"));
  }
  if(!search) {
    return next(new restify.BadRequestError("No Search term"));
  }

  async.waterfall([
      function soslQuery(cb) {
        var sosl = 'FIND {' + (strict ? strictify(search) : search) + '}';
        config.sfdcOrg.search({
            search: sosl,
            oauth: req.sfdcOAuth
        }, cb);
      },
      function sliceSObjects(records, cb) {
        cb(null, records.slice(start, end));
      },
      function mapSobjectsToDocs(sobjects, cb) {
        async.map(sobjects, createSobjectToDocument(config.sfdcOrg, req.sfdcOAuth), cb);
      },
      function sendDocs(docs, cb) {
        res.send(docs);
        cb();
      }
  ], next);
};

module.exports.identifier = function(req, res, next) {
  async.waterfall([
      function injectSobject(cb) {
        cb(null, {
            Id: req.params.identifier,
            attributes: {
              type: req.params.type
            }
        });
      },
      createSobjectToDocument(config.sfdcOrg, req.sfdcOAuth),
      function sendDoc(doc, cb) {
        res.send(doc);
        cb();
      }
  ], next);
};
