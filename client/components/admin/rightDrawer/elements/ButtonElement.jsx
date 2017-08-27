/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../../../../languages/languages.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Button from "material-ui/Button";

export default class ButtonElement extends Component {

  handleTouchTap() {

  }

  render() {
    return (
      <Button label={this.props.element.text} fullWidth={true} primary={true} onTouchTap={this.handleTouchTap.bind(this)} />
    );
  }
}
