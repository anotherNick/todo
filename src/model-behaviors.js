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

        const deleteItemsRecursively = (item, callback) => {
          
            const relationships = state.relationships[item.id];

            if(relationships){

                relationships.forEach(relationship => {

                    const subItem = state[item.subtype][relationship];
                    callback(subItem, callback);

                });                

            }

            // Delete this item
            const result = delete state[item.type][item.id];

            if(result){
                // Delete relationships for this item
                delete state.relationships[item.id];
                
                const index = state.relationships[item.parentId].indexOf(item.id);
                if(index !== -1){
                    // Delete the relationship of this item with its parent
                    delete state.relationships[item.parentId][index];
                }
            }

            return result;

        }

        const item = state[details.type][details.id];
        const result = deleteItemsRecursively(item, deleteItemsRecursively);
       
        return result;

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
        } catch (e) {
            return false;
        }

    },

    saveState: () => {

        const toDoState = {};

        Object.entries(state).forEach(property => {
            toDoState[property[0]] = property[1];
        });
            try {
                localStorage.setItem('toDoState', JSON.stringify(toDoState));
            } catch (e) {
                return false;
            }
    },

    loadState: () => {
        
        Object.entries(JSON.parse(localStorage.getItem('toDoState'))).forEach(property => {

            state[property[0]] = property[1];

        });

    }
  
    
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