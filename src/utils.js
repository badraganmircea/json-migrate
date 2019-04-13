require('object-mutate/objectUtils');
const stringify = require('json-stable-stringify');
const xml2js = require('xml2js');

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

mutateUtils.createFile = (source, data) => writeFileSync(source, stringify(data, {
  space: 4
}));

mutateUtils.parseXml = (file) =>
  new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    parser.parseString(file, function(err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  })

mutateUtils.readJson = async (path) => {
  const file = readFileSync(path).toString();
  if (path.indexOf('.json') > 0) {
    return await JSON.parse(file);
  }
  if (path.indexOf('.xml') > 0) {
    return await mutateUtils.parseXml(file);
  }
}

mutateUtils.readJsonSync = (path) => {
  const file = readFileSync(path).toString();
  if (path.indexOf('.json') > 0) {
    return JSON.parse(file);
  }
}

mutateUtils.readMutationFileByVersion = (pathToMutationsFile, version) => {
  const path = `${pathToMutationsFile}/v${version}/mutations.json`;
  return mutateUtils.readJsonSync(path);
}

mutateUtils.createInBetweenVersionsArr = (fromVersion, toVersion) => {
  return Object.keys([...Array(toVersion - fromVersion + 1)]).map((version, index) => fromVersion + index);
}

mutateUtils.readJsonIntoMemory = (pathToInputConfigs) => {
  const configsList = mutateUtils.getFiles(pathToInputConfigs);
  return Promise.all(
    configsList.map(async configPath => {
      const objConfig = await mutateUtils.readJson(pathToInputConfigs + '/' + configPath);
      return {
        ...objConfig,
        path: configPath
      };
    })
  )
}

mutateUtils.writeToOutputFolder = (inputList, out) => {
  inputList.forEach(input => {
    if (out) {
      mutateUtils.createDirectory(out);
      const path = input.path;
      delete input.path;
      if (path.indexOf('.xml') > 0) {
        const builder = new xml2js.Builder();
        const xml = builder.buildObject({
          root: {
            $: {
              id: "my id"
            },
            _: "my inner text"
          }
        });
        mutateUtils.createFile(`${out}/${path}`, xml);
      } else {
        mutateUtils.createFile(`${out}/${path}`, input);
      }
      logger.success('--- Wrote output to: ', 0, `${out}/${path}`);
    }
  });
}

module.exports = mutateUtils;