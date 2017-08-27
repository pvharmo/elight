import dispatcher from "../dispatcher";

export function selectEntity(id) {
  dispatcher.dispatch({
    type: "SELECT-ENTITY",
    data: {id}
  });
}

export function selectSection(id) {
  dispatcher.dispatch({
    type: "SELECT-SECTION",
    data: {id}
  });
}

export function editRole(role) {
  dispatcher.dispatch({
    type: "EDIT-ROLE",
    data: role
  });
}

export function editField(field) {
  dispatcher.dispatch({
    type: "EDIT-ENTITY",
    data: field
  });
}

export function searchRecords(record) {
  dispatcher.dispatch({
    type: "SEARCH-RECORDS",
    data: record
  });
}

export function clearSearch() {
  dispatcher.dispatch({
    type: "CLEAR-SEARCH"
  });
}

export function editRecord(record) {
  dispatcher.dispatch({
    type: "EDIT-RECORD",
    data: record
  });
}

export function editModule(module) {
  dispatcher.dispatch({
    type: "EDIT-MODULE",
    data: module
  });
}
