const dotenv = require('dotenv');
const R = require('ramda')

interface IConfigObject {
  port: number,
  host: string
}

interface IConfigGenerator {
  (obj: IConfigObject): IConfigObject
}

dotenv.config();

let envSupported: (env: string) => boolean;
envSupported = (env) => {
  return R.contains(env, ['LOCAL', 'TESTING', 'STAGING', 'PRODUCTION'])
};

const inlineLog = R.tap(console.log);

let getNodeEnvOrDefault: (process: NodeJS.Process) => string;
getNodeEnvOrDefault = R.compose(
  R.unless(envSupported, R.always('LOCAL')),
  R.when(R.empty, R.always('LOCAL')),
  R.path(['env', 'NODE_ENV'])
);

let createDefaultConfigObject: (env: string) => IConfigObject;
createDefaultConfigObject = (env) => {
  return { env: env, port: 3000, host: 'localhost', other: 'Some other value which shant be changed!' }
}

let configObject: (env: string, config: IConfigObject) => IConfigObject;
configObject = (env: string, config: IConfigObject) => R.when(
  R.propEq('env', env),
  R.mapObjIndexed((v: any, k: string) => R.defaultTo(v, R.prop(k, config))) // This is an overly complicated Object.assign()....
);


let whenProduction: IConfigObject = configObject('PRODUCTION', { port: 3003, host: 'localhost' });
let whenStaging: IConfigObject = configObject('STAGING', { port: 3002, host: 'localhost' });
let whenTesting: IConfigObject = configObject('TESTING', { port: 3001, host: 'localhost' });


let setConfigValues: (process: NodeJS.Process) => IConfigObject;
setConfigValues = R.compose(
  inlineLog,
  whenTesting,
  whenStaging,
  whenProduction,
  createDefaultConfigObject,
  getNodeEnvOrDefault
);

module.exports = setConfigValues(process);
