import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import language from "../../languages/languages.js";

class formStore extends EventEmitter {
  constructor() {
    super();

    this.data = {};
  }

  getData(id) {
    return this.data[id];
  }

  setData(id, data) {
    this.data[id] = data;
  }

  handleActions(action) {
    switch (action.type) {
    case "SET-DATA":
      this.setData(action.data.id, action.data.data);
      break;
    }
  }
}

const form = new formStore;

dispatcher.register(form.handleActions.bind(form));
window.dispatcher = dispatcher;
export default form;
