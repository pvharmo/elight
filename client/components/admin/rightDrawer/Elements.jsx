/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../../../languages/languages.js";

import ButtonElement from "./elements/ButtonElement.jsx";
import ButtonListElement from "./elements/ButtonListElement.jsx";

export default class Elements extends Component {

  render() {
    switch (this.props.element.type) {
    case "button":
      return (<ButtonElement element={this.props.element} />);

    case "button-list":
      return (<ButtonListElement element={this.props.element} />);

    default:
      return (<div></div>);
    }
  }
}
