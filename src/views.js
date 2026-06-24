export class View {

    constructor(eventHandler, dateFormatter, submitForm) {
        this.eventHandler = eventHandler;
        this.activeProject = null;
        this.dateFormatter = dateFormatter;
        this.submitForm = submitForm;
    }

    get eventBus() {
        return this.eventHandler.pubSub;
    }

    get eventList() {
        return this.eventHandler.events;
    }
    
    getDate(date) {

        if(date) {
            return date = this.dateFormatter(new Date(), "PP");
        }

    }

    subitemView(item) {

        const itemLi = document.createElement('li');
              itemLi.dataset.subitemId = item.id;
              itemLi.classList.add(item.type, `priority-${item.priority.toLowerCase()}`);

            const itemHeader = document.createElement('div');
                  itemHeader.className = "subitem-header";
                const itemCheckbox = document.createElement('input');
                      itemCheckbox.type = 'checkbox';
                      itemCheckbox.className = "subitem-complete";
                      itemCheckbox.checked = item.complete;
                      itemCheckbox.addEventListener('change', (e) => {

                        const checkedItem = itemCheckbox.closest(`.${item.type}`);

                        if(itemCheckbox.checked) {
                            checkedItem.style.order = 1;
                            checkedItem.style.filter = "brightness(0.5)";
                            this.eventBus.publish(this.eventList.item_completed, { id: item.id, type: item.type });
                        }else{
                            checkedItem.style.order = 0;
                            checkedItem.style.filter = "brightness(1)";
                            this.eventBus.publish(this.eventList.item_incompleted, { id: item.id, type: item.type });
                        }

                    });
                const itemDeleteBtn = document.createElement('button');
                      itemDeleteBtn.value = item.id;
                      itemDeleteBtn.textContent = 'X';
                      itemDeleteBtn.className = 'subitem-delete-button';
                      itemDeleteBtn.dataset.parentId = item.parentId;
                      itemDeleteBtn.dataset.type = item.type;
                      itemDeleteBtn.addEventListener('click', (e) => {
                      
                        const id = e.target.value;
                        const parentId = e.target.dataset.parentId;
                        const type = e.target.dataset.type;
                        const parentDiv = e.target.closest('.' + type);
                        
                        if(parentDiv) {
                            parentDiv.remove();
                        }

                        this.eventBus.publish(this.eventList.item_delete_request, { id, type, parentId });
                      
                    });
                const itemEditBtn = document.createElement('button');
                      itemEditBtn.className = "subitem-header-button";
                      itemEditBtn.textContent = "\u270E";
                      itemEditBtn.addEventListener('click', (e) => {

                        this.submitForm.updateInputValues(item);
                        this.submitForm.showModal();
                        
                    });
                const itemTitle = document.createElement('span');
                      itemTitle.classList.add("subitem-title", "item-collapse-button");
                      itemTitle.textContent = item.title;
                      itemTitle.addEventListener('click', (e) => {
                        const parentLi = e.target.closest('li');
                        parentLi.querySelector('.subitem-body').classList.toggle('hidden');
                    });
            itemHeader.append(itemCheckbox);
            itemHeader.append(itemTitle);
            itemHeader.append(itemEditBtn);
            itemHeader.append(itemDeleteBtn);

            const itemBody = document.createElement('div')
                  itemBody.classList.add("subitem-body", "hidden");
                const itemBodyHeader = document.createElement('div');
                    itemBodyHeader.className = "subitem-body-heading";
                    const itemDue = document.createElement('div');
                          itemDue.className = "subitem-due-date";
                          itemDue.textContent = this.getDate(item.due);
                    const itemPriority = document.createElement('div');
                          itemPriority.className = "list-priority";
                          itemPriority.textContent = "Priority: " + item.priority;
                const itemDesc = document.createElement('div');
                      itemDesc.className = "subitem-description";
                    if(item.desc !== "" && item.desc !== null) {
                        itemDesc.textContent = "Description:\n" + item.desc;
                    }
                const itemNotes = document.createElement('div');
                    itemNotes.className = "subitem-notes";
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

        return itemLi;
    }

    itemView(item) {

        const itemLi = document.createElement('li');
              itemLi.dataset.itemId = item.id;
              itemLi.classList.add(item.type, `priority-${item.priority.toLowerCase()}`);

            const itemHeader = document.createElement('div');
                  itemHeader.className = "item-header";
                const itemCheckbox = document.createElement('input');
                      itemCheckbox.type = 'checkbox';
                      itemCheckbox.className = "item-complete";
                      itemCheckbox.checked = item.complete;
                      itemCheckbox.addEventListener('change', (e) => {

                        const checkedItem = itemCheckbox.closest(`.${item.type}`);

                        if(itemCheckbox.checked) {
                            checkedItem.style.order = 1;
                            checkedItem.style.filter = "brightness(0.5)";
                            this.eventBus.publish(this.eventList.item_completed, { id: item.id, type: item.type });
                        }else{
                            checkedItem.style.order = 0;
                            checkedItem.style.filter = "brightness(1)";
                            this.eventBus.publish(this.eventList.item_incompleted, { id: item.id, type: item.type });
                        }

                    });
                const itemDeleteBtn = document.createElement('button');
                      itemDeleteBtn.value = item.id;
                      itemDeleteBtn.textContent = 'X';
                      itemDeleteBtn.className = 'delete-button';
                      itemDeleteBtn.dataset.parentId = item.parentId;
                      itemDeleteBtn.dataset.type = item.type;
                      itemDeleteBtn.addEventListener('click', (e) => {
                      
                        const id = e.target.value;
                        const parentId = e.target.dataset.parentId;
                        const type = e.target.dataset.type;
                        const parentDiv = e.target.closest('.' + type);
                        
                        if(parentDiv) {
                            parentDiv.remove();
                        }

                        this.eventBus.publish(this.eventList.item_delete_request, { id, type, parentId });
                      
                    });
                const itemEditBtn = document.createElement('button');
                      itemEditBtn.className = "item-header-button";
                      itemEditBtn.textContent = "\u270E";
                      itemEditBtn.addEventListener('click', (e) => {

                        this.submitForm.updateInputValues(item);
                        this.submitForm.showModal();
                    
                    });
                const itemTitle = document.createElement('span');
                      itemTitle.classList.add("item-title", "item-collapse-button");
                      itemTitle.textContent = item.title;
                      itemTitle.addEventListener('click', (e) => {
                        const parentLi = e.target.closest('li');
                        parentLi.querySelector('.item-body').classList.toggle('hidden');
                    });
            itemHeader.append(itemCheckbox);
            itemHeader.append(itemTitle);
            itemHeader.append(itemEditBtn);
            itemHeader.append(itemDeleteBtn);

            const itemBody = document.createElement('div')
                  itemBody.classList.add("item-body", "hidden");
                const itemBodyHeader = document.createElement('div');
                    itemBodyHeader.className = "item-body-heading";
                    const itemDue = document.createElement('div');
                          itemDue.className = "item-due-date";
                          itemDue.textContent = this.getDate(item.due);
                    const itemPriority = document.createElement('div');
                          itemPriority.className = "list-priority";
                          itemPriority.textContent = "Priority: " + item.priority;
                const itemDesc = document.createElement('div');
                      itemDesc.className = "item-description";
                    if(item.desc !== "" && item.desc !== null) {
                        itemDesc.textContent = "Description:\n" + item.desc;
                    }
                const itemNotes = document.createElement('div');
                    itemNotes.className = "item-notes";
                    if(item.notes !== "" && item.notes !== null) {
                        itemNotes.textContent = "Notes:\n" + item.notes;
                    }
                const newSubitemBtn = document.createElement('button');
                    newSubitemBtn.textContent = "+New Subitem";
                    newSubitemBtn.className = "new-subitem";
                    newSubitemBtn.addEventListener('click', (e) => {

                        this.submitForm.updateInputValues({ type: 'item', subtype: null, parentId: item.id, }, 'New');
                        this.submitForm.showModal();
                    
                });
            itemBodyHeader.append(itemPriority);
            itemBodyHeader.append(itemDue);
            itemBody.append(itemBodyHeader);
            itemBody.append(itemDesc);
            itemBody.append(itemNotes);
            itemBody.append(newSubitemBtn);

            const itemContainer = document.createElement('ul');
                itemContainer.className = "subitem-list";
                itemContainer.id = `item-${item.id}-container`;

            if(item.subItems !== undefined) {

                item.subItems.forEach(item => {

                    const itemLi = this.subitemView(item);
                    itemContainer.append(itemLi);

                });
            }

        itemLi.append(itemHeader);
        itemLi.append(itemBody);
        itemLi.append(itemContainer);

        return itemLi;
    }

    listView(list) {

            const listDiv = document.createElement('div');
                  listDiv.dataset.listId = list.id;
                  listDiv.classList.add(list.type, `priority-${list.priority.toLowerCase()}`);

                const listHeader = document.createElement('div');
                      listHeader.className = 'list-header';
                    const listCheckbox = document.createElement('input');
                          listCheckbox.type = 'checkbox';
                          listCheckbox.className = "list-complete";
                          listCheckbox.checked = list.complete;
                          listCheckbox.addEventListener('change', (e) => {

                            const checkedItem = listCheckbox.closest('.list');

                            if(listCheckbox.checked) {
                                checkedItem.style.order = 1;
                                checkedItem.style.filter = "brightness(0.5)";
                                this.eventBus.publish(this.eventList.item_completed, { id: list.id, type: list.type });
                            }else{
                                checkedItem.style.order = 0;
                                checkedItem.style.filter = "brightness(1)";
                                this.eventBus.publish(this.eventList.item_incompleted, { id: list.id, type: list.type });
                            }

                        });

                    const listDeleteBtn = document.createElement('button');
                          listDeleteBtn.value = list.id;
                          listDeleteBtn.textContent = 'X';
                          listDeleteBtn.classList.add('delete-button', 'list-header-button');
                          listDeleteBtn.dataset.parentId = list.parentId;
                          listDeleteBtn.dataset.type = list.type;
                          listDeleteBtn.addEventListener('click', (e) => {
                           const userConfirmed = confirm("Are you sure? Deletion cannot be undone.");
                              if (userConfirmed) {
                                  const id = e.target.value;
                                  const parentId = e.target.dataset.parentId;
                                   const type = e.target.dataset.type;
                                  const parentDiv = e.target.closest('.' + type);
                             

                                      if(parentDiv) {
                                          parentDiv.remove();
                                      }
  
                                    this.eventBus.publish(this.eventList.item_delete_request, { id, type, parentId });
                          
                                }
                          });


                    const editListBtn = document.createElement('button');
                          editListBtn.className = "list-header-button";
                          editListBtn.textContent = "\u270E";
                          editListBtn.addEventListener('click', (e) => {

                            this.submitForm.updateInputValues(list);
                            this.submitForm.showModal();

                        });
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
                            listDue.textContent = this.getDate(list.due);
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

                    const itemLi = this.itemView(item);
                    itemContainer.append(itemLi);

                });
            }

            const newItemBtn = document.createElement('button');
                  newItemBtn.textContent = "+New Item";
                  newItemBtn.className = "new-item";
                  newItemBtn.addEventListener('click', (e) => {

                    this.submitForm.updateInputValues({ type: 'item', subtype: 'subitem', parentId: list.id, }, 'New');
                    this.submitForm.showModal();

                });

            listDiv.append(newItemBtn);
            listDiv.append(itemContainer);

            return listDiv;
    }

    projectView(project) {

        const projectContainer = document.querySelector('#container');

        const listContainer = document.createElement('div');
            listContainer.id = `project-${project.id}-container`;
            listContainer.classList.add('list-container', 'hidden');
            listContainer.dataset.projectId = project.id;

            const projectHeaderBtns = document.createElement('div');
                projectHeaderBtns.classList.add('project-header-buttons');
        
                const deleteProjectBtn = document.createElement('button');
                deleteProjectBtn.id = "delete-project";
                deleteProjectBtn.textContent = "Delete This Project";
                deleteProjectBtn.value = project.id;
                deleteProjectBtn.classList.add('delete-button');
                deleteProjectBtn.dataset.parentId = project.parentId;
                deleteProjectBtn.dataset.type = project.type;
                deleteProjectBtn.addEventListener('click', (e) => {
                const userConfirmed = confirm("Are you sure? Deletion cannot be undone.");
                    
                  if (userConfirmed) {

                    const id = e.target.value;
                    const parentId = e.target.dataset.parentId;
                    const type = e.target.dataset.type;
                    const parentDiv = e.target.closest('.list-container');
                    
                    if(parentDiv) {
                        parentDiv.remove();
                    }

                    const projectBtn = document.querySelector(`#project-${id}-button`);

                    if(projectBtn) {
                        projectBtn.remove();
                    }

                    const nextProjectBtn = document.querySelector('.project-buttons');

                    if(nextProjectBtn) {
                        this.updateActiveProject(nextProjectBtn.dataset.projectId);
                    }

                    this.eventBus.publish(this.eventList.item_delete_request, { id, type, parentId });
                
                  }
                });
        
        
            const newListBtn = document.createElement('button');
            newListBtn.id = "new-list";
            newListBtn.textContent = "+New List";
            newListBtn.addEventListener('click', (e) => {

                this.submitForm.updateInputValues({ type: 'list', subtype: 'item', parentId: project.id, }, 'New');
                this.submitForm.showModal();

            });
        
        projectHeaderBtns.append(deleteProjectBtn);
        projectHeaderBtns.append(newListBtn);
        listContainer.append(projectHeaderBtns);
        
        if(project.subItems !== undefined) {
            project.subItems.forEach(list => {

                const listDiv = this.listView(list);
                listContainer.append(listDiv);

            });
        }

        projectContainer.append(listContainer);
    }

    updateActiveProject(id) {
        const buttons = document.querySelectorAll('.project-buttons');
        buttons.forEach(button => {

            const buttonId = button.dataset.projectId;

            if(buttonId == id){
                button.classList.add('active-project');
            }else{
                button.classList.remove('active-project');
            }

        });

        const projects = document.querySelectorAll('.list-container');
        projects.forEach(project => {

            const projectId = project.dataset.projectId;

            if(projectId == id){
                project.classList.remove('hidden');
            }else{
                project.classList.add('hidden');
            }

        });

    }

    renderAll(data) {
   
        const toDoData = JSON.parse(data);
        const projectTabs = document.querySelector('#projects');
            projectTabs.textContent = "";
        const projectContainer = document.querySelector('#container');
            projectContainer.textContent = "";

        toDoData.forEach(project => {
            const projectBtn = document.createElement('button');
                projectBtn.textContent = project.title;
                projectBtn.id = `project-${project.id}-button`;
                projectBtn.dataset.projectId = project.id;
                projectBtn.classList.add('project-buttons');
                projectBtn.addEventListener('click', (e) =>{
                    this.updateActiveProject(e.target.dataset.projectId);
                })
            projectTabs.append(projectBtn);

            this.projectView(project);

            this.activeProject ??= project.id;
            if(this.activeProject == project.id){
                this.updateActiveProject(project.id);
            }
        });
        
        const newProjectBtn = document.createElement('button');
            newProjectBtn.textContent = "+New Project";
            newProjectBtn.id = "new-project";
            newProjectBtn.addEventListener('click', (e) => {

                this.submitForm.updateInputValues({ type: 'project', subtype: 'list' }, 'New');
                this.submitForm.showModal();

            });
        projectTabs.append(newProjectBtn);
    }
}

export class SubmitForm {

    constructor(form, modal) {

        this.form = form;
        this.modal = modal;

    }

    showValidFields(item, action) {

              this.form.reset();
        
        const hiddenInputs = this.form.querySelectorAll('input[type="hidden"]');
              hiddenInputs.forEach(input => {
                input.value = '';
              });
        
        const formTitle = document.getElementById('form-title');
              formTitle.textContent =  `${action} ${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}`;
    
        const itemFields = document.querySelectorAll('.item-fields');
              itemFields.forEach(fieldset => {

                fieldset.classList.add('hidden');
                fieldset.disabled = true;

              });

        const fieldType = `.${item.type}-fields`;
        const validFields = document.querySelectorAll(fieldType);
              validFields.forEach(fieldset => {

                fieldset.classList.remove('hidden');
                fieldset.disabled = false;

              });

    }

    updateInputValues(item, action = "Update") {

        this.showValidFields(item, action);
        Object.entries(item).forEach(property => {
// Need to set radio button correctly instead of ignoring it.
            const input = document.querySelector(`[name="${property[0]}"]`);
            if(input !== null && property[0] !== "priority") {
                input.value = property[1];
            }

        });

    }

    showModal() {

        this.modal.showModal();

    }

    closeModal() {

        this.modal.close();

    }

}