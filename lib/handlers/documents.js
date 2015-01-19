"use strict";

var async = require('async');

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
  var start = req.query.start || 0;
  var end = start + req.query.limit || 100;

  async.waterfall([
      function soslQuery(cb) {
        var sosl = 'FIND {' + req.query.search + '}'; // TODO: Escaping
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
