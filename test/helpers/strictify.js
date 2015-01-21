"use strict";

var strictify = require('../../lib').helpers.strictify;

describe("<Strictify helper>", function() {
  it("should replace spaces by ANDs", function() {
    strictify("Jack Bob")
      .should.be.exactly("Jack AND Bob");
    strictify("Jack Bob Bobby")
      .should.be.exactly("Jack AND Bob AND Bobby");
  });

  it("should ignore quotes", function() {
    strictify('"Jack Bob"')
      .should.be.exactly('"Jack Bob"');
    strictify('"Jack Bob" Bobby')
      .should.be.exactly('"Jack Bob" AND Bobby');
  });
});
