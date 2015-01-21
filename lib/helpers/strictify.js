"use strict";

var parser = require('logic-query-parser');

function nodeToString(node) {
  if(node.type === "string") {
    if(node.value.indexOf(' ') !== -1) {
      return '"' + node.value + '"';
    }
    else {
      return node.value;
    }
  }
  else {
    return node.values.map(
      function(value) {
        return nodeToString(value);
      }
    ).join(" " + node.type.toUpperCase() + " ");
  }
}

module.exports = function strictify(orig) {
  var ast = parser.parse(orig);
  var query = parser.utils.binaryTreeToQueryJson(ast);
  return nodeToString(query);
};
