"use strict";

var async = require('async');
var restify = require('restify');

var strictify = require('../helpers/strictify.js');
var docFormatter = require('../helpers/doc-formatter.js');

var config = require('../../config/configuration.js');
var rediscli = config.redisCli;

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
          cb(null, docFormatter(sobject, record));
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

  var mset = [];
  async.waterfall([
      function soslQuery(cb) {
        var sosl = 'FIND {' + (strict ? strictify(search) : search) + '}';
        config.sfdcOrg.search({
            search: sosl,
            oauth: req.sfdcOAuth
        }, cb);
      },
      function sliceSObjects(records, cb) {
        if(records.length === 0) {
          res.send({});
        }
        cb(null, records.slice(start, end));
      },
      function getCachedDocs(sobjects, cb) {
        rediscli.mget(sobjects.map(function(sobject) {
          return sobject.Id;
        }), function(err, replies) {
          cb(err, replies, sobjects);
        });
      },
      function associateResults(replies, sobjects, cb) {
        var results = replies.map(function(reply, i) {
          return {sobject: sobjects[i], doc: reply};
        });
        cb(null, results);
      },
      function retrieveMissingDocs(results, cb) {
        async.map(results, function(result, cb) {
          if(result.doc === null) {
            createSobjectToDocument(config.sfdcOrg, req.sfdcOAuth)(result.sobject, function(err, doc) {
              mset.push(result.sobject.Id, JSON.stringify(doc));
              cb(err, doc);
            });
          }
          else {
            cb(null, JSON.parse(result.doc));
          }
        }, cb);
      },
      function sendDocs(docs, cb) {
        res.send(docs);
        cb(null);
      },
      function cacheDocs(cb) {
        if(mset.length > 0) {
          rediscli.mset.apply(rediscli, mset);
        }
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
      function(sobject, cb) {
        createSobjectToDocument(config.sfdcOrg, req.sfdcOAuth)(sobject, function(err, doc) {
          if(!err && doc) {
            rediscli.set(sobject.Id, JSON.stringify(doc));
          }
          cb(err, doc);
        });
      },
      function sendDoc(doc, cb) {
        res.send(doc);
        cb();
      }
  ], function catchErr(err, ok) {
    if(!err && ok) {
      return next(null, ok);
    }
    next(new restify.NotFoundError());
  });
};
