const {
  Mutate
} = require('object-mutate/objectUtils');

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

export const migrateSingle = (input, mutations) =>
  new Promise((resolve, reject) => {
    let output = input;
    mutations.forEach(mutation => {
      try {
        const {
          type,
          definition
        } = mutation;

        output = mutator[type](output, definition);
      } catch(e) {
        console.log('cannot mutate', e);
      }
    });

    resolve(output);
  })
