var config = require('config');
var restify = require('restify');
var assert = require('chai').assert;
var uuid = require('node-uuid');

var initiatorUUID = uuid.v4();
var targetUUID = uuid.v4();
var groupUUID = uuid.v4();

var client = restify.createJsonClient({
  url: config.endpointBase
});

var syncCode1;

var mockPeer1 = {
  id: uuid.v4(),
  group: groupUUID,
  name: 'Test Peer',
  publicKey: 'big long string'
};
var mockPeer2 = {
  id: uuid.v4(),
  group: groupUUID,
  name: 'test peer',
  publicKey: 'big long string'
};
var mockInitiator1 = {
  id: initiatorUUID,
  group: groupUUID,
  name: 'Test Initiator',
  publicKey: 'big long string',
  peers: [mockPeer1, mockPeer2]
};
var mockTarget1 = {
  id: targetUUID,
  group: groupUUID,
  name: 'Test Target',
  publicKey: 'big long string'
};

describe('GET /capabilities', function() {
  var response;
  var error;
  before(function(done) {
    client.get('/capabilities', function(err, req, res, obj) {
      response = obj;
      error = err;
      done();
    });
  });
  it('it should respond successfully', function() {
    assert.isNull(error);
  });
  it('should give a name', function() {
    assert.isString(response.name);
  });
  it('should give a version', function() {
    assert.isString(response.version);
  });
  it('should give an array of capabilities', function() {
    assert.isArray(response.capabilities);
    assert.sameMembers(response.capabilities, [
      'REST'
    ]);
  });
});

describe('POST /sync', function() {
  var response;
  var error;
  before(function(done) {
    client.post('/sync', mockInitiator1, function(err, req, res, obj) {
      response = obj;
      syncCode1 = obj.code;
      error = err;
      done();
    });
  });
  it('should accept a POST request', function() {
    assert.isNull(error);
  });
  it('should return a SyncRequest', function() {
    assert.equal(response.group, groupUUID);
    assert.isString(response.code);
    assert.lengthOf(response.code, 6);
    assert.equal(response.status, 'pending');
  });
});

describe('POST /sync/{{ code }}', function() {
  var response;
  var error;
  before(function(done) {
    client.post('/sync/' + syncCode1,
                mockTarget1,
                function(err, req, res, obj) {
      response = obj;
      error = err;
      done();
    });
  });
  it('should accept a POST request', function() {
    assert.isNull(error);
  });
  it('should return a SyncRequest', function() {
    assert.equal(response.group, groupUUID);
    assert.isString(response.code);
    assert.lengthOf(response.code, 6);
  });
  it('should have the status set as accepted', function() {
    assert.equal(response.status, 'accepted');
  });
  it('should have the initiator defined', function() {
    assert.equal(response.initiator.id, mockInitiator1.id);
  });
  it('should have the target defined', function() {
    assert.equal(response.target.id, mockTarget1.id);
  });
});

describe('GET /sync/{{ code }}', function() {
  var response;
  var error;
  before(function(done) {
    client.get('/sync/' + syncCode1, function(err, req, res, obj) {
      response = obj;
      error = err;
      done();
    });
  });

  it('should accept a GET request', function() {
    assert.isNull(error);
  });

  it('should return a SyncRequest', function() {
    assert.isString(response.code);
    assert.lengthOf(response.code, 6);
    assert.isString(response.group);
    assert.isString(response.status);
  });

});
