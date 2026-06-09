export default class View {

    getDate(date) {

        return date ? date : "N/A";

    }

    itemView(item) {

        const itemLi = document.createElement('li');
            itemLi.dataset.itemId = item.id;
            itemLi.classList.add('item', `priority-${item.priority.toLowerCase()}`);

            const itemHeader = document.createElement('div');
                itemHeader.className = "item-header";
                const itemTitle = document.createElement('span');
                    itemTitle.className = "item-title";
                    itemTitle.textContent = item.title;
                const itemHamBtn = document.createElement('button');
                    itemHamBtn.className = "item-collapse-button";
                    itemHamBtn.textContent = "\u2261";
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
                    itemDeleteBtn.className = 'item-delete-button';
                    itemDeleteBtn.dataset.parentId = item.parentID;
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
                listDiv.classList.add('list', `priority-${list.priority.toLowerCase()}`);

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

            if(list.entities !== undefined) {

                list['entities'].forEach(item => {

                    const itemLi = this.itemView(item);
                    itemContainer.append(itemLi);

                });
            }

            const listDeleteBtn = document.createElement('button');
                listDeleteBtn.value = list.id;
                listDeleteBtn.textContent = 'Delete List'
                listDeleteBtn.className = 'list-delete-button';
            
            listDiv.append(itemContainer);
            listDiv.append(listDeleteBtn);

            return listDiv;
    }

    renderAll(data) {
        
        const toDoData = JSON.parse(data);

        toDoData.forEach(project => {
            // Need to handle multi projects
            const listContainer = document.querySelector('#container');
            project.entities.forEach(list => {

                const listDiv = this.listView(list);
                listContainer.append(listDiv);

            });
        });
    }
}