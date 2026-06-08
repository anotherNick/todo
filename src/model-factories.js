import { canBeCompleted, canHoldEntities, canBeUpdated, canPubSub } from "./model-behaviors.js";

export const toDoItem = (title, parentID, due = null, desc = null, priority = "Low", notes = null) => {

    let state = {
        id: crypto.randomUUID(),
        type: "items",
        parentID,
        title,
        due,
        priority,
        desc,
        notes,
    }

    return Object.assign(state, canBeUpdated(state), canBeCompleted(state));

}

export const toDoList = (title, parentID, due = null, priority = "Low") => {

    let state = {
        id: crypto.randomUUID(),
        type: "lists",
        parentID,
        title,
        due,
        priority,
    }

    return Object.assign(state, canBeUpdated(state));

}

export const toDoProject = () => {

    let state = {
        id: crypto.randomUUID(),
        type: "projects",
    }

    return Object.assign(state);

}

export const toDoSystem = () => {

    let state = {}
    
    return Object.assign(state, canHoldEntities(state), canPubSub(state));

}