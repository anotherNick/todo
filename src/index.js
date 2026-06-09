import "./styles.css";
import { toDoItem, toDoList, toDoProject, toDoSystem } from "./model-factories.js";
import View from "./views.js";
import { events, EventBus } from "./controller.js";
import { format } from "date-fns";

const ToDo = toDoSystem();
const project = toDoProject();
const pubSub = new EventBus();
const date = format(new Date(), "PP");

const newList = toDoList("default", 1);
const secondList = toDoList("not default", 1, date);
const thirdList = toDoList("an empty list", 1);

const newItem = toDoItem("test item", 2);
const secondItem = toDoItem('another test item', 2, date, 'test description', "Low", "test note");
const thirdItem = toDoItem('third todo item', 2, date, 'third description', "Mediun", "third notes" );
const fourthItem = toDoItem('fourth todo item', 3, date, 'fourth description', "High", "fourth notes" );

ToDo.addEntity(project);
ToDo.addEntity(newList);
ToDo.addEntity(secondList);
ToDo.addEntity(thirdList);
ToDo.addEntity(newItem);
ToDo.addEntity(secondItem);
ToDo.addEntity(thirdItem);
ToDo.addEntity(fourthItem);

ToDo.subscribe(pubSub, events.item_deleted, () => { console.log('the forever yeet') });

const listView = new View();
listView.renderAll(ToDo.exportData());

const hamBtns = document.querySelectorAll('.item-collapse-button');
for(const button of hamBtns) {

    button.addEventListener('click', (e) => {

        const parentLi = e.target.closest('li');
        parentLi.querySelector('.item-body').classList.toggle('hidden');

    });
    
}

const listDeleteBtns = document.querySelectorAll('.list-delete-button');
for(const button of listDeleteBtns) {

    button.addEventListener('click', (e) => {

        const listId = e.target.value;
        const parentDiv = e.target.closest('.list');
        project.removeItem(listId);
        parentDiv.remove();

    });

}

const itemDeleteBtns = document.querySelectorAll('.item-delete-button');
for(const button of itemDeleteBtns) {

    button.addEventListener('click', (e) => {

        const itemId = e.target.value;
        const parentId = e.target.dataset.parentId;
        const parentItem = e.target.closest('.item');
        parentItem.remove();

        pubSub.publish(events.item_deleted, { itemId, type: "items" });

    });

}
