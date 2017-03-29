import * as dotenv from 'dotenv';
import * as R from 'ramda';

interface IConfigObject {
  env: string,
  port: number,
  host: string
}

dotenv.config();

// Helper, extract.
const inlineLog = R.tap(console.log);

export let environmentSupported: (env: string) => boolean;
environmentSupported = (env) => R.contains(env, ['LOCAL', 'TESTING', 'STAGING', 'PRODUCTION']);

export let getEnvironmentOrDefault: (process: NodeJS.Process) => string;
getEnvironmentOrDefault = R.compose(
  R.unless(environmentSupported, R.always('LOCAL')),
  R.when(R.empty, R.always('LOCAL')),
  R.path(['env', 'NODE_ENV'])
);

export let createDefaultConfigObject: (env: string) => IConfigObject;
createDefaultConfigObject = (env) => Object.assign({}, {
  env,
  port: 3000,
  host: 'localhost'
});

export let updateConfigObjectForEnvironment: (env: string, config: IConfigObject) => (config: IConfigObject) => IConfigObject;
updateConfigObjectForEnvironment = (env, config) => R.when(
  R.propEq('env', env),
  (obj) => R.merge(obj, config)
);

export let setConfigValues: (process: NodeJS.Process) => IConfigObject;
setConfigValues = R.compose(
  inlineLog,
  updateConfigObjectForEnvironment('TESTING', {env: 'TESTING', port: 3001, host: 'testing.localhost' }),
  updateConfigObjectForEnvironment('STAGING', { env: 'STAGING', port: 3002, host: 'staging.localhost' }),
  updateConfigObjectForEnvironment('PRODUCTION', { env: 'PRODUCTION', port: 3003, host: 'prod.localhost' }),
  createDefaultConfigObject,
  getEnvironmentOrDefault
);

export const {env, port, host } = setConfigValues(process);
