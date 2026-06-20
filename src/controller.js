export const events = {
    item_deleted: "model:item_deleted",
    item_added: "model:item_added",
    item_updated: "model:item_updated",
    item_form_submit: "view:item_form_submit",
    item_delete_request: "view:item_delete_request",
    data_save_request: "view:data_save_request",
    data_load_request: "view:data_load_request",
    data_access_error: "model:data_load_fail",
}

export class EventBus extends EventTarget {

  subscribe(event, callback) {

    const wrapper = (e) => callback(e.detail);
    this.addEventListener(event, wrapper);
    
    return () => this.removeEventListener(event, wrapper);
  }

  publish(event, data) {
    const customEvent = new CustomEvent(event, { detail: data });
    this.dispatchEvent(customEvent);
  }
}

