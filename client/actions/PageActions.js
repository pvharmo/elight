import dispatcher from "../dispatcher";

export function formSearch() {
  dispatcher.dispatch({
    type: "FORM-SEARCH"
  });
}
