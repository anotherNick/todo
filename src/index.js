import "./styles.css";
import { toDoItem, toDoList, toDoProject, toDoSystem } from "./model-factories.js";
import ListView from "./views/ListView.js";
import FormView from "./views/FormView.js"
import { events, EventBus } from "./controllers/PubSub.js";
import { format } from "date-fns";

const form = document.getElementById('new-item-form');
const formModal = document.getElementById('form-modal');

const pubSub = new EventBus();
const ToDo = toDoSystem(pubSub, events);
const submitForm = new FormView(form, formModal);
const listView = new ListView({ pubSub, events }, format, submitForm);

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

pubSub.subscribe(events.item_delete_request, (e) => { 

    ToDo.removeItem(e);
    ToDo.saveState();

});

pubSub.subscribe(events.item_update_request, details => {

    ToDo.updateItem(details);
    ToDo.saveState();

});

pubSub.subscribe(events.item_add_request, details => {

    ToDo.addItem(details);
    ToDo.saveState();

});

pubSub.subscribe(events.data_load_request, () => {

    ToDo.loadState();
    listView.renderAll(ToDo.exportAll());

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

pubSub.subscribe(events.item_updated, (item) => {

    submitForm.closeModal();

    const viewType = item.type + "View";
    const newElement = listView[viewType](item);
    const selector = `[data-${item.type}-id="${item.id}"]`;
    const oldElement = document.querySelector(selector);

    oldElement.replaceWith(newElement);

});

pubSub.subscribe(events.item_added, (item) => {

    submitForm.closeModal();
    
    if(item.type != 'project'){
        const viewType = item.type + "View";
        const newElement = listView[viewType](item);
        const parentType = ToDo.getParentType(item.type);
        const parent = ToDo.getItem(parentType, item.parentId);
        const selector = `#${parent.type}-${parent.id}-container`; 
        const container = document.querySelector(selector); 
              container.append(newElement);
    } else {

        const toDoData = ToDo.exportAll();
        listView.renderAll(toDoData);
        listView.updateActiveProject(item.id);

    }


});

const toDoData = ToDo.exportAll();
listView.renderAll(toDoData);

form.addEventListener('submit', e => {

    e.preventDefault();
    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData);
    
    if(entries.id != ''){

        pubSub.publish(events.item_update_request, entries);
    
    } else {

        pubSub.publish(events.item_add_request, entries);

    }

    submitForm.reset();

});

const formCloseBtn = document.getElementById('form-modal-close');
      formCloseBtn.addEventListener('click', () => {

        submitForm.closeModal();

    });

listView.styleCompletedItems();