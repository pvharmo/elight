import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import language from "../../languages/languages.js";

class PageStore extends EventEmitter {
  constructor() {
    super();

    this.search = {};
  }

  searchItem(id, item) {
    this.search[id] = item;
  }

  handleActions(action) {
    switch (action.type) {
    case "SEARCH-ITEM":
      this.searchItem(action.data.id, action.data.item);
      break;
    }
  }
}

const page = new PageStore;

dispatcher.register(page.handleActions.bind(page));
window.dispatcher = dispatcher;
export default page;
