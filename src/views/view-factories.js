import { deleter, completer, projectSwitcher, elementManager, buttonMaker, dateFormatter } from "./view-behaviors.js";
import { format } from "date-fns";

export const Views = () => {

    let state = {};

    let self = {

        renderAll: (data) => {

            const toDoData = JSON.parse(data);

            const projectContainer = document.querySelector('#container');
                  projectContainer.textContent = "";
            
            const projectTabs = document.querySelector('#projects');
                  projectTabs.textContent = "";

            toDoData.forEach(project => {
                
                self.projectView.render(project);

            });

            const newProjectBtn = self.newItemButton('project', 'list');

            projectTabs.append(newProjectBtn);
            
        },

    };
    
    return Object.assign(self, deleter(self), completer(), projectSwitcher(), elementManager(self), buttonMaker(), 
                { 'projectView': projectView(self), 'listView': listView(self), 'itemView': itemView(self), 'subitemView': itemView(self) });

}

const projectView = (views) => {

    let state = {
        views: views,
        activeProject: null,
    };

    let self = {

        render: (project) => {

            const projectContainer = document.querySelector('#container');

            const listContainer = document.createElement('div');
                  listContainer.id = `project-${project.id}-container`;
                  listContainer.classList.add('list-container', 'hidden');
                  listContainer.dataset.projectId = project.id;

                const projectHeaderBtns = document.createElement('div');
                      projectHeaderBtns.classList.add('project-header-buttons');
            
                    const deleteProjectBtn = self.newDeleteButton({ id: project.id, type: project.type, subtype: project.subtype }, true);
                          deleteProjectBtn.textContent = "Delete this Project";
            
                const newListBtn = self.newItemButton('list', 'item', project.id);
            
            projectHeaderBtns.append(deleteProjectBtn);
            projectHeaderBtns.append(newListBtn);
            listContainer.append(projectHeaderBtns);
            
            if(project.subItems !== undefined) {
                project.subItems.forEach(list => {

                    const listDiv = state.views.listView.render(list);
                    listContainer.append(listDiv);

                });
            }

            projectContainer.append(listContainer);
            
            const projectTabs = document.querySelector('#projects');

                const projectBtn = document.createElement('button');
                      projectBtn.textContent = project.title;
                      projectBtn.dataset.projectId = project.id;
                      projectBtn.id = `project-${project.id}-button`;
                      projectBtn.classList.add('project-buttons');

            projectTabs.append(projectBtn);

            state.activeProject ??= project.id;

            if(state.activeProject == project.id){
                state.views.updateActiveProject(project.id);
            }

        },

    };

    return Object.assign(self, buttonMaker())

}



const listView = (views) => {

    let state = {
        views: views,
        dateFormatter: format,
    };

    let self = {

        render: (list) => {

            const listDiv = document.createElement('div');
                  listDiv.dataset.listId = list.id;
                  listDiv.classList.add(list.type, `priority-${list.priority.toLowerCase()}`);

                const listHeader = document.createElement('div');
                      listHeader.className = 'list-header';

                    const listCheckbox = self.newCheckbox(list);

                    const listDeleteBtn = self.newDeleteButton(list);
                          listDeleteBtn.classList.add('list-header-button');

                    const editListBtn = self.newEditButton(list);

                    const listTitle = document.createElement('span');
                          listTitle.className = "list-title";
                          listTitle.textContent = list.title;

                listHeader.append(listCheckbox);
                listHeader.append(listTitle);
                listHeader.append(editListBtn);
                listHeader.append(listDeleteBtn);

                const listBody = document.createElement('div')
                    listBody.className = "list-body";

                    const listBodyHeading = document.createElement('div');
                        listBodyHeading.className = "list-body-heading";

                        const listDue = document.createElement('div');
                              listDue.className = "list-due-date";
                              listDue.textContent = self.getDate(list.due);

                        const listPriority = document.createElement('div');
                              listPriority.className = "list-priority";
                              listPriority.textContent = "Priority: " + list.priority;

                    const listDesc = document.createElement('div');
                          listDesc.className = "list-description";
                          listDesc.textContent = list.desc;

                listBodyHeading.append(listPriority);
                listBodyHeading.append(listDue);
                listBody.append(listBodyHeading);
                listBody.append(listDesc);

            listDiv.append(listHeader);
            listDiv.append(listBody);

            const itemContainer = document.createElement('ul');
                  itemContainer.className = "item-list";
                  itemContainer.id = `list-${list.id}-container`;

            if(list.subItems !== undefined) {

                list.subItems.forEach(item => {

                    const itemLi = state.views.itemView.render(item);
                    itemContainer.append(itemLi);

                });
            }

            const newItemBtn = self.newItemButton('item', 'subitem', list.id);

            listDiv.append(newItemBtn);
            listDiv.append(itemContainer);

            return listDiv;
        },

    };

    return Object.assign(self, buttonMaker(), dateFormatter(state))

}




const itemView = (views) => {

    let state = {
        views: views,
        dateFormatter: format,
    };

    let self = {

        render: (item) => {

            const type = item.type;

            const itemLi = document.createElement('li');
                  itemLi.dataset[`${type}Id`] = item.id;
                  itemLi.classList.add(type, `priority-${item.priority.toLowerCase()}`);

                const itemHeader = document.createElement('div');
                      itemHeader.className = `${type}-header`;

                    const itemCheckbox = self.newCheckbox(item);
                    const itemDeleteBtn = self.newDeleteButton(item, false);
                    const itemEditBtn = self.newEditButton(item);

                    const itemTitle = document.createElement('span');
                          itemTitle.classList.add(`${type}-title`, `${type}-collapse-button`);
                          itemTitle.textContent = item.title;
                          itemTitle.addEventListener('click', (e) => {
                            const parentLi = e.target.closest('li');
                                  parentLi.querySelector(`.${type}-body`).classList.toggle('hidden');
                        });

                itemHeader.append(itemCheckbox);
                itemHeader.append(itemTitle);
                itemHeader.append(itemEditBtn);
                itemHeader.append(itemDeleteBtn);

                const itemBody = document.createElement('div')
                      itemBody.classList.add(`${type}-body`, "hidden");

                    const itemBodyHeader = document.createElement('div');
                          itemBodyHeader.className = `${type}-body-heading`;

                        const itemDue = document.createElement('div');
                              itemDue.className = `${type}-due-date`;
                              itemDue.textContent = self.getDate(item.due);

                        const itemPriority = document.createElement('div');
                              itemPriority.className = `${type}-priority`;
                              itemPriority.textContent = "Priority: " + item.priority;

                    const itemDesc = document.createElement('div');
                          itemDesc.className = `${type}-description`;

                        if(item.desc !== "" && item.desc !== null) {
                            itemDesc.textContent = "Description:\n" + item.desc;
                        }

                    const itemNotes = document.createElement('div');
                          itemNotes.className = `${type}-notes`;

                        if(item.notes !== "" && item.notes !== null) {
                            itemNotes.textContent = "Notes:\n" + item.notes;
                        }

                itemBodyHeader.append(itemPriority);
                itemBodyHeader.append(itemDue);
                
                itemBody.append(itemBodyHeader);
                itemBody.append(itemDesc);
                itemBody.append(itemNotes);
                
            itemLi.append(itemHeader);
            itemLi.append(itemBody);

            if(type === "item"){
                
                const newSubitemBtn = self.newItemButton('subitem', null, item.id);

                itemBody.append(newSubitemBtn);

                const itemContainer = document.createElement('ul');
                      itemContainer.className = "subitem-list";
                      itemContainer.id = `${type}-${item.id}-container`;

                if(item.subItems !== undefined) {

                    item.subItems.forEach(subitem => {

                        const subitemLi = state.views.itemView.render(subitem);
                    
                        itemContainer.append(subitemLi);

                    });
                }
                
                itemLi.append(itemContainer);

            }

            return itemLi;
        },

    };

    return Object.assign(self, buttonMaker(), dateFormatter(state))

}