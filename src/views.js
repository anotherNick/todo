export default class View {


    itemView(item){

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
                itemBody.className = "item-body";
                const itemDue = document.createElement('div');
                    itemDue.className = "item-due-date";
                    itemDue.textContent = 'Placeholder due date';
                const itemDesc = document.createElement('div');
                    itemDesc.className = "item-description";
                    itemDesc.textContent = item.desc;
                const itemPriority = document.createElement('div');
                    itemPriority.className = "list-priority";
                    itemPriority.textContent = "Priority: " + item.priority;
                const itemNotes = document.createElement('div');
                    itemNotes.className = "item-notes";
                    itemNotes.textContent = "Notes: " + item.notes;
                const itemDeleteBtn = document.createElement('button');
                    itemDeleteBtn.value = item.id;
                    itemDeleteBtn.textContent = 'X';
                    itemDeleteBtn.className = 'item-delete-button';
            itemBody.append(itemDue);
            itemBody.append(itemDesc);
            itemBody.append(itemPriority);
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
                    const listHamBtn = document.createElement('button');
                        listHamBtn.className = "list-collapse-button";
                        listHamBtn.textContent = "\u2261";
                listHeader.append(listTitle);
                listHeader.append(listHamBtn);

                const listBody = document.createElement('div')
                    listBody.className = "list-body";
                    const listDue = document.createElement('div');
                        listDue.className = "list-due-date";
                        listDue.textContent = 'Placeholder due date';
                    const listDesc = document.createElement('div');
                        listDesc.className = "list-description";
                        listDesc.textContent = list.desc;
                    const listPriority = document.createElement('div');
                        listPriority.className = "list-priority";
                        listPriority.textContent = "Priority: " + list.priority;
                listBody.append(listDue);
                listBody.append(listDesc);
                listBody.append(listPriority);

            listDiv.append(listHeader);
            listDiv.append(listBody);

            const itemContainer = document.createElement('ul');
                itemContainer.className = "item-list";


            for(const item of list['items']) {

                const itemLi = this.itemView(item);
                itemContainer.append(itemLi);

            }

            const listDeleteBtn = document.createElement('button');
                listDeleteBtn.value = list.id;
                listDeleteBtn.textContent = 'X';
                listDeleteBtn.className = 'list-delete-button';
            
            listDiv.append(itemContainer);
            listDiv.append(listDeleteBtn);

            return listDiv;
    }

    renderLists(data) {

        const lists = JSON.parse(data);
        const listContainer = document.querySelector('#container');

        for(const list of lists['items']) {

            const listDiv = this.listView(list);
            listContainer.append(listDiv);

        }
        
    }

}