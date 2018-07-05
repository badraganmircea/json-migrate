const config1 = require('./input/config1.json');
require('./objectUtils');

const componentConfig = {
    components: [
        {
            type: 'COMPONENT1',
            props: {
                prop1: 'asdsa',
                prop2: 'adsadadsad2da'
            },
            otherFuckingProps: {
                prop12: {
                    prop1: {
                        value: 'smt'
                    }
                }
            }
        },
        {
            type: 'COMPONENT2',
            props: {
                prop1: 'hjhjhjhj',
                prop2: 'lklkllkll'
            }
        }
    ]
};

const mutationConfig = {
    version: '1',
    mutations: {
        COMPONENT1: [
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
            {
                mutationType: 'DELETE',
                definition: {
                    from: 'otherFuckingProps.prop12.prop1.value'
                }
            }
        ]
    }
};

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
    }
};

const mutate = (componentConfig, mutationConfig) => {
    return componentConfig.components.map(comp => {
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

mutate(componentConfig, mutationConfig);
