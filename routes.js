'use strict';

const debug = require('./debug');

const routes = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      const { params, query } = request;
      reply({ response: 'You did it.', params, query });
    },
  });
};

module.exports = routes;
