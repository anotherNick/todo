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

    toggleComplete(checkbox, item) {

        const checkedItem = checkbox.closest(`.${item.type}`);

        if(checkbox.checked) {
            checkedItem.style.order = 1;
            checkedItem.style.filter = "brightness(0.5)";
            this.eventBus.publish(this.eventList.item_completed, { id: item.id, type: item.type });
        }else{
            checkedItem.style.order = 0;
            checkedItem.style.filter = "brightness(1)";
            this.eventBus.publish(this.eventList.item_incompleted, { id: item.id, type: item.type });
        }

    }

    deleteItem(item, e) {

        const id = item.id;
        const parentId = item.parentId;
        const type = item.type;
        const parentDiv = e.target.closest('.' + type);
        
        if(parentDiv) {
            parentDiv.remove();
        }

        this.eventBus.publish(this.eventList.item_delete_request, { id, type, parentId });

    }

    newCheckbox(item) {

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = `${item.type}-complete`;
            checkbox.checked = item.complete;
            checkbox.addEventListener('change', (e) => {

                this.toggleComplete(checkbox, item);
        
            });

            return checkbox;


    }

    newDeleteButton(item, doConfirm = true) {

        const itemDeleteBtn = document.createElement('button');
              itemDeleteBtn.textContent = 'X';
              itemDeleteBtn.className = `${item.type}-delete-button`;
              itemDeleteBtn.addEventListener('click', (e) => {
        
                if(doConfirm) {

                    const userConfirmed = confirm("Are you sure? Deletion cannot be undone.");

                    if (userConfirmed) {

                        this.deleteItem(item, e);
                    
                    }

                } else {

                    this.deleteItem(item, e);

                }

              });

        return itemDeleteBtn;

    }

    newEditButton(item) {

        const itemEditBtn = document.createElement('button');
                itemEditBtn.className = `${item.type}-header-button`;
                itemEditBtn.textContent = "\u270E";
                itemEditBtn.addEventListener('click', (e) => {

                    this.submitForm.updateInputValues(item);
                    this.submitForm.showModal();
                
            });

        return itemEditBtn;

    }

    newItemButton(type, subtype, parentId = null){

        const newItemBtn = document.createElement('button');
              newItemBtn.textContent = `+New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
              newItemBtn.className = `new-${type}`;
              newItemBtn.addEventListener('click', (e) => {

                this.submitForm.updateInputValues({ type, subtype, parentId }, 'New');
                this.submitForm.showModal();

            });

        return newItemBtn;

    }

    subitemView(item) {

        return this.itemView(item);

    }

    itemView(item) {

        const type = item.type;

        const itemLi = document.createElement('li');
              itemLi.dataset.itemId = item.id;
              itemLi.classList.add(type, `priority-${item.priority.toLowerCase()}`);

            const itemHeader = document.createElement('div');
                  itemHeader.className = "item-header";

                const itemCheckbox = this.newCheckbox(item);
                const itemDeleteBtn = this.newDeleteButton(item, false);
                const itemEditBtn = this.newEditButton(item);

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
                          itemDue.textContent = this.getDate(item.due);

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
            
            const newSubitemBtn = this.newItemButton('subitem', null, item.id);

            itemBody.append(newSubitemBtn);

            const itemContainer = document.createElement('ul');
                  itemContainer.className = "subitem-list";
                  itemContainer.id = `${type}-${item.id}-container`;

            if(item.subItems !== undefined) {

                item.subItems.forEach(subitem => {

                    const subitemLi = this.itemView(subitem);
                
                    itemContainer.append(subitemLi);

                });
            }
            
            itemLi.append(itemContainer);

        }

        return itemLi;
    }

    listView(list) {

            const listDiv = document.createElement('div');
                  listDiv.dataset.listId = list.id;
                  listDiv.classList.add(list.type, `priority-${list.priority.toLowerCase()}`);

                const listHeader = document.createElement('div');
                      listHeader.className = 'list-header';

                    const listCheckbox = this.newCheckbox(list);

                    const listDeleteBtn = this.newDeleteButton(list);
                          listDeleteBtn.classList.add('list-header-button');

                    const editListBtn = this.newEditButton(list);

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

            const newItemBtn = this.newItemButton('item', 'subitem', list.id);

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
                      deleteProjectBtn.classList.add('delete-button');
                      deleteProjectBtn.addEventListener('click', (e) => {
                
                        const userConfirmed = confirm("Are you sure? Deletion cannot be undone.");
                            
                        if (userConfirmed) {

                            const id = project.id;
                            const parentId = project.parentId;
                            const type = project.type;
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
        
        
            const newListBtn = this.newItemButton('list', 'item', project.id);
        
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
        
        const projectTabs = document.querySelector('#projects');

            const projectBtn = document.createElement('button');
                  projectBtn.textContent = project.title;
                  projectBtn.dataset.projectId = project.id;
                  projectBtn.id = `project-${project.id}-button`;
                  projectBtn.classList.add('project-buttons');
                  projectBtn.addEventListener('click', (e) =>{
                    this.updateActiveProject(project.id);
                  });

        projectTabs.append(projectBtn);

        this.activeProject ??= project.id;

        if(this.activeProject == project.id){
            this.updateActiveProject(project.id);
        }

    }

    renderAll(data) {

        const toDoData = JSON.parse(data);

        const projectContainer = document.querySelector('#container');
              projectContainer.textContent = "";
        
        const projectTabs = document.querySelector('#projects');
              projectTabs.textContent = "";

        toDoData.forEach(project => {
            
            this.projectView(project);

        });

        const newProjectBtn = this.newItemButton('project', 'list');

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