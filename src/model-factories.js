import { canBeCompleted, canHaveItems, canBeUpdated } from "./model-behaviors.js";

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

    return Object.assign(state, canBeUpdated(state), canBeCompleted(state));

}

export const toDoList = (title, parentID, due = null, priority = "Low") => {

    let state = {
        id: crypto.randomUUID(),
        parentID,
        title,
        due,
        priority,
    }

    return Object.assign(state, canHaveItems(state), canBeUpdated(state));

}

export const container = (() => {

    let state = {
        id: 0,
    }

    return Object.assign(state, canHaveItems(state));

})();