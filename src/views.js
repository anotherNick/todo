export default class View {

    constructor(eventHandler) {
        this.eventHandler = eventHandler;
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
            itemHeader.append(itemTitle);
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
                        const id = e.target.value;
                        const parentId = e.target.dataset.parentId;
                        const type = e.target.dataset.type;
                        const parentDiv = e.target.closest('.' + type);
                        
                        if(parentDiv) {
                            parentDiv.remove();
                        }

                        this.eventBus.publish(this.eventList.item_deleted, { id, type, parentId });
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
                    const listTitle = document.createElement('span');
                        listTitle.className = "list-title";
                        listTitle.textContent = list.title;
                listHeader.append(listTitle);

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
                    const id = e.target.value;
                    const parentId = e.target.dataset.parentId;
                    const type = e.target.dataset.type;
                    const parentDiv = e.target.closest('.' + type);
                    
                    if(parentDiv) {
                        parentDiv.remove();
                    }

                    this.eventBus.publish(this.eventList.item_deleted, { id, type, parentId });
                });
            
            listDiv.append(itemContainer);
            listDiv.append(listDeleteBtn);

            return listDiv;
    }

    renderAll(data) {
   
        const toDoData = JSON.parse(data);

        toDoData.forEach(project => {
            // Need to handle multi projects
            const listContainer = document.querySelector('#container');
            project.subItems.forEach(list => {

                const listDiv = this.listView(list);
                listContainer.append(listDiv);

            });
        });
    }
}