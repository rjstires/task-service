import * as Hapi from 'hapi'
import * as debug from './debug';
import { env, port, host } from './config';
import { rootRoute } from './routes';

const server = new Hapi.Server();

server.connection({port, host});

server.start((err: any) => {
  if (err) {
    throw err;
  }

  debug.server(`Server running at ${server.info.uri}`);
});

rootRoute(server);

module.exports = server;
