/*jshint esversion: 6 */
import React, {Component} from 'react';
import language from '../../languages/languages.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

export default class ButtonElement extends Component {

  handleTouchTap() {
    
  }

  render() {
    return (
      <RaisedButton label={this.props.element.text} fullWidth={true} primary={true} onTouchTap={this.handleTouchTap.bind(this)} />
    )
  }
}