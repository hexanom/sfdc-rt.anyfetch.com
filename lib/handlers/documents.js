"use strict";

var async = require('async');


module.exports.index = function(req, res, next) {
  async.waterfall([
    function returnList() {
      res.send([
        {
          "id": "53cf88a5cf25841c6144ee46",
          "identifier": "https://docs.google.com/file/d/0Ao1Q9EZ6RihjdHBSSnlzWG5mRFMxTm5YRVMwZzd0b0E",
          "creation_date": "2013-06-26T09:13:46.552Z",
          "modification_date": "2013-06-26T09:13:46.552Z",
          "actions": {
              "show": "https://docs.google.com/file/d/0Ao1Q9EZ6RihjdHBSSnlzWG5mRFMxTm5YRVMwZzd0b0E"
          },
          "data": {
              "title": "Traductions.pdf",
              "path": "/Traductions.pdf",
              "snippet": "des entreprises\nIntégration du <span class=\"hlt\">CV</span> des participants\nApplication de recherche pour les recruteurs\nà partir de 50€/mois\nPapiel Process\nPour recrutement grande échelle\nTraductions\nIntégrez les <span class=\"hlt\">CVs</span> images"
          },
          "related_count": 0,
        }
      ]);
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
