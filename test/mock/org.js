"use strict";

var mOauth = "mockOauth";

module.exports = {
  authenticate: function(_, cb) {
    cb(null, mOauth);
  },
  getRecord: function(opts, cb) {
    if(opts.oauth === mOauth) {
      switch(opts.id) {
        case "test":
          cb(null, {});
          break;

      }
    }
  },
  search: function(opts, cb) {
    cb(null, null);
  }
};
