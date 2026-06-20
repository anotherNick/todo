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

    updateItem: (itemUpdate) => {

        const item = state[itemUpdate.type][itemUpdate.id];

        Object.entries(itemUpdate).forEach(property => {

            item[property[0]] = (property[1] !== '') ? property[1] : null;

        });

        item.id = parseInt(item.id, 10);
        item.parentId = parseInt(item.parentId, 10);
        state.eventHandler.bus.publish(state.eventHandler.events.item_updated, item);


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
                
                if(item.parentId) {
                    const index = state.relationships[item.parentId].indexOf(item.id);
                    if(index !== -1){
                        // Delete the relationship of this item with its parent
                        state.relationships[item.parentId].splice(index, 1);
                    }
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

        Object.values(state.project).forEach(project => {

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

    saveState: () => {

        const toDoState = {};

        Object.entries(state).forEach(property => {
            
            // eventHandler cannot be stringified
            if(property[0] !== 'eventHandler') {
                toDoState[property[0]] = property[1];
            }
        
        });
            try {

                localStorage.setItem('toDoState', JSON.stringify(toDoState));
                return true;

            } catch (e) {

                const msg = "Unable to access Local Storage. Progress will not be saved.";
                state.eventHandler.bus.publish(state.eventHandler.events.data_access_error, msg);
                return false;

            }
    },

    loadState: () => {
        
        const toDoState = localStorage.getItem('toDoState');
        
        if(toDoState) { 
            Object.entries(JSON.parse(toDoState)).forEach(property => {

                state[property[0]] = property[1];

            });

            return true;

        }

        const msg = "Failed to load from Local Storage.";
        state.eventHandler.bus.publish(state.eventHandler.events.data_load_fail, msg);
        return false;
    },
});

export const eventHandler = (state) => ({

    publish: (event, details = null) => {

        state.bus.publish(event, details);

    },
    
    subscribe: (event, callback) => {

        const unsubscribe = state.eventHandler.bus.subscribe(event, callback);
        //state.unSubList.push(unsubscribe);
    },

    unsubscribeAll: () => {
        
        state.unSubList = [];
    
    },

});