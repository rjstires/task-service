import {server as debug} from './debug';
import * as hapi from 'hapi';

export const rootRoute = function(server: hapi.Server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request: hapi.Request, reply: hapi.IReply) {
      const { params, query } = request;
      reply({ response: 'You did it.', params, query });
    },
  });
};
