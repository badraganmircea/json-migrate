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

module.exports = mutateUtils;
