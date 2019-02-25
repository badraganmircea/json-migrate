const fs = require('fs');
require('object-mutate/objectUtils');

const readJson = (path) => {
  console.log('reading file...', path);
  const file = fs.readFileSync(path).toString();
  console.log('done reading the file...');
  console.log(file);
  return JSON.parse(file);
}

const readMutationFileByVersion = (pathToMutationsFile, version) => {
  const path = `${pathToMutationsFile}/v${version}/mutations.json`;
  return readJson(path);
}

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

const migrate = (fromVersion, toVersion) => {
  const mutations = readMutationFileByVersion('./mutations', toVersion).mutations;
  const input = readJson('./input/inputConfig.json');

  console.log('beginning mutation for file');
  mutations.forEach(mutation => {
    console.log('attempting mutation', mutation);
    const {
      type,
      definition
    } = mutation;
    mutator[type](input, definition);
  });
  console.log('result config is', JSON.stringify(input, null, 2));
}

migrate(null, 1);