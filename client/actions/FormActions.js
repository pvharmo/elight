/*jshint esversion: 6 */

import dispatcher from "../dispatcher";

export function addItemList(text) {
  dispatcher.dispatch({
    type: "ADD-ITEM-LIST",
    properties: text
  });
}

export function deleteItemList(id) {
  dispatcher.dispatch({
    type: "DELETE-ITEM-LIST",
    properties: id
  });
}

export function submitForm() {
  dispatcher.dispatch({
    type: "SUBMIT-FORM"
  });
}

export function cancelSubmitForm() {
  dispatcher.dispatch({
    type: "CANCEL-SUBMIT-FORM"
  });
}
