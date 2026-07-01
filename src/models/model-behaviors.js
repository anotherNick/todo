export const dataManager = (state) => ({

    addItem: (item) => {

        item.id = state.index;
        state.index++;
        state[item.type][item.id] = item;

        if(item.parentId !== undefined) {
        
            item.parentId = parseInt(item.parentId, 10);

            if(state.relationships[item.parentId] === undefined){
                state.relationships[item.parentId] = [];
            }

            state.relationships[item.parentId].push(item.id);
        }

        return item;

    },

    updateItem: (itemUpdate) => {

        const item = state[itemUpdate.type][itemUpdate.id];

        Object.entries(itemUpdate).forEach(property => {

            item[property[0]] = (property[1] !== '') ? property[1] : null;

        });

        item.id = parseInt(item.id, 10);
        item.parentId = parseInt(item.parentId, 10);
        
        return item;

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

        return state[type][id];
    
    },
    
    getItems: (type) => {
    
        return state[type];
    
    },

    getParentType: (type) => {

        switch(type) {
            case "subitem":
                return "item";
            case "item":
                return "list";
            case "list":
                return "project";
            default:
                return null;
            }

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

export const completer = (state) => ({

    completeItem: (type, id) => {

        state[type][id]['complete'] = true;

    },

    incompleteItem: (type, id) => {

        state[type][id]['complete'] = false;

    },

});

export const persister = (state) => ({

    saveState: () => {

        const toDoState = {};

            for(const [key, value] of Object.entries(state)) {

                if(key === 'eventHandler') { 
                    
                    continue;
                
                } else if(key === "index") {

                    toDoState[key] = value;

                } else {

                    toDoState[key] = {};
                    
                    for(const [key2, value2] of Object.entries(value)) {

                        toDoState[key][key2] = value2;

                    }

                }

            }
            
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

        const toDoState = JSON.parse(localStorage.getItem('toDoState'));

        if(toDoState) { 
            
            for(const [key, value] of Object.entries(toDoState)) {

                if(key === "index" || key === "relationships") {

                    state[key] = value;

                } else if(key == "") {
                
                    continue;
                
                } else {
                
                    state[key] = {};

                    for(const [key2, value2] of Object.entries(value)) {

                        state[key][key2] = value2;

                    }

                }

           } 
        
            return true;

        }

        const msg = "Failed to load from Local Storage.";
        state.eventHandler.bus.publish(state.eventHandler.events.data_load_fail, msg);
        return false;
    },
});
