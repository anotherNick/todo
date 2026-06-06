import "./styles.css";
import { toDoItem, toDoList, container } from "./model-factories.js"
import View from "./views.js";


const newList = toDoList("default", container.id);
const secondList = toDoList("not default", container.id);
const thirdList = toDoList("an empty list", container.id);
const newItem = toDoItem("test item", newList.id);
const secondItem = toDoItem('another test item', newList.id, null, 'test description', "Low", "test note");
const thirdItem = toDoItem('third todo item', newList.id, null, 'third description', "Mediun", "third notes" )
const fourthItem = toDoItem('fourth todo item', newList.id, null, 'fourth description', "High", "fourth notes" )

container.addItem(newList);
container.addItem(secondList);
container.addItem(thirdList);

newList.addItem(newItem);
newList.addItem(secondItem);
newList.addItem(thirdItem);
newList.addItem(fourthItem);
secondList.addItem(newItem);
secondList.addItem(secondItem);
secondList.addItem(thirdItem);
secondList.addItem(fourthItem);

const listView = new View();
listView.renderLists(JSON.stringify(container));

const hamBtns = document.querySelectorAll('.item-collapse-button');
for(const button of hamBtns) {

    button.addEventListener('click', (e) => {

        const parentLi = e.target.closest('li');

    });
    
}