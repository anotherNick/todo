import { completer, dataManager, persister } from "./model-behaviors.js";

export const toDoSubitem = (title, parentId, due = null, desc = null, priority = "Low", notes = null, complete = false) => {

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
        complete,
    }

    return Object.assign(state);

}

export const toDoItem = (title, parentId, due = null, desc = null, priority = "Low", notes = null, complete = false) => {

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
        complete,
    }

    return Object.assign(state);

}

export const toDoList = (title, parentId, due = null, priority = "Low", complete = false) => {

    let state = {
        id: '', 
        type: "list",
        subtype: "item",
        parentId,
        title,
        due,
        priority,
        complete,
    }

    return Object.assign(state);

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

    
    return Object.assign({}, dataManager(state), persister(state), completer(state));

}