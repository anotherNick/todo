import "./styles.css";
import { toDoItem, toDoList, toDoProject, toDoSystem } from "./model-factories.js";
import View from "./views.js";
import { events, EventBus } from "./controller.js";
import { format } from "date-fns";

const pubSub = new EventBus();
const ToDo = toDoSystem(pubSub, events);
const listView = new View({ pubSub, events });
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


ToDo.subscribe(events.item_delete_request, (e) => { 

    ToDo.removeItem(e);
    ToDo.saveState();

});

ToDo.subscribe(events.item_form_submit, details => {

    ToDo.updateItem(details);
    ToDo.saveState();

});

ToDo.subscribe(events.data_load_request, () => {

    ToDo.loadState();
    listView.renderAll(ToDo.exportAll());

});

ToDo.subscribe(events.data_save_request, () => {

    ToDo.saveState();

});

pubSub.subscribe(events.item_updated, (item) => {

    const formModal = document.getElementById('form-modal');
    formModal.close();

    const viewType = item.type + "View";
    const newElement = listView[viewType](item);
    const selector = `[data-${item.type}-id="${item.id}"]`;
    const oldElement = document.querySelector(selector);

    oldElement.replaceWith(newElement);

});

const toDoData = ToDo.exportAll();

listView.renderAll(toDoData);

const newItemForm = document.getElementById('new-item-form');
    newItemForm.addEventListener('submit', e => {

        e.preventDefault();
        const formData = new FormData(e.target);
        const entries = Object.fromEntries(formData);
        
        pubSub.publish(events.item_form_submit, entries);


    });

const loadDataBtn = document.getElementById('load-data');
    loadDataBtn.addEventListener('click', () => {

        pubSub.publish(events.data_load_request);

    });

const formCloseBtn = document.getElementById('form-modal-close');
    formCloseBtn.addEventListener('click', () => {

        const formModal = document.getElementById('form-modal');
            formModal.close();

    });
