export const canHoldEntities = (state) => ({
    projects: {},
    lists: {},
    items: {},
    subitems: {},
    relationships: [],
    index: 0,

    addEntity: (newEntity) => {
        
        newEntity.id = state.getNewIndex();
        state[newEntity.type][newEntity.id] = newEntity;
        if(newEntity.parentId !== undefined) {
            state.addRelationship(newEntity.id, newEntity.parentId);
        }

    },

    removeEntity: (details) => {

        const index = state[details.type].findIndex(entity => entity.id === details.id);

        if(index !== -1) {
            state[details.type].splice(index, 1);
        }

    },

    getEntity: (type, id) => {
        const index = state[type].findIndex(item => item.id === id);

        if(index !== -1){
            return state[type][index];
        }
    },
    
    getEntities: (type) => {
        return state[type];
    },

    getNewIndex: () => {
        state.index++;
        return state.index;
    },

    addRelationship: (id, parentId) => {

        if(state.relationships[parentId] === undefined){
            state.relationships[parentId] = [];
        }

        state.relationships[parentId].push(id);

    },

    exportData: () => {

        const model = [];

        Object.values(state.projects).forEach( project => {

            if(state.relationships[project.id] !== undefined) {

                project.entities = [];     
                state.relationships[project.id].forEach(listId => {

                    const list = state.lists[listId];
                    if(state.relationships[listId] !== undefined) {

                        list.entities = [];
                        state.relationships[listId].forEach(itemId => {

                            const item = state.items[itemId];
                            if(state.relationships[itemId] !== undefined) {

                                item.entities = [];
                                state.relationships[itemId].forEach(subitemId => {

                                    const subitem = state.subitems[subitemId];
                                    item.entities.push(subitem);

                                });
                           }
                           list.entities.push(item); 
                        });
                    }
                    project.entities.push(list);
                });
            }
            model.push(project);
        });
        return JSON.stringify(model);
    },


});

export const canBeCompleted = (state) => ({
    complete: false,

    toggleComplete: () => { 
        state.complete = (state.complete === true ? false : true); 
    },
});

// Expects an object with only the properties and values to be replaced.
export const canBeUpdated = (state) => ({
    update: (values) => {
        for(const [property, value] of Object.entries(values)) {
           
            state[property] = value; 
        
        }
    },
    
});

export const canBeNested = (state) => ({



});

export const canBeReordered = (state) => ({



});

export const canPubSub = (state) => ({

    unSubList: [],
    
    subscribe: (bus, event, callback) => {
        const unsubscribe = bus.subscribe(event, callback);
        state.unSubList.push(unsubscribe);
    },

    unsubscribeAll: () => {
        state.unSubList.forEach(fn => {

            fn();

        });
        
        state.unSubList = [];
    },

});