export const dataManager = (state) => ({

    addItem: (newItem) => {

        newItem.id = state.index;
        state.index++;
        state[newItem.type][newItem.id] = newItem;

        if(newItem.parentId !== undefined) {
            if(state.relationships[newItem.parentId] === undefined){
                state.relationships[newItem.parentId] = [];
            }

            state.relationships[newItem.parentId].push(newItem.id);
        }

    },

    removeItem: (details) => {

        const index = state[details.type].findIndex(item => item.id === details.id);

        if(index !== -1) {
            state[details.type].splice(index, 1);
        }

    },

    getItem: (type, id) => {
        const index = state[type].findIndex(item => item.id === id);

        if(index !== -1){
            return state[type][index];
        }
    },
    
    getItems: (type) => {
        return state[type];
    },

    exportAll: () => {

        const getItemsRecursively = (item, callback) => {

            if(state.relationships[item.id] !== undefined) {

                item.subItems = [];
                state.relationships[item.id].forEach(relationship => {

                    let subItem = state[item.subtype][relationship];
                    item.subItems.push(callback(subItem, callback));

                });

            }

            return item;

        }

        const model = [];

        Object.values(state.projects).forEach(project => {

            model.push(getItemsRecursively(project, getItemsRecursively));

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

export const persister = (state) => ({

    loadData: () => {

        return localStorage.getItem('toDoData');

    },

    saveData: (data) => {

        try {

            localStorage.setItem('toDoData', data);
            return true;

        } catch () {

            return false;

        }

    }, 
  
    
});

export const eventSubscriber = (state) => ({

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