export default class View {

    constructor(eventHandler) {
        this.eventHandler = eventHandler;
        this.activeProject = null;
    }

    get eventBus() {
        return this.eventHandler.pubSub;
    }

    get eventList() {
        return this.eventHandler.events;
    }
    
    getDate(date) {

        return date ? date : "N/A";

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
                const itemEditBtn = document.createElement('button');
                    itemEditBtn.className = "item-header-button";
                    itemEditBtn.textContent = "\u270E";
                    itemEditBtn.addEventListener('click', (e) => {

                        this.updateFormFields('item');
                        Object.entries(item).forEach(property => {

                            const input = document.querySelector(`input[name="${property[0]}"]`);
                            if(input !== null) {
                                input.value = property[1];
                            }

                        });

                        const formModal = document.getElementById('form-modal');
                            formModal.showModal();

                    });
                const itemTitle = document.createElement('span');
                    itemTitle.className = "item-title";
                    itemTitle.textContent = item.title;
                const itemHamBtn = document.createElement('button');
                    itemHamBtn.className = "item-collapse-button";
                    itemHamBtn.textContent = "\u2261";
                    itemHamBtn.addEventListener('click', (e) => {
                        const parentLi = e.target.closest('li');
                        parentLi.querySelector('.item-body').classList.toggle('hidden');
                    });
            itemHeader.append(itemCheckbox);
            itemHeader.append(itemTitle);
            itemHeader.append(itemEditBtn);
            itemHeader.append(itemHamBtn);

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
                    itemDesc.textContent = item.desc;
                const itemNotes = document.createElement('div');
                    itemNotes.className = "item-notes";
                    itemNotes.textContent = "Notes: " + item.notes;
                const itemDeleteBtn = document.createElement('button');
                    itemDeleteBtn.value = item.id;
                    itemDeleteBtn.textContent = 'Delete Item';
                    itemDeleteBtn.className = 'delete-button';
                    itemDeleteBtn.dataset.parentId = item.parentId;
                    itemDeleteBtn.dataset.type = item.type;
                    itemDeleteBtn.addEventListener('click', (e) => {
                      
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
            itemBodyHeader.append(itemDue);
            itemBodyHeader.append(itemPriority);
            itemBody.append(itemBodyHeader);
            itemBody.append(itemDesc);
            itemBody.append(itemNotes);
            itemBody.append(itemDeleteBtn);

        itemLi.append(itemHeader);
        itemLi.append(itemBody);

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
                    const editListBtn = document.createElement('button');
                        editListBtn.className = "list-header-button";
                        editListBtn.textContent = "\u270E";
                        editListBtn.addEventListener('click', (e) => {

                            this.updateFormFields('list')
                            Object.entries(list).forEach(property => {

                                const input = document.querySelector(`input[name="${property[0]}"]`);
                                if(input !== null) {
                                    input.value = property[1];
                                }

                            });

                            const formModal = document.getElementById('form-modal');
                                formModal.showModal();

                        });
                    const listTitle = document.createElement('span');
                        listTitle.className = "list-title";
                        listTitle.textContent = list.title;
                listHeader.append(listCheckbox);
                listHeader.append(listTitle);
                listHeader.append(editListBtn);

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

            const listDeleteBtn = document.createElement('button');
                listDeleteBtn.value = list.id;
                listDeleteBtn.textContent = 'Delete List'
                listDeleteBtn.className = 'delete-button';
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
            const newItemBtn = document.createElement('button');
                newItemBtn.textContent = "+New Item";
                newItemBtn.className = "new-item";
                newItemBtn.addEventListener('click', (e) => {

                    this.updateFormFields('item', 'New');
                    const formModal = document.getElementById('form-modal');
                        formModal.showModal();
                    const type = document.getElementById('new-item-type');
                        type.value = "item";
                    const subtype = document.getElementById('new-item-subtype');
                        subtype.value = "subitem";
                    const parentId = document.getElementById('new-item-parent-id');
                        parentId.value = list.id;

                });

            listDiv.append(newItemBtn);
            listDiv.append(itemContainer);
            listDiv.append(listDeleteBtn);

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

                this.updateFormFields('list', 'New');
                const formModal = document.getElementById('form-modal');
                    formModal.showModal();
                const type = document.getElementById('new-item-type');
                    type.value = "list";
                const subtype = document.getElementById('new-item-subtype');
                    subtype.value = "item";
                const parentId = document.getElementById('new-item-parent-id');
                    parentId.value = project.id;

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

                this.updateFormFields('project', 'New');
                const formModal = document.getElementById('form-modal');
                    formModal.showModal();
                const type = document.getElementById('new-item-type');
                    type.value = "project";
                const subtype = document.getElementById('new-item-subtype');
                    subtype.value = "list";

            });
        projectTabs.append(newProjectBtn);
    }

    updateFormFields(type, action = "Update") {

        const newItemForm = document.getElementById('new-item-form');
              newItemForm.reset();
        
        const hiddenInputs = newItemForm.querySelectorAll('input[type="hidden"]');
              hiddenInputs.forEach(input => {
                input.value = '';
              });
        
        const formTitle = document.getElementById('form-title');
              formTitle.textContent =  `${action} ${type.charAt(0).toUpperCase()}${type.slice(1)}`;
    
        const itemFields = document.querySelectorAll('.item-fields');
              itemFields.forEach(fieldset => {

                fieldset.classList.add('hidden');
                fieldset.disabled = true;

              });

        const fieldType = `.${type}-fields`;
        const validFields = document.querySelectorAll(fieldType);
              validFields.forEach(fieldset => {

                fieldset.classList.remove('hidden');
                fieldset.disabled = false;

              });

    }
}