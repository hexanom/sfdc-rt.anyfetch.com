"use strict";

var Record = require('./record');
var SearchResult = require('./searchresult');

var mOauth = "mockOauth";

var documents = [
  new Record("2013-06-26T09:13:46.552Z", "2013-06-26T09:13:46.552Z", "record #1"),
  new Record("2013-06-26T09:13:46.552Z", "2013-06-26T09:13:46.552Z", "record #2"),
  new Record("2013-06-26T09:13:46.552Z", "2013-06-26T09:13:46.552Z", "record #3")
];


module.exports = {
  authenticate: function(_, cb) {
    cb(null, mOauth);
  },
  getRecord: function(opts, cb) {
    if(opts.oauth === mOauth) {
      cb(null, documents[parseInt(opts.id)]);
    }
  },
  search: function(opts, cb) {
    cb(null, (function() {
      var search = /FIND {(.+)}/g.exec(opts.search)[1];
      switch(search) {
        case "report":
          cb(null, [new SearchResult(1), new SearchResult(2), new SearchResult(3)]);
          break;
      }
    })());
  }
};
