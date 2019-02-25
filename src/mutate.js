const fs = require('fs');
require('object-mutate/objectUtils');
const mutateUtils = require('./utils');
const logger = require('./logger');

const mutator = {};

mutator.types = {
  ADD: 'ADD',
  COPY: 'COPY'
}

mutator[mutator.types.ADD] = function(inputConfig, mutation) {
  const {
    to,
    value,
    matchProperties
  } = mutation;
  inputConfig.addToKey(to, value, {
    matchProperties
  });
}

mutator[mutator.types.COPY] = function(inputConfig, mutation) {
  const {
    from,
    to,
    matchProperties
  } = mutation;

  inputConfig.copyFromKey(from, to, {
    matchProperties
  });
}

const migrate = (pathToMutations, pathToInputConfigs, fromVersion, toVersion) => {
  logger.operation('Starting migration to version ' + toVersion);
  logger.verticalSpace(1);
  logger.info('Reading mutations from: ', 0, pathToMutations);
  const mutations = mutateUtils.readMutationFileByVersion(pathToMutations, toVersion).mutations;
  logger.info('Reading configs from:   ', 0, pathToInputConfigs);
  const configsList = mutateUtils.getFiles(pathToInputConfigs);
  logger.verticalSpace(1);

  configsList.forEach(configPath => {
    logger.info('Begin mutations of: ', 0, configPath);
    const input = mutateUtils.readJson(pathToInputConfigs + '/' + configPath);
    mutations.forEach(mutation => {
      const {
        type,
        definition
      } = mutation;
      mutator[type](input, definition);
    });
    logger.success('--- Successfully mutate: ', 0, configPath);
  })
}

module.exports = migrate;
