import { canBeCompleted, canHoldItems, canBeUpdated, canPubSub } from "./model-behaviors.js";

export const toDoItem = (title, parentID, due = null, desc = null, priority = "Low", notes = null) => {

    let state = {
        id: crypto.randomUUID(),
        parentID,
        title,
        due,
        priority,
        desc,
        notes,
    }

    return Object.assign(state, canBeUpdated(state), canBeCompleted(state), canPubSub(state));

}

export const toDoList = (title, parentID, due = null, priority = "Low") => {

    let state = {
        id: crypto.randomUUID(),
        parentID,
        title,
        due,
        priority,
    }

    return Object.assign(state, canHoldItems(state), canBeUpdated(state), canPubSub(state));

}

export const toDoProject = () => {

    let state = {
        id: 0,
    }

    return Object.assign(state, canHoldItems(state), canPubSub(state));

};