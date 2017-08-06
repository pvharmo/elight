/*jshint esversion: 6 */
import dispatcher from "../dispatcher";

// ******************* Schemas ******************

export function schemas() {
  dispatcher.dispatch({
    type: "SCHEMAS"
  });
}

export function newSchema() {
  dispatcher.dispatch({
    type: "NEW-SCHEMA"
  });
}

export function newSchemaUpdate() {
  dispatcher.dispatch({
    type: "NEW-SCHEMA-UPDATE"
  });
}

export function selectSchema(id) {
  dispatcher.dispatch({
    type: "SELECT-SCHEMA",
    id: id
  });
}

// ******************* Items ******************

export function items() {
  dispatcher.dispatch({
    type: "ITEMS"
  });
}

export function newItem() {
  dispatcher.dispatch({
    type: "NEW-ITEM"
  });
}

export function openEditForm(item, schema) {
  dispatcher.dispatch({
    type: "OPEN-EDIT-FORM",
    item: item,
    schema: schema
  });
}

// ******************* Modules ******************

export function modules() {
  dispatcher.dispatch({
    type: "MODULES"
  });
}

export function newPage() {
  dispatcher.dispatch({
    type: "NEW-APP"
  });
}

export function selectPage(id) {
  dispatcher.dispatch({
    type: "SELECT-APP",
    id: id
  });
}

// ******************* Frontend ******************

export function frontend() {
  dispatcher.dispatch({
    type: "FRONTEND"
  });
}

// ******************* General ******************

export function openNavDrawer() {
  dispatcher.dispatch({
    type: "OPEN-NAV-DRAWER"
  });
}

// ******************* Search ******************

export function searchItem(text, dropdown) {
  dispatcher.dispatch({
    type: "SEARCH-ITEM",
    text: text,
    dropdown: dropdown
  });
}

export function advancedSearch() {
  dispatcher.dispatch({
    type: "ADVANCED-SEARCH"
  });
}

export function clearSearch() {
  dispatcher.dispatch({
    type: "CLEAR-SEARCH"
  });
}

// ******************* User ******************

export function adminRights(value) {
  dispatcher.dispatch({
    type: "ADMIN-RIGHTS",
    value: value
  });
}
