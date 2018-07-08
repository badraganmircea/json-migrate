const standardComponentConfig = require('./input/standardComponentConfig.json');
require('./objectUtils');

// {
//     mutationType: 'RENAME',
//     definition: {
//         from: 'prop1',
//         to: 'prop10'
//     }
// },
// {
//     mutationType: 'MOVE',
//     definition: {
//         from: 'otherFuckingProps.prop12',
//         to: 'props'
//     }
// },

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

const mutate = (componentConfig) => {
    const {components, mutationConfig} = componentConfig;
    return components.map(comp => {
        const mutations = mutationConfig.mutations[comp.type];
        const resultingComponent = {...comp};

        if (!mutations) {
            return comp;
        }

        mutations.forEach(mutation => {
            console.log('MUTATION BEFORE', resultingComponent);
            mutationActions[mutation.mutationType](resultingComponent, mutation.definition);
            console.log('MUTATION AFTER', resultingComponent);
        });
    })
};

mutate(standardComponentConfig.configuration);
