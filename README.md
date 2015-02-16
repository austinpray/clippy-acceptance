clippy-acceptance
=================

Acceptance test to be run against Clippy API implementations to check for
completeness. This repo also contains documentation useful for creating your own
implementation of clippy.

## Run the tests

### Install

```bash
git clone git@github.com:clippy-io/clippy-acceptance.git
cd clippy-acceptance
npm install
```

### Run

```bash
npm test
```

### Environment Variables

You can manually override the environment specific default by specifying it as
an environment variable. See [node-config][].

| (↓`NODE_ENV`) | `ENDPOINT_BASE`       |
|---------------|-----------------------|
| default       | http://localhost:9001 |
| development   |                       |
| production    |                       |

## Implementation

### Classes

#### `SyncCode`<a name="SyncCode"></a>

Returns String of 6 random alphanumeric characters. 

This is supposed to be short code for human reading and typing.

### Models

#### `Client`<a name="Client"></a>

This should not be stored on the server. This is a contract between the client
and the server.

| Property  | Type                              | Description                                           |
|-----------|-----------------------------------|-------------------------------------------------------|
| id        | String, [UUIDv4][]                | Identifies the individual client                      |
| group     | String, [UUIDv4][]                | Identifies the group of devices the client belongs to |
| name      | String                            | Friendly, identifiable name                           |
| peers     | Array of [Client][] Objects       | All of the clients this client knows about            |
| publicKey | String, [GPG Public Key][rfc4880] | GPG public key                                        |

#### `SyncRequest`<a name="SyncRequest"></a>

This is actually stored on the server and should have an expiration.

| Property  | Type                 | Description                                                     |
|-----------|----------------------|-----------------------------------------------------------------|
| group     | String, [UUIDv4][]   | Identifies the group of devices                                 |
| code      | String, [SyncCode][] | Used to look up sync request                                    |
| status    | String               | Can be any of: `accepted`, `pending`                            |
| initiator | Object, [Client][]   | `Client` that is inviting the target client into the device group |
| target    | Object, [Client][]   | Target `Client` that is being invited into the device group       |

### REST API

#### `GET /capabilities`

Returns an object that describes the server's capabilities.

```json
{
  "name": "Clippy Server: Golang Edition",
  "version": "1.0.0",
  "capabilities": [
    "REST"
  ]
}
```

#### `POST /sync`

Create a `SyncRequest`. 

##### Request

Initiator Client sends it's personal [Client][] object.

Required fields:

- id
- group 
- name 
- peers
- publicKey

##### Response

Returns a [SyncRequest][] with the following properties defined:

- group
- code
- status: `pending`
- initiator: the [Client][] object of the Client that sent the request

#### `POST /sync/{{ code }}`

Update a Sync Request as a target.

##### Request

The target Client sends it's personal [Client][] object.

Required Fields:

- id
- name
- publickey

##### Response

Returns a [SyncRequest][] with the following properties defined:

- group
- code
- status: `accepted`
- initiator: the [Client][] object of the initiator Client that created the [SyncRequest][] initially.
- target: the [Client][] object of target Client that just sent the request

#### `GET /sync/{{ code }}`

Returns a [SyncRequest][] based on the given code parameter. 

[Client]: #Client
[SyncCode]: #SyncCode
[SyncRequest]: #SyncRequest
[UUIDV4]: http://www.ietf.org/rfc/rfc4122.txt
[node-config]: https://github.com/lorenwest/node-config
[rfc4880]: http://tools.ietf.org/html/rfc4880
[SemVer]: http://semver.org/
