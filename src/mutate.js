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

const migrate = (pathToMutations, pathToInputConfigs, fromVersion, toVersion, out) => {
  logger.operation('Starting migration to version ' + toVersion);
  logger.verticalSpace(1);

  const inBetweenVersions = mutateUtils.createInBetweenVersionsArr(fromVersion, toVersion);

  logger.info('Doing the following migration steps', 0, inBetweenVersions);
  logger.verticalSpace(1);

  const inputList = mutateUtils.readJsonIntoMemory(pathToInputConfigs);

  inBetweenVersions.forEach(version => {
    logger.info('Reading mutations from: ', 0, pathToMutations + '/v' + version);
    const mutations = mutateUtils.readMutationFileByVersion(pathToMutations, version).mutations;
    logger.verticalSpace(1);

    inputList.forEach(input => {
      try {
        logger.info('Begin mutations of: ', 0, input.path);
        mutations.forEach(mutation => {
          const {
            type,
            definition
          } = mutation;
          mutator[type](input, definition);
        });
        logger.success('--- Successfully mutate: ', 0, input.path);
      } catch(e) {
        logger.error('Could not migrate the following configuration ', 0, input.path);
        logger.error(e);
      }
    });

    logger.verticalSpace(1);
    logger.operation('Migration to version ' + version + ' was successfull');
    logger.verticalSpace(1);
  });

  mutateUtils.writeToOutputFolder(inputList, out);
  
  logger.verticalSpace(1);
  logger.operation('Migration complete!');
}

module.exports = migrate;
