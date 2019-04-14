const fs = require('fs');
const {
  Mutate
} = require('object-mutate/objectUtils');
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

  const output = new Mutate(inputConfig);
  output.addToKey(to, value, {
    matchProperties
  });

  return output.value();
}

mutator[mutator.types.COPY] = function(inputConfig, mutation) {
  const {
    from,
    to,
    matchProperties
  } = mutation;

  const output = new Mutate(inputConfig);
  output.copyFromKey(from, to, {
    matchProperties
  });

  return output.value();
}

const migrate = (pathToMutations, pathToInputConfigs, fromVersion, toVersion, out) => {
  logger.operation(`Starting migration from version ${fromVersion} to ${toVersion}`);
  logger.verticalSpace(1);

  const inBetweenVersions = mutateUtils.createInBetweenVersionsArr(fromVersion, toVersion);

  logger.info('Doing the following migration steps', 0, inBetweenVersions);
  logger.verticalSpace(1);

  mutateUtils.readJsonIntoMemory(pathToInputConfigs)
    .then(inputList => {
      let outputList = inputList;
      inBetweenVersions.forEach(version => {
        logger.info('Reading mutations from: ', 0, pathToMutations + '/v' + version);
        const mutations = mutateUtils.readMutationFileByVersion(pathToMutations, version).mutations;
        logger.verticalSpace(1);
        outputList = outputList.map(input => {
          try {
            logger.info('Begin mutations of: ', 0, input.path);
            let output = input;

            mutations.forEach(mutation => {
              const {
                type,
                definition
              } = mutation;

              output = mutator[type](output, definition);
            });

            logger.success('--- Successfully mutate: ', 0, input.path);

            return output;
          } catch (e) {
            logger.error('Could not migrate the following configuration ', 0, input.path);
            logger.error(e);
          }
        });

        logger.verticalSpace(1);
        logger.operation('Migration to version ' + version + ' was successfull');
        logger.verticalSpace(1);
      });

      mutateUtils.writeToOutputFolder(outputList, out);

      logger.verticalSpace(1);
      logger.operation('Migration complete!');
    })
    .catch(e => {
      logger.error('Something went wrong, check below stacktrace');
      logger.error(e);
    });
}

module.exports = migrate;