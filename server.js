'use strict';
const Hapi = require('hapi');
const { host, port } = require('./config');
const debug = require('./debug');
const server = new Hapi.Server();

server.connection({
  port,
  host,
});

server.start((err) => {
  if (err) {
    throw err;
  }

  debug(`Server running at ${server.info.uri}`);
});

module.exports = server;
