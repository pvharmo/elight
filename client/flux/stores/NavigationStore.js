
import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import language from "../../languages/languages.js";

import ItemsRightDrawer from "../../components/admin/items/ItemsRightDrawer.jsx";

class NavStore extends EventEmitter {

  constructor() {
    super();

    this.user = {
      admin:false
    };

    this.searchItemText = {};

    this.rightDrawer = {title: "test"};

    this.itemEditForm = {};
  }

  getRightDrawer() {
    return this.rightDrawer;
  }

  getItemSearch() {
    return this.searchItemText;
  }

  getUser() {
    return this.user;
  }

  getItemEditForm() {
    return this.itemEditForm;
  }

  // ******************* Schemas ******************

  schemas() {
    this.rightDrawer = {
      title: language().schemas.schemas
    };
    this.emit("schemas");
    this.emit("right-drawer");
  }

  newSchema() {
    this.emit("new-schema");
  }

  newSchemaUpdate() {
    this.emit("new-schema-update");
  }

  selectSchema(id) {
    this.rightDrawer.schemaSelected = id;
    var name = Entities.findOne({id:id}).name;
    Session.set("selected-entity", id);
    Session.set("selected-entity-name", name);
    Session.set("title", {entity: name});
    this.emit("schema-selected");
  }

  // ******************* Items ******************

  items() {
    //this.rightDrawer = drawerItems();
    this.emit("schemas");
    this.emit("right-drawer");
  }

  newItem() {
    this.emit("new-item");
  }

  openEditForm(item, schema) {
    this.itemEditForm = {item, schema};
    this.rightDrawer.itemEdit = item.id;
    this.emit("open-edit-form");
  }

  // ******************* Modules ******************

  modules() {
    this.rightDrawer = {
      title: language().pages.pages
    };
    this.emit("pages");
    this.emit("right-drawer");
  }

  newPage() {
    this.emit("new-page");
  }

  selectPage(id) {
    this.rightDrawer.pageSelected = id;
    var name = Pages.findOne({id:id}).name;

    Session.set("selected-page", id);
    Session.set("selected-page-name", name);
    Session.set("title", {page: name});
    this.emit("page-selected");
  }

  // ******************* Frontend ******************

  frontend() {
    this.rightDrawer = {
      title: language().frontend.frontend
    };
    this.emit("right-drawer");
  }

  // ******************* General ******************

  openNavDrawer() {
    this.emit("open-nav-drawer");
  }

  // ******************* Search ******************

  searchItem(text, dropdown) {
    this.searchItemText = {text: text, dropdown: dropdown};
    //console.log(text, dropdown);
    this.emit("search-item");
  }

  advancedSearch() {
    this.emit("advanced-search");
  }

  clearSearch() {
    this.emit("clear-search");
  }

  // ******************* User ******************

  adminRights(value) {
    var _this = this;
    this.user.admin = value;
    //Session.set("admin-rights", value);
    var adminRights;

    if (value) {
      adminRights = setTimeout(function(){
        _this.user.admin = false;
        //Session.set("admin-rights", false);
      }, 300000);
    } else {
      clearTimeout(adminRights);
    }

    this.emit("admin-rights");
  }

  handleActions(action) {
    switch (action.type) {

    // ******************* Schemas ******************

    case "SCHEMAS":
      this.schemas();
      break;

    case "NEW-SCHEMA":
      this.newSchema();
      break;

    case "NEW-SCHEMA-UPDATE":
      this.newSchemaUpdate();
      break;

    case "SELECT-SCHEMA":
      this.selectSchema(action.id);
      break;

    // ******************* Items ******************

    case "ITEMS":
      this.items();
      break;

    case "NEW-ITEM":
      this.newItem();
      break;

    case "OPEN-EDIT-FORM":
      this.openEditForm(action.item, action.schema);
      break;

    // ******************* Modules ******************

    case "MODULES":
      this.modules();
      break;

    case "NEW-APP":
      this.newPage();
      break;

    case "NEW-APP-UPDATE":
      this.newPageUpdate();
      break;

    case "SELECT-APP":
      this.selectPage(action.id);
      break;

    // ******************* Frontend *****************

    case "FRONTEND":
      this.frontend();
      break;

    // ******************* General ******************

    case "OPEN-NAV-DRAWER":
      this.openNavDrawer();
      break;

    // ******************* Search ******************

    case "SEARCH-ITEM":
      this.searchItem(action.text, action.dropdown);
      break;

    case "ADVANCED-SEARCH":
      this.advancedSearch();
      break;

    case "CLEAR-SEARCH":
      this.clearSearch();
      break;

    // ******************* General ******************

    case "ADMIN-RIGHTS":
      this.adminRights(action.value);
      break;

    default:

    }
  }
}

const nav = new NavStore;

dispatcher.register(nav.handleActions.bind(nav));
window.dispatcher = dispatcher;
export default nav;
