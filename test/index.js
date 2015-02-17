var config = require('config');
var restify = require('restify');
var assert = require('chai').assert;
var uuid = require('node-uuid');

var clientUUID = uuid.v4();
var groupUUID = uuid.v4();

var client = restify.createJsonClient({
  url: config.endpointBase
});

describe('GET /capabilities', function () {
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

describe('POST /sync', function () {
  var mockPeer1 = {
    id: uuid.v4(),
    group: groupUUID,
    name: 'Test Peer',
    publicKey: 'big long string'
  };
  var mockPeer2 = {
    id: uuid.v4(),
    group: groupUUID,
    name: 'Test Peer',
    publicKey: 'big long string'
  };
  var mockClient1 = {
    id: clientUUID,
    group: groupUUID,
    name: 'Test Harness',
    publicKey: 'big long string',
    peers: [mockPeer1, mockPeer2]
  };
  it('should accept a POST request', function (done) {
    client.post('/sync', mockClient1, function (err, req, res, obj) {
      assert.isNull(err);
      done();
    });
  });
  it('should return a SyncRequest', function (done) {
    client.post('/sync', mockClient1, function (err, req, res, obj) {
      console.log(obj);
      assert.equal(obj.group, groupUUID);
      assert.isString(obj.code);
      assert.lengthOf(obj.code, 6);
      assert.equal(obj.status, 'pending');
      done();
    });
  });

});
