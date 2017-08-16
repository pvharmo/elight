/*jshint esversion: 6 */

import {EventEmitter} from "events";
import dispatcher from "../dispatcher";

class ListStore extends EventEmitter {

  constructor() {
    super();
    this.items = [];
  }

  getAll() {
    return this.items;
  }

  newItem(item) {
    this.items.push(item);
    this.emit("new-item");
  }

  deleteItem(id) {
    for (var i = 0; i < this.items.length; i++) {
      //console.log(id);
      //console.log(this.items[i][2]);
      if (id == this.items[i][2]) {
        this.items.splice(i,1);
        console.log(this.items);
      }
    }
    this.emit("item-deleted");
  }

  cancelSubmitForm() {
    this.items = [];
    this.emit("submit-form-cancel");
  }

  submitForm() {
    Meteor.call("submitForm",this.items);
    this.emit("form-submited");
  }

  handleActions(action) {
    switch (action.type) {
    case "ADD-ITEM-LIST":
      this.newItem(action.properties);
      break;

    case "DELETE-ITEM-LIST":
      this.deleteItem(action.properties);
      break;

    case "SUBMIT-FORM":
      this.submitForm();
      break;

    case "CANCEL-SUBMIT-FORM":
      this.cancelSubmitForm();
      break;

    default:

    }
  }
}

const list = new ListStore;

dispatcher.register(list.handleActions.bind(list));
window.dispatcher = dispatcher;
export default list;
