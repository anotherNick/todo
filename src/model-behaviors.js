
export const canBeCompleted = (state) => ({
    complete: false,

    toggleComplete: () => { 
        state.complete = (state.complete === true ? false : true); 
    },
});


export const canHoldItems = (state) => ({
    items: [],
    
    addItem: (newItem) => {
        const index = state.items.findIndex(item => item.id === newItem.id);
        
        if(index === -1){
            state.items.push(newItem);
        }else{
            throw new Error('item id must be unique!')
        }
    },

    removeItem: (details) => {
        
        if(details.parentId === state.id){

            const index = state.items.findIndex(item => item.id === details.itemId);

            if(index !== -1) {
                state.items[index].unsubscribeAll();
                state.items.splice(index, 1);
            }

        }

    },
    
    getItem: (id) => {
        const index = state.items.findIndex(item => item.id === id);

        if(index !== -1){
            return state.items[index];
        }
    },

    getItems: () => {
        return state.items;
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