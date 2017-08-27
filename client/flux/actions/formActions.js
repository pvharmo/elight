import dispatcher from "../dispatcher";

export function setData(id, data) {
  dispatcher.dispatch({
    type: "SET-DATA",
    data: {id, data}
  });
}
