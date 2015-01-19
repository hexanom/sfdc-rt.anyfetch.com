"use strict";

var Record = function(created, lastModified, name) {
  this.CreatedDate = created;
  this.LastModifiedDate = lastModified;
  this.name = name;
};

Record.prototype.get = function(name) {
  return this[name];
};

Record.prototype.toJSON = function() {
  return this;
};
