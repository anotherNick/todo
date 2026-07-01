import { pubSub, events } from "./PubSub.js";
import ToDoView from "../views/ToDoView.js";
import FormView from "../views/FormView.js"
import { format } from "date-fns";

const form = document.getElementById('new-item-form');
const formModal = document.getElementById('form-modal');
const submitForm = new FormView(form, formModal);
const appView = new ToDoView(format, submitForm);

pubSub.subscribe(events.model_loaded, (toDoData) => {
    
    appView.renderAll(toDoData);
    appView.styleCompletedItems();

    pubSub.publish(events.render_complete);

});

function listEvents(e) {

    const classList = e.target.classList;

    if(classList.contains('delete-button')) {

        const deleted = appView.deleteItem(e);
        
        if(deleted) {
            pubSub.publish(events.item_delete_request, deleted);
        }
            
    } else if(classList.contains('edit-button')) {

        submitForm.updateInputValues(JSON.parse(e.target.dataset.item));
        submitForm.showModal();

    } else if(classList.contains('new-button')) {

        submitForm.updateInputValues(JSON.parse(e.target.dataset.details), 'New');
        submitForm.showModal();

    } else if(classList.contains('complete-checkbox')) {

        const toggled = appView.toggleComplete(e.target);

        if(toggled.completed) {

            pubSub.publish(events.item_completed, toggled);

        } else {

            pubSub.publish(events.item_incompleted, toggled);
            
        }

    }


}

function projectEvents(e) {

    const classList = e.target.classList;

    if(classList.contains('new-button')) {

        submitForm.updateInputValues(JSON.parse(e.target.dataset.details), 'New');
        submitForm.showModal();

    } else if(classList.contains('delete-button')) {

        const deleted = appView.deleteProject(e);
        
        if(deleted) {
            pubSub.publish(events.item_delete_request, deleted);
        }
        
    } else if(classList.contains('project-buttons')) {

        appView.updateActiveProject(e.target.dataset.projectId);

    }

}

// Add event listeners after rendering new content
pubSub.subscribe(events.render_complete, (e) => {

    const lists = document.querySelectorAll('.list');
          lists.forEach(list => {
            
              list.addEventListener('click', listEvents);
        
          });

    const projectHeaders = document.querySelectorAll('.project-header-buttons');
          projectHeaders.forEach(header => {

                header.addEventListener('click', projectEvents);

          });

    const projectTabs = document.querySelector('#projects');
          projectTabs.addEventListener('click', projectEvents);

});

pubSub.subscribe(events.item_updated, (item) => {

    submitForm.closeModal();

    appView.updateElement(item);

    pubSub.publish(events.render_complete);

});

pubSub.subscribe(events.item_added, (details) => {

    submitForm.closeModal();

    appView.addElement(details.item, details.parent)

    pubSub.publish(events.render_complete);

});

pubSub.subscribe(events.project_added, (details) => {

    submitForm.closeModal();

    appView.renderAll(details.toDoData);
    appView.updateActiveProject(details.id);

    pubSub.publish(events.render_complete);

});


form.addEventListener('submit', e => {

    e.preventDefault();
    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData);
    
    if(entries.id != ''){

        pubSub.publish(events.item_update_request, entries);
    
    } else {

        pubSub.publish(events.item_add_request, entries);

    }

    submitForm.reset();

});

const formCloseBtn = document.getElementById('form-modal-close');
      formCloseBtn.addEventListener('click', () => {

        submitForm.closeModal();

    });

appView.styleCompletedItems();