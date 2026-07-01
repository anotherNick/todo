import { toDoItem, toDoList, toDoProject, toDoSystem } from "../models/model-factories.js";
import { pubSub, events } from "./PubSub.js";
import { format } from "date-fns";

const ToDo = toDoSystem(pubSub, events);

pubSub.subscribe(events.init, (e) => { 

    if(!ToDo.loadState()) {
        const date = format(new Date(), "PP");
        
        const project = toDoProject('Default Project');
        const secondProject = toDoProject('Another Project');

        const newList = toDoList("default", 1);
        const secondList = toDoList("not default", 1, date);
        const thirdList = toDoList("an empty list", 1);

        const newItem = toDoItem("test item", 3);
        const secondItem = toDoItem('another test item', 3, date, 'test description', "Low", "test note");
        const thirdItem = toDoItem('third todo item', 3, date, 'third description', "Mediun", "third notes" );
        const fourthItem = toDoItem('fourth todo item', 4, date, 'fourth description', "High", "fourth notes" );

        ToDo.addItem(project);
        ToDo.addItem(secondProject);
        ToDo.addItem(newList);
        ToDo.addItem(secondList);
        ToDo.addItem(thirdList);
        ToDo.addItem(newItem);
        ToDo.addItem(secondItem);
        ToDo.addItem(thirdItem);
        ToDo.addItem(fourthItem);

        console.log('Generated default content');
    }

    pubSub.publish(events.model_loaded, ToDo.exportAll());

});


pubSub.subscribe(events.item_delete_request, (e) => { 

    ToDo.removeItem(e);
    ToDo.saveState();

});

pubSub.subscribe(events.item_update_request, details => {

    const item = ToDo.updateItem(details);
    ToDo.saveState();

    pubSub.publish(events.item_updated, item);

});

pubSub.subscribe(events.item_add_request, details => {

    const item = ToDo.addItem(details);
    ToDo.saveState();

    if(item.type === "project") {

        let details = {};
            details.id = item.id;
            details.toDoData = ToDo.exportAll();

        pubSub.publish(events.project_added, details);

    } else {

        let details = {};
            details.item = item;
            details.parent = ToDo.getItem(ToDo.getParentType(item.type), item.parentId);
        
        pubSub.publish(events.item_added, details);

    }

});

pubSub.subscribe(events.data_load_request, () => {

    ToDo.loadState();
    appView.renderAll(ToDo.exportAll());

});

pubSub.subscribe(events.data_save_request, () => {

    ToDo.saveState();

});

pubSub.subscribe(events.item_completed, details => {

    ToDo.completeItem(details.type, details.id);
    ToDo.saveState();

});

pubSub.subscribe(events.item_incompleted, details => {

    ToDo.incompleteItem(details.type, details.id);
    ToDo.saveState();

});