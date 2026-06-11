export const events = {
    item_deleted: "todo:item_deleted",
    sub_item_deleted: "todo:sub_item_deleted",
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

