import { toDoItem, toDoList, toDoProject } from "./model-factories.js";

export const dataManager = (state) => ({

    addItem: (item) => {

        item.id = state.index;
        item.parentId = parseInt(item.parentId, 10);
        state.index++;
        state[item.type][item.id] = item;

        if(item.parentId !== undefined) {
            if(state.relationships[item.parentId] === undefined){
                state.relationships[item.parentId] = [];
            }

            state.relationships[item.parentId].push(item.id);
        }

        state.eventHandler.bus.publish(state.eventHandler.events.item_added, item);

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

            // Reinstantiate Objects
            //Object.entries(state['subitem']).forEach(entry => {

                //const flatItem = entry[1];
                //const newItem = toDoItem(flatItem.title, flatItem.parentId, flatItem.due, flatItem.desc, flatItem.priority, flatItem.notes, flatItem.complete);
                //state['item'][newItem.id] = newItem;

            //});

            Object.entries(state['item']).forEach(entry => {

                const flatItem = entry[1];
                const newItem = toDoItem(flatItem.title, 
                                         flatItem.parentId, 
                                         flatItem.due, 
                                         flatItem.desc, 
                                         flatItem.priority, 
                                         flatItem.notes, 
                                         flatItem.complete);
                state['item'][newItem.id] = newItem;

            });

            Object.entries(state['list']).forEach(entry => {

                const flatItem = entry[1];
                const newItem = toDoList(flatItem.title, 
                                         flatItem.parentId, 
                                         flatItem.due, 
                                         flatItem.priority, 
                                         flatItem.complete);
                state['list'][newItem.id] = newItem;

            });

            Object.entries(state['project']).forEach(entry => {

                const flatItem = entry[1];
                const newItem = toDoProject(flatItem.title);
                state['project'][newItem.id] = newItem;

            });

            return true;

        }

        const msg = "Failed to load from Local Storage.";
        state.eventHandler.bus.publish(state.eventHandler.events.data_load_fail, msg);
        return false;
    },
});
