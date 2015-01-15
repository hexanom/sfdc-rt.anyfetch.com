"use strict";

var async = require('async');

var config = require('../../config/configuration.js');

function createIdToDocument(org, oauth) {
  return function idToDocument(id, cb) {
    async.waterfall([
        function idToRecord(cb) {
          org.getRecord({
            id: id,
            oauth: oauth
          }, cb);
        },
        function recordToDocument(record, cb) {
          var url = "https://emea.salesforce.com/" + id; // TODO: NA addresses support

          cb(null, {
              "identifier": id,
              "creation_date": record.get('CreatedDate'),
              "modification_date": record.get('LastModifiedDate'),
              "actions": {
                "show": url
              },
              "data": {
                "title": record.get('name'),
                "s_object": record.toJSON() // TODO: better deflation
              }
          });
        }
    ], cb);
  };
}

module.exports.index = function(req, res, next) {
  var start = req.query.start || 0;
  var end = start + req.query.limit || 100;

  async.waterfall([
      function soslQuery(cb) {
        var sosl = 'FIND {' + req.search + '}'; // TODO: Escaping
        config.sfdcOrg.search({
            search: sosl,
            oauth: req.sfdcOAuth
        }, cb);
      },
      function sliceIds(ids, cb) {
        cb(null, ids.slice(start, end));
      },
      function mapIdsToDocs(ids, cb) {
        async.map(ids, createIdToDocument(config.sfdcOrg, req.sfdcOAuth), cb);
      },
      function sendDocs(docs, cb) {
        res.send(docs);
        cb();
      }
  ], next);
};

module.exports.identifier = function(req, res, next) {
  async.waterfall([
      function injectId(cb) {
        cb(null, req.query.identifier);
      },
      createIdToDocument(config.sfdcOrg, req.sfdcOAuth),
      function sendDoc(doc, cb) {
        res.send(doc);
        cb();
      }
  ], next);
};
