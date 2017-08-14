import dispatcher from "../dispatcher";

export function searchItem(id, item) {
  dispatcher.dispatch({
    type: "SEARCH-ITEM",
    data: {id, item}
  });
}
