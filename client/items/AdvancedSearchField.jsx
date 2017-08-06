/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../languages/languages.js";

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import TextField from "material-ui/TextField";
import DatePicker from "material-ui/DatePicker";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";

export default class AdvancedSearchField extends Component {

  constructor() {
    super();

    this.state = {
      dropdown: []
    };
  }

  handleChange(event, value) {
    var fields;
    if (Session.get("advanced-search") !== undefined) {
      fields = Session.get("advanced-search");
    } else {
      fields = {};
    }
    fields[this.props.schema.name] = value;
    Session.set("advanced-search", fields);
  }

  handleDropdown(event, i, value) {
    var fields;
    if (Session.get("advanced-search") !== undefined) {
      fields = Session.get("advanced-search");
    } else {
      fields = {};
    }
    this.setState({dropdown: value});
    fields[this.props.schema.name] = value;
    Session.set("advanced-search", fields);
  }

  render() {
    switch(this.props.schema.type) {
    case "number":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <TextField
              type={this.props.schema.type}
              step={this.props.schema.params.step}
              min={this.props.schema.params.min}
              max={this.props.schema.params.max}
              ref={this.props.schema.name}
              id={"item-edit-form-" + this.props.schema.name}
              onChange={this.handleChange.bind(this)} />
          </TableRowColumn>
        </TableRow>
      );

    case "text":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn><TextField
            type={this.props.schema.type}
            ref={this.props.schema.name}
            id={"item-edit-form-" + this.props.schema.name}
            onChange={this.handleChange.bind(this)} />
          </TableRowColumn>
        </TableRow>
      );

    case "date":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn><DatePicker
            type={this.props.schema.type}
            ref={this.props.schema.name}
            id={"item-edit-form-" + this.props.schema.name}
            onChange={this.handleChange.bind(this)} />
          </TableRowColumn>
        </TableRow>
      );

    case "dropdown":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <DropDownMenu
              ref={this.props.schema.name}
              id={"item-edit-form-" + this.props.schema.name}
              onChange={this.handleDropdown.bind(this)}
              multiple={true}
              value={this.state.dropdown} >
              {this.props.schema.params.elements.map((options)=>{
                return (<MenuItem key={options} value={options} primaryText={options} />);
              })}
            </DropDownMenu>
          </TableRowColumn>
        </TableRow>
      );

    case "textarea":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn><TextField
            cols="15"
            ref={this.props.schema.name}
            id={"item-edit-form-" + this.props.schema.name}
            onChange={this.handleChange.bind(this)} />
          </TableRowColumn>
        </TableRow>
      );

    case "history":
      return (
        <TableRow>
        </TableRow>
      );

    default:
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <input
              type={this.props.schema.type}
              ref={this.props.schema.name}
              id={"item-edit-form-" + this.props.schema.name} />
          </TableRowColumn>
        </TableRow>
      );
    }
  }
}
