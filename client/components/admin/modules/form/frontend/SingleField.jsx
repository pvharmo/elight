
import React, {Component} from "react";
import ReactDOM from "react-dom";
import language from "../../../../../languages/languages.js";

//import FormFieldSingle from './FormFieldSingle.jsx';

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

export default class SingleField extends Component {

  constructor(props) {
    super(props);

    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {};
  }

  handleUpdateInput(searchText) {
    this.props.updateInput(searchText, this.props.fieldConnection.name, this.props.field.id);
  }

  handleChange(event, value) {
    this.props.handleChange(this.props.field.id, value);
  }

  render() {
    var errorText = "";
    var value = "";
    if (this.props.error) {
      errorText = language().requiredField;
    }
    if (this.props.item[this.props.field.id] !== undefined) {
      value = this.props.item[this.props.field.id];
    }
    switch (this.props.field.type) {
    case "text":
    //console.log(this.props.fieldConnection);
      return (
        <TableRow>
          <TableRowColumn style={{textAlign:"right"}} >{this.props.field.name}</TableRowColumn>
          <TableRowColumn>
            <TextField
              id={this.props.fieldConnection.id}
              onChange={this.handleChange}
              value={value}
              errorText={errorText}
            />
          </TableRowColumn>
        </TableRow>
      );

    case "number":
      return (
        <TableRow>
          <TableRowColumn style={{textAlign:"right"}} >{this.props.field.name}</TableRowColumn>
          <TableRowColumn>
            <TextField
              id={this.props.fieldConnection.id}
              type="number"
              onChange={this.handleChange}
              value={value}
              errorText={errorText}
            />
          </TableRowColumn>
        </TableRow>
      );

    case "textarea":
      return (
        <TableRow>
          <TableRowColumn style={{textAlign:"right"}} >{this.props.field.name}</TableRowColumn>
          <TableRowColumn>
            <TextField
              id={this.props.fieldConnection.id}
              multiLine={true}
              rows={3}
              rowsMax={10}
              onChange={this.handleChange}
              value={value}
              errorText={errorText}
            />
          </TableRowColumn>
        </TableRow>
      );

    case "date":
      if (value === "") {
        value = null;
      }
      return (
        <TableRow>
          <TableRowColumn style={{textAlign:"right"}} >{this.props.field.name}</TableRowColumn>
          <TableRowColumn>
            <TextField
              id={this.props.fieldConnection.id}
              onChange={this.handleChange}
              value={value}
              errorText={errorText} />
          </TableRowColumn>
        </TableRow>
      );

    case "checkbox":
      if (value === "") {
        value = false;
      }
      return (
        <TableRow>
          <TableRowColumn style={{textAlign:"right"}} >{this.props.field.name}</TableRowColumn>
          <TableRowColumn>
            <Checkbox
              id={this.props.fieldConnection.id}
              checked={value}
              onCheck={this.handleChange} />
          </TableRowColumn>
        </TableRow>
      );

    default:
      return <TableRow></TableRow>;
    }
  }
}
