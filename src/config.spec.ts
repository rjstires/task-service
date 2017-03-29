import { expect } from 'chai';
import * as R from 'ramda';
import {
  environmentSupported,
  getEnvironmentOrDefault,
  createDefaultConfigObject,
  updateConfigObjectForEnvironment,
  setConfigValues
} from './config';

describe('Config', () => {

  // environmentSupported
  describe('environmentSupported', () => {
    it('Returns true given an allowed value.', () => {
      let actual = environmentSupported('PRODUCTION');
      expect(actual).to.be.true;
    })
    it('Returns false given an unsupported value.', () => {
      expect(environmentSupported('TH1S1SN0TSUPP0RTED')).to.be.false;
    })
  })

  // getEnvironmentOrDefault
  describe('getEnvironmentOrDefault', () => {
    it('Returns LOCAL when unable to find NODE_ENV.', () => {
      let actual = getEnvironmentOrDefault(process);
      let expected = 'LOCAL';
      expect(actual).to.eq(expected);
    })

    it('Returns NODE_ENV when found.', () => {
      let productionProcees = R.set(R.lensPath(['env', 'NODE_ENV']), 'PRODUCTION', process);
      expect(getEnvironmentOrDefault(productionProcees)).to.eq('PRODUCTION');
    })
  })

  // createDefaultConfigObject
  describe('createDefaultConfigObject', () => {
    it('Returns a config object with env specificed.', () => {
      let actual = createDefaultConfigObject('RABBLE');
      let expected = { env: 'RABBLE', port: 3000, host: 'localhost' };
      expect(actual).to.eql(expected);
    })
  })

  // updateConfigObjectForEnvironment
  describe('updateConfigObjectForEnvironment', () => {

    it('Returns incoming config object if env doesnt match.', () => {
      let incomingConfigObject = { env: 'LOCAL', port: 3000, host: 'localhost' };
      let updatedConfigObject = { env: 'DOESNTMATCH', port: 9999, host: 'SOMETHINGELSE' };
      let actual = updateConfigObjectForEnvironment('A-ENV-VALUE-THAT-DOESNT-EXIST', updatedConfigObject)(incomingConfigObject);
      expect(actual).to.eql(incomingConfigObject);
    })

    it('Returns updated config object if env matches.', () => {
      let incomingConfigObject = { env: 'PRODUCTION', port: 3000, host: 'localhost' };
      let updatedConfigObject = { env: 'UPDATED-PRODUCTION-OBJECT', port: 3003, host: 'someproductionsite.com' };
      let actual = updateConfigObjectForEnvironment('PRODUCTION', updatedConfigObject)(incomingConfigObject);
      expect(actual).to.eql(updatedConfigObject);
    })

    it('Updated config object Will inherit keys from incoming config object.', () => {
      let unmodifiedKey = { dont: 'MODIFY-ME-BRO' }
      let incomingConfigObject = { env: 'PRODUCTION', port: 3000, host: 'localhost', unmodifiedKey };
      let updatedConfigObject = { env: 'UPDATED-PRODUCTION-OBJECT', port: 3003, host: 'someproductionsite.com' };
      let actual = updateConfigObjectForEnvironment('PRODUCTION', updatedConfigObject)(incomingConfigObject);
      expect(actual).to.eql({ ...updatedConfigObject, unmodifiedKey });
    })
  })

  // setConfigValues
  describe('setConfigValues', () => {
    it('Returns a config object.', () => {
      // Default
      let actual = setConfigValues(process);
      expect(R.propEq('env', 'LOCAL', actual)).to.be.true;
      expect(R.propEq('port', 3000, actual)).to.be.true;
      expect(R.propEq('host', 'localhost', actual)).to.be.true;
      
      // When NODE_ENV is found.
      let productionProcees = R.set(R.lensPath(['env', 'NODE_ENV']), 'PRODUCTION', process);
      actual = setConfigValues(productionProcees);
      expect(R.propEq('env', 'PRODUCTION', actual)).to.be.true;
      expect(R.propEq('port', 3003, actual)).to.be.true;
      expect(R.propEq('host', 'prod.localhost', actual)).to.be.true;
    })
  })
})