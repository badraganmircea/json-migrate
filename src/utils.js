const stringify = require('json-stable-stringify');

const {
  lstatSync,
  readdirSync,
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync
} = require('fs');

const {
  join
} = require('path');

const logger = require('./logger');

const mutateUtils = {};

mutateUtils.isDirectory = source => lstatSync(source).isDirectory();

mutateUtils.getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(mutateUtils.isDirectory);

mutateUtils.getFiles = source => readdirSync(source);

mutateUtils.createDirectory = source => {
  if (!existsSync(source)) {
    mkdirSync(source);
  }
}

mutateUtils.createFile = (source, data) => writeFileSync(source, stringify(data, {space: 4}));

mutateUtils.readJson = (path) => {
  const file = readFileSync(path).toString();
  return JSON.parse(file);
}

mutateUtils.readMutationFileByVersion = (pathToMutationsFile, version) => {
  const path = `${pathToMutationsFile}/v${version}/mutations.json`;
  return mutateUtils.readJson(path);
}

mutateUtils.createInBetweenVersionsArr = (fromVersion, toVersion) => {
  return Object.keys([...Array(toVersion - fromVersion + 1)]).map((version, index) => fromVersion + index);
}

mutateUtils.readJsonIntoMemory = (pathToInputConfigs) => {
  const configsList = mutateUtils.getFiles(pathToInputConfigs);
  return configsList.map(configPath =>{
      return {
        ...mutateUtils.readJson(pathToInputConfigs + '/' + configPath),
        path: configPath
      }});
  }

mutateUtils.writeToOutputFolder = (inputList, out) => {
  inputList.forEach(input => {
    if (out) {
      mutateUtils.createDirectory(out);
      mutateUtils.createFile(`${out}/${input.path}`, input);
      logger.success('--- Wrote output to: ', 0, `${out}/${input.path}`);
    }
  });
}

module.exports = mutateUtils;
