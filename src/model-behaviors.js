export const canHoldEntities = (state) => ({
    projects: [],
    lists: [],
    items: [],
    subItems: [],

    addEntity: (newEntity) => {
        const index = state[newEntity.type].findIndex(entity => entity.id === newEntity.id);

        if(index === -1){
            state[newEntity.type].push(newEntity);
        }else{
            throw new Error('entity ID must be unique!');
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