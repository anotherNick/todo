import { canBeCompleted, dataManager, canBeUpdated, eventHandler, persister } from "./model-behaviors.js";

export const toDoItem = (title, parentId, due = null, desc = null, priority = "Low", notes = null) => {

    let state = {
        id: '',
        type: "item",
        subtype: "subitem",
        parentId,
        title,
        due,
        priority,
        desc,
        notes,
    }

    return Object.assign(state, canBeUpdated(state), canBeCompleted(state));

}

export const toDoList = (title, parentId, due = null, priority = "Low") => {

    let state = {
        id: '', 
        type: "list",
        subtype: "item",
        parentId,
        title,
        due,
        priority,
    }

    return Object.assign(state, canBeUpdated(state));

}

export const toDoProject = (title) => {

    let state = {
        id: '',
        type: "project",
        subtype: "list",
        title,
    }

    return Object.assign(state);

}

export const toDoSystem = (bus, events) => {

    let state = {
        project: {},
        list: {},
        item: {},
        subitem: {},
        relationships: {},
        unSubList: [],
        index: 1,
        eventHandler: { bus, events },
    }

    
    return Object.assign({}, dataManager(state), eventHandler(state), persister(state));

}