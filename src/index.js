import "./styles.css";
import { toDoItem, toDoList, toDoProject } from "./model-factories.js";
import View from "./views.js";
import { events, EventBus } from "./controller.js";
import { format } from "date-fns";

const project = toDoProject();
const pubSub = new EventBus();
const date = format(new Date(), "PP");

const newList = toDoList("default", container.id);
      newList.subscribe(pubSub, events.item_deleted, (e) => { 
        newList.removeItem(e); 
    });
const secondList = toDoList("not default", container.id, date);
const thirdList = toDoList("an empty list", container.id);

const newItem = toDoItem("test item", newList.id);
const secondItem = toDoItem('another test item', newList.id, date, 'test description', "Low", "test note");
const thirdItem = toDoItem('third todo item', newList.id, date, 'third description', "Mediun", "third notes" )
const fourthItem = toDoItem('fourth todo item', newList.id, date, 'fourth description', "High", "fourth notes" )

project.addItem(newList);
project.addItem(secondList);
project.addItem(thirdList);

newList.addItem(newItem);
newList.addItem(secondItem);
newList.addItem(thirdItem);
newList.addItem(fourthItem);
secondList.addItem(newItem);
secondList.addItem(secondItem);
secondList.addItem(thirdItem);
secondList.addItem(fourthItem);

const listView = new View();
listView.renderLists(JSON.stringify(project));

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

        pubSub.publish(events.item_deleted, { itemId, parentId});

    });

}

console.log(project)