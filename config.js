'use strict';

require('dotenv').load();

const R = require('ramda');

/**
 * @param {String}
 * @returns {String|undefined}
 */
const getNodeEnv = R.path(['env', 'NODE_ENV']);

/**
 * @param {*} NODE_ENV
 * @returns {String}
 */
const defaultToLocal = R.defaultTo('LOCAL'); // (NODE_ENV)

/**
 * @param {Object} process - Node process object.
 */
const getNodeEnvOrDefault = R.compose(
    defaultToLocal,
    getNodeEnv
); // (process)

/**
 * @param {string} NODE_ENV
 * @returns {Object|String}
 */
const whenProduction = R.when(
    R.equals('PRODUCTION'), R.always({ port: 3000, host: 'localhost' })
); // (NODE_ENV)

/**
 * @param {string} NODE_ENV
 * @returns {Object|String}
 */
const whenStaging = R.when(
    R.equals('STAGING'), R.always({ port: 3001, host: 'localhost' })
); // (NODE_ENV)

/**
 * @param {string} NODE_ENV
 * @returns {Object|String}
 */
const whenTesting = R.when(
    R.equals('TESTING'), R.always({ port: 3002, host: 'localhost' })
); // (NODE_ENV)

/**
 * @param {string} NODE_ENV
 * @returns {Object|String}
 */
const whenLocal = R.when(
    R.equals('LOCAL'), R.always({ port: 3003, host: 'localhost' })
); // (NODE_ENV)

/**
 * @param {object} process - Node.js process object.
 * @returns {object}
 */
const setConfigValues = R.compose(
    whenProduction,
    whenStaging,
    whenTesting,
    whenLocal,
    getNodeEnvOrDefault
); // (process)

module.exports = setConfigValues(process);
