require('./objectUtils');
const inputConfig = require('./input/inputConfig.json');
const mutationConfig2 = require('./input/mutationsV2.json');
const mutationConfig3 = require('./input/mutationsV3.json');
const mutationConfig4 = require('./input/mutationsV4.json');
const cli = require('./cli');

// const mutationsList = [mutationConfig2, mutationConfig3, mutationConfig4];
const mutationsList = [mutationConfig2, mutationConfig3];

const mutationTypes = {
  ADD: 'ADD',
  RENAME: 'RENAME',
  MOVE: 'MOVE',
  DELETE: 'DELETE'
};

const mutationActions = {
  [mutationTypes.RENAME]: (comp, definition) => {
    comp.renameKeys(definition.from, definition.to);
  },
  [mutationTypes.MOVE]: (comp, definition) => {
    comp.moveKey(definition.from, definition.to);
  },
  [mutationTypes.DELETE]: (comp, definition) => {
    comp.deleteKey(definition.from);
  },
  [mutationTypes.ADD]: (comp, definition) => {
    comp.addToKey(definition.to, definition.targetObject);
  }
};

const mutate = (componentConfig, mutationConfig) => {
  const {
    components
  } = componentConfig;
  return components.map(comp => {
    const mutations = mutationConfig.mutations[comp.type];
    const resultingComponent = {
      ...comp
    };

    if (!mutations) {
      return comp;
    }

    mutations.forEach(mutation => {
      mutationActions[mutation.mutationType](resultingComponent, mutation.definition);
    });

    return comp;
  })
};

const migrate = (inputConfig, mutationsList) => {
  let inProgressConfig = {
    ...inputConfig
  };
  mutationsList.forEach((mutation) => {
    inProgressConfig.components = mutate(inProgressConfig, mutation);
    console.log('config at version => ', mutation.version);
    console.log('in progress config', JSON.stringify(inProgressConfig, null, 2));
  });
};

// migrate(inputConfig.configuration, mutationsList);

cli.init();