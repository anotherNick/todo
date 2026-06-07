
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

    removeItem: (id) => {
        const index = state.items.findIndex(item => item.id === id);

        if(index !== -1) {
            state.items.splice(index, 1);
        } else {
            state.items.forEach(subItem => {
                const index = subItem.items.findIndex(item => item.id === id);

                if(index !== -1){
                    subItem.items.splice(index, 1);
                }
            });
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