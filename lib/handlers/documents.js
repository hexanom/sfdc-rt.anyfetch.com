"use strict";

var async = require('async');

var items = require('./mockdata').items;

module.exports.index = function(req, res, next) {
  async.waterfall([
    function returnList() {
      if(req.params.current_provider_id !== 123) {
        res.send(404, "Provider ID unknown");
      }
      else if(!req.params.search) {
        res.send(400, "Search musn't be empty or null");
      }
      else if(req.params.strict && (req.params.strict !== 'true' && req.params.strict !== 'false')) {
        res.send(400, "Strict parameter must be true or false");
      }
      else if(req.params.start && req.params.start < 0) {
        res.send(400, "Start must be positive or null");
      }
      else if(req.params.limit && req.params.limit < 0) {
        res.send(400, "Limit must be positive or null");
      }
      else if(req.params.search === "waldo") {
        res.send([]);
      }
      else if(req.params.strict) {
        res.send(items.slice(0, 2));
      }
      else {
        var start = req.params.start ? parseInt(req.params.start) : 0;
        var end = req.params.limit ? (start + parseInt(req.params.limit)) : undefined;
        res.send(items.slice(start, end));
      }
    }
  ], next);
};

module.exports.identifier = function(req, res, next) {
  async.waterfall([
    function returnItem() {
      res.send({
        "id": "53ce71b24882ec9d58f08235",
        "identifier": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/#contact/79516afe8f2cdfba",
        "creation_date": "2014-07-22T14:14:10.150Z",
        "modification_date": "2014-02-07T12:45:56.254Z",
        "actions": {
            "show": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/#contact/79516afe8f2cdfba"
        },
        "data": {
            "name": "Florian Rossiaud",
            "job": " ",
            "phone": [
                {
                    "phone": "+336 43 19 05 98",
                    "type": "mobile"
                }
            ],
            "email": [
                {
                    "email": "florianrossiaud@gmail.com",
                    "type": "work"
                }
            ],
            "image": "data:image/*;base64,/9j/4AAQSkZJRgqUa8G1Lfv6pUPUqv2Kwk5mJYj+df4oP//Z"
        },
        "related": []
      });
    }
  ], next);
};
