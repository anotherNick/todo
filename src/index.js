import "./styles.css";
import { toDoItem, toDoList, toDoProject, toDoSystem } from "./model-factories.js";
import View from "./views.js";
import { events, EventBus } from "./controller.js";
import { format } from "date-fns";

const ToDo = toDoSystem();
const project = toDoProject('Default Project');
const secondProject = toDoProject('Another Project');
const pubSub = new EventBus();
const date = format(new Date(), "PP");

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

ToDo.subscribe(pubSub, events.item_deleted, (e) => { 

    ToDo.removeItem(e);

});



const toDoData = ToDo.exportAll();

const listView = new View({ pubSub, events });
listView.renderAll(toDoData);

ToDo.saveState();
ToDo.loadState();
