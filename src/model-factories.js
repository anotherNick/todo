import { canBeCompleted, canHoldEntities, canBeUpdated, canPubSub } from "./model-behaviors.js";

export const toDoItem = (title, parentId, due = null, desc = null, priority = "Low", notes = null) => {

    let state = {
        id: '',
        type: "items",
        subtype: "subitems",
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
        type: "lists",
        subtype: "items",
        parentId,
        title,
        due,
        priority,
    }

    return Object.assign(state, canBeUpdated(state));

}

export const toDoProject = () => {

    let state = {
        id: '',
        type: "projects",
        subtype: "lists",
    }

    return Object.assign(state);

}

export const toDoSystem = () => {

    let state = {}
    
    return Object.assign(state, canHoldEntities(state), canPubSub(state));

}