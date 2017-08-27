import {EventEmitter} from "events";
import dispatcher from "../dispatcher";

class AdminStore extends EventEmitter {
  constructor() {
    super();

    this.structure = {};
    this.sections = {};
    this.state = {};
  }

  getStructure() {
    return this.state;
  }

  getSections() {
    return this.state;
  }

  getState(state) {
    return this.state[state];
  }

  selectEntity(id) {
    this.state.entity = id;
    this.emit("entity-selected");
  }

  selectSection(id) {
    this.state.section = id;
    this.emit("section-selected");
  }

  editRole(role) {
    this.state.role = role;
    this.emit("edit-role");
  }

  editEntity(field) {
    this.state.field = field;
    this.emit("edit-entity");
  }

  setSearch(record) {
    this.state.search = record;
    this.emit("search-records");
  }

  clearSearch() {
    this.state.search = {};
  }

  editRecord(record) {
    this.state.record = record;
    this.emit("edit-record");
  }

  editModule(module) {
    this.state.module = module;
    this.emit("edit-module");
  }

  handleActions(action) {
    switch (action.type) {
    case "SELECT-ENTITY":
      this.selectEntity(action.data.id);
      break;
    case "SELECT-SECTION":
      this.selectSection(action.data.id);
      break;
    case "EDIT-ROLE":
      this.editRole(action.data);
      break;
    case "EDIT-ENTITY":
      this.editEntity(action.data);
      break;
    case "SEARCH-RECORDS":
      this.setSearch(action.data);
      break;
    case "CLEAR-SEARCH":
      this.clearSearch();
      break;
    case "EDIT-RECORD":
      this.editRecord(action.data);
      break;
    case "EDIT-MODULE":
      this.editModule(action.data);
      break;
    }
  }
}

const adminStore = new AdminStore;

dispatcher.register(adminStore.handleActions.bind(adminStore));
window.dispatcher = dispatcher;
export default adminStore;
