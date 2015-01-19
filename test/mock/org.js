"use strict";

var Record = require('./record');
var SearchResult = require('./searchresult');

var mOauth = "mockOauth";


module.exports = {
  authenticate: function(_, cb) {
    cb(null, mOauth);
  },
  getRecord: function(opts, cb) {
    if(opts.oauth === mOauth) {
      switch(opts.id) {
        case "test":
          cb(null, new Record("12/12/2014", "13/12/2014", "record #1"));
          break;

      }
    }
  },
  search: function(opts, cb) {
    cb(null, [new SearchResult(1), new SearchResult(2)]);
  }
};
