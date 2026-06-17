import { canBeCompleted, dataManager, canBeUpdated, eventSubscriber, persister } from "./model-behaviors.js";

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

export const toDoSystem = () => {

    let state = {
        project: {},
        list: {},
        item: {},
        subitem: {},
        relationships: {},
        unSubList: [],
        index: 1,
    }

    
    return Object.assign({}, dataManager(state), eventSubscriber(state), persister(state));

}