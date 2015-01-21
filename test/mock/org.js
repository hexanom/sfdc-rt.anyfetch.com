"use strict";

var mOauth = "mockOauth";

var documents = [
  {Id: 0,
   attributes: {type: 'User'},
   Name: "Mr. Report"},
  {Id: 1,
   attributes: {type: 'Lead'},
   Name: "Report Inc."},
  {Id: 2,
   attributes: {type: 'Opportunity'},
   Name: "Report Research"}
];

var searchResults = documents.map(function tailToSearch(record) {
  return {Id: record.Id,
    attributes: {type: record.attributes.type}};
});

module.exports = {
  authenticate: function(_, cb) {
    cb(null, mOauth);
  },
  getRecord: function(opts, cb) {
    if(opts.oauth === mOauth && opts.raw === true) {
      var doc = documents[parseInt(opts.id)];
      if(doc.attributes.type === opts.type) {
        return cb(null, doc);
      }
    }
    cb(new Error("MOCK: wrong parameters on getRecord()"));
  },
  search: function(opts, cb) {
    if(opts.oauth === mOauth) {
      var search = /FIND {(.+)}/g.exec(opts.search)[1];
      switch(search) {
        case "report":
        case "mr report":
          return cb(null, searchResults);
        case "mr AND report":
          return cb(null, [searchResults[0]]);
        default:
          return cb(null, []);
      }
    }
    cb(new Error("MOCK: wrong parameters on search()"));
  }
};
