'use strict';

var app = require('../../app.js');
var should = require('should');
var request = require('supertest');

describe('<Documents endpoint>', function() {

  describe('GET /documents', function() {
    it.skip("should fail (provider id unknown)", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123xxx'})
        .set('Accept', 'application/json')
        .expect(404)
        .end(done);
    });

    it("limit is negative", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123', search: 'test document', limit: '-1'})
        .set('Accept', 'application/json')
        .expect(400)
        .end(done);
    });

    it("start is negative", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123', search: 'test document', start: '-1'})
        .set('Accept', 'application/json')
        .expect(400)
        .end(done);
    });

    it("search parameter omited", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123'})
        .set('Accept', 'application/json')
        .expect(400)
        .end(done);
    });

    it("should not find anything", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123', search: 'waldo', strict: "false"})
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.should.be.empty;
          done();
        });
    });

    it("should find some documents (enforce non-strict)", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123', search: 'mr report', strict: "false"})
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.should.have.length(3);
          res.body[0].should.have.property("identifier", "User/0");
          res.body[0].data.should.have.property("title", "Mr. Report");
          res.body[1].should.have.property("identifier", "Lead/1");
          res.body[2].should.have.property("identifier", "Opportunity/2");
          done();
        });
    });

    it("should find less documents (strict by default)", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123', search: 'mr report'})
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.should.have.length(1);
          res.body[0].should.have.property("identifier", "User/0");
          done();
        });
    });

    it("should find less documents (start param)", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123', search: 'report', start: '1'})
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.should.have.length(2);
          res.body[0].should.have.property("identifier", "Lead/1");
          res.body[1].should.have.property("identifier", "Opportunity/2");
          done();
        });
    });

    it("should find even less documents (limit param)", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123', search: 'report', limit: '1'})
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.should.have.length(1);
          res.body[0].should.have.property("identifier", "User/0");
          done();
        });
    });

    it("should find even less documents (start+limit param)", function(done) {
      request(app)
        .get('/documents')
        .query({current_provider_id: '123', search: 'report', start: '1', limit: '1'})
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.should.have.length(1);
          res.body[0].should.have.property("identifier", "Lead/1");
          done();
        });
    });
  });

  describe('GET /documents/:type/:id', function() {
    it('should return a matching doc', function(done) {
      request(app)
        .get('/documents/User/0')
        .set('Accept', 'application/json')
        .expect(/User\/0/)
        .expect(/Mr\. Report/)
        .end(done);
    });

    it('should error when not matching', function(done) {
      request(app)
        .get('/documents/User/1')
        .set('Accept', 'application/json')
        .expect(404)
        .end(done);
    });
  });
});
