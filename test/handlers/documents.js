'use strict';

var app = require('../app.js');
var should = require('should');
var request = require('supertest');

describe('<Documents endpoint>', function() {

  describe('GET /documents', function() {
    it("should fail (provider id unknown)", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123xxx' })
        .set('Accept', 'application/json')
        .expect(404)
        .end(done);
    });

    it("strict isn't true or false", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123', search: 'test document', strict: 'maybe' })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.exist(err);
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('GET /documents', function() {
    it("limit is negative", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123', search: 'test document', limit: '-1' })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.exist(err);
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('GET /documents', function() {
    it("start is negative", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123', search: 'test document', start: '-1' })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.exist(err);
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('GET /documents', function() {
    it("should not find anything", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123xxx', search: 'waldo' })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.empty;
          done();
        });
    });
  });

  describe('GET /documents', function() {
    it("should find some documents", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123xxx', search: 'report' })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.length(3);
          res.body[0].id.should.be("1234769");
          res.body[1].id.should.be("zzzzzzz");
          res.body[2].id.should.be("aaaaaaa");
          done();
        });
    });
  });


  describe('GET /documents', function() {
    it("should find less documents (strict)", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123xxx', search: 'report', strict: 'true' })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.length(3);
          res.body[0].id.should.be("1234769");
          res.body[1].id.should.be("zzzzzzz");
          done();
        });
    });
  });

  describe('GET /documents', function() {
    it("should find less documents (start param)", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123xxx', search: 'report', start: '1' })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.length(2);
          res.body[0].id.should.be("zzzzzzz");
          res.body[1].id.should.be("aaaaaaa");
          done();
        });
    });
  });

  describe('GET /documents', function() {
    it("should find even less documents (limit param)", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123xxx', search: 'report', limit: '1' })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.length(1);
          res.body[0].id.should.be("1234769");
          done();
        });
    });
  });

  describe('GET /documents', function() {
    it("should find even less documents (start+limit param)", function(done) {
      request(app)
        .get('/documents')
        .query({ current_provider_id: '123xxx', search: 'report', start: '1', limit: '1' })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.length(1);
          res.body[0].id.should.be("zzzzzzz");
          done();
        });
    });
  });

});
