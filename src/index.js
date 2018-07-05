const config1 = require('./input/config1.json');

Object.prototype.renameKey = function (oldKey, newKey) {
    if (oldKey === newKey) {
        return this;
    }
    if (this.hasOwnProperty(oldKey)) {
        this[newKey] = this[oldKey];
        delete this[oldKey];
    }
    return this;
};

Object.prototype.renameKeys = function (oldKey, newKey) {
    if (oldKey === newKey) {
        return this;
    }

    console.log('this COMP', this);
    const iterate = (obj) => {
        const objKeys = Object.keys(obj);
        objKeys.forEach(property => {
            if (obj.hasOwnProperty(property)) {
                if (property === oldKey) {
                    obj.renameKey(oldKey, newKey);
                }
                if (typeof obj[property] === "object") {
                    iterate(obj[property]);
                } else {
                    // console.log(property + "   " + obj[property]);
                }
            }
        });
    };

    iterate(this);
    console.log('PRETTY');
    console.log(JSON.stringify(this, null, 2));
};

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
            {
                mutationType: 'RENAME',
                definition: {
                    from: 'prop1',
                    to: 'prop10'
                }
            },
            // {
            //     mutateType: 'MOVE',
            //     definition: {
            //         from: 'props',
            //         to: 'otherProps.someOtherProps'
            //     }
            // },
            // {
            //     mutateType: 'DELETE',
            //     definition: {
            //         from: 'otherProps.someOtherProps.prop2'
            //     }
            // }
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
        console.log('COMP', comp);
        return comp.renameKeys(definition.from, definition.to);
    }
};

const mutate = (componentConfig, mutationConfig) => {
    return componentConfig.components.map(comp => {
        const mutations = mutationConfig.mutations[comp.type];
        const resultingComponent = {...comp};

        if (!mutations) {
            return comp;
        }

        console.log(mutations);
        mutations.forEach(mutation => {
            mutationActions[mutation.mutationType](resultingComponent, mutation.definition);
        });
    })
};

mutate(componentConfig, mutationConfig);
