const {port, host} = require('./config');
const Hapi = require('hapi');
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

require('./routes')(server);

module.exports = server;
