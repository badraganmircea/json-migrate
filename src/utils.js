const {
  lstatSync,
  readdirSync,
  readFileSync
} = require('fs');

const {
  join
} = require('path');

const mutateUtils = {};

mutateUtils.isDirectory = source => lstatSync(source).isDirectory();

mutateUtils.getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(mutateUtils.isDirectory);

mutateUtils.getFiles = source => readdirSync(source);

mutateUtils.readJson = (path) => {
  const file = readFileSync(path).toString();
  return JSON.parse(file);
}

mutateUtils.readMutationFileByVersion = (pathToMutationsFile, version) => {
  const path = `${pathToMutationsFile}/v${version}/mutations.json`;
  return mutateUtils.readJson(path);
}

module.exports = mutateUtils;
