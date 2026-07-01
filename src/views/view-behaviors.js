export const deleter = (self) => ({

    getUserConfirmation: () => {

        const userConfirmed = confirm("Are you sure? Deletion cannot be undone.");

        return userConfirmed;

    },

    deleteItem: (e) => {

        const item = JSON.parse(e.target.dataset.item);
        const doConfirm = JSON.parse(e.target.dataset.doConfirm);

        if(doConfirm) {

            const userConfirmed = self.getUserConfirmation();
            
            if(!userConfirmed){ return false; }

        }

        const id = item.id;
        const parentId = item.parentId;
        const type = item.type;
        const parentDiv = e.target.closest('.' + type);
        
        if(parentDiv) {
            parentDiv.remove();
        }

        return { id: item.id, type: item.type, parentId: item.parentId };
        

    },

    deleteProject: (e) => {

        const item = JSON.parse(e.target.dataset.item);
        const doConfirm = JSON.parse(e.target.dataset.doConfirm);

        if(doConfirm) {

            const userConfirmed = self.getUserConfirmation();
            
            if(!userConfirmed){ return false; }

        }

        const parentDiv = e.target.closest('.list-container');
        
        if(parentDiv) {
            parentDiv.remove();
        }

        const projectBtn = document.querySelector(`#project-${item.id}-button`);

        if(projectBtn) {
            projectBtn.remove();
        }

        const nextProjectBtn = document.querySelector('.project-buttons');

        if(nextProjectBtn) {
            self.updateActiveProject(nextProjectBtn.dataset.projectId);
        }

        return { id: item.id, type: item.type, parentId: item.parentId };

    },

});



export const completer = () => ({

    toggleComplete: (checkbox) => {

        const item = JSON.parse(checkbox.dataset.item);
        const checkedItem = checkbox.closest(`.${item.type}`);

        if(checkbox.checked) {
            checkedItem.style.order = 10;
            checkedItem.style.filter = "brightness(0.5)";
            return { id: item.id, type: item.type, completed: true };
        }else{
            checkedItem.style.order = "";
            checkedItem.style.filter = "brightness(1)";
            return { id: item.id, type: item.type, completed: false};
        }

    },

    styleCompletedItems: () => {

        const types = ['subitem', 'item', 'list'];

        types.forEach(type => {

            const checkedItems = document.querySelectorAll(`.${type}-complete`);
                  checkedItems.forEach(checkbox => {

                    const checkedItem = checkbox.closest(`.${type}`);
                    
                    if(checkbox.checked) {
                        checkedItem.style.order = 10;
                        checkedItem.style.filter = "brightness(0.5)";
                    }else{
                        checkedItem.style.order = "";
                        checkedItem.style.filter = "brightness(1)";
                    }

                });

        });

    },


});



export const projectSwitcher = () => ({

    updateActiveProject: (id) => {

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

    },


});

export const elementManager = (self) => ({

    addElement: (item, parent) => {

        const viewType = item.type + "View";
        const newElement = self[viewType].render(item);
        const selector = `#${parent.type}-${parent.id}-container`; 
        const container = document.querySelector(selector); 
              container.append(newElement);

    },

    updateElement: (item) => {

        const viewType = item.type + "View";
        const newElement = self[viewType].render(item);
        const selector = `[data-${item.type}-id="${item.id}"]`;
        const oldElement = document.querySelector(selector);

        oldElement.replaceWith(newElement);

    },


});

export const buttonMaker = () => ({

    newDeleteButton: (item, doConfirm = true) => {

        const itemDeleteBtn = document.createElement('button');
              itemDeleteBtn.textContent = 'X';
              itemDeleteBtn.classList.add(`${item.type}-delete-button`, 'delete-button');
              itemDeleteBtn.dataset.item = JSON.stringify(item);
              itemDeleteBtn.dataset.doConfirm = doConfirm;

        return itemDeleteBtn;

    },

    newItemButton: (type, subtype, parentId = null) => {

        const newItemBtn = document.createElement('button');
              newItemBtn.textContent = `+New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
              newItemBtn.classList.add(`new-${type}`, 'new-button');
              newItemBtn.dataset.details = JSON.stringify({ type, subtype, parentId });

        return newItemBtn;

    },

    newEditButton: (item) => {

        const itemEditBtn = document.createElement('button');
                itemEditBtn.classList.add(`${item.type}-header-button`, 'edit-button');
                itemEditBtn.textContent = "\u270E";
                itemEditBtn.dataset.item = JSON.stringify(item);

        return itemEditBtn;

    },

    newCheckbox: (item) => {

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add(`${item.type}-complete`, 'complete-checkbox');
            checkbox.checked = item.complete;
            checkbox.dataset.item = JSON.stringify(item);

            return checkbox;


    },

});



export const dateFormatter = (state) => ({

    getDate: (date) => {

        if(date) {
            return date = state.dateFormatter(new Date(), "PP");
        }

    },


});