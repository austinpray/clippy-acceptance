var config = require('config');
var restify = require('restify');
var assert = require('chai').assert;

var client = restify.createJsonClient({
  url: config.endpointBase
});

describe('server capabilities', function () {
  it('should give a name', function (done) {
    client.get('/capabilities', function (err, req, res, obj) {
      assert.isNull(err);
      assert.isString(obj.name);
      done();
    });
  });
  it('should give a version', function (done) {
    client.get('/capabilities', function (err, req, res, obj) {
      assert.isNull(err);
      assert.isString(obj.version);
      done();
    });
  });
  it('should give an array of capabilities', function (done) {
    client.get('/capabilities', function (err, req, res, obj) {
      assert.isNull(err);
      assert.isArray(obj.capabilities);
      assert.sameMembers(obj.capabilities, [
        "REST"
      ]);
      done();
    });
  });
});

describe('sending a paste', function () {
  it('should successfully send a paste', function (done) {
    var request = {};
    client.post('/pastes', request, function (err, req, res, obj) {
      assert.isNull(err);
      done();
    });
  });
});

describe('getting a paste', function () {
  it('should return an object', function (done) {
    client.get('/pastes', function (err, req, res, obj) {

      var expected = {};

      assert.isNull(err);
      done();
      
    });
  });
});
