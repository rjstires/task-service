const debug = require('./debug');
const hapi = require('hapi');

const routes = function(server: hapi.Server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request: hapi.Request, reply: hapi.IReply) {
      const { params, query } = request;
      reply({ response: 'You did it.', params, query });
    },
  });
};

module.exports = routes;
