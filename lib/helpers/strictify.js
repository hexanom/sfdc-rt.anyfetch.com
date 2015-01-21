"use strict";

module.exports = function strictify(orig) {
  var strictified = orig.split("");
  var inquotes = false;
  for (var i = 0; i < strictified.length; i++) {
    var char = strictified[i];
    if (char === '"' && ((i > 0 && strictified[i-1] !== "\\") || i === 0)) {
      inquotes = !inquotes;
    }
    else if (char === " " && !inquotes) {
      strictified.splice(i, 0, " ", "A", "N", "D");
      i += 4;
    }
  }
  return strictified.join("");
};
