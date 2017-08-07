/*jshint esversion: 6 */
import React, {Component} from "react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import TextField from "material-ui/TextField";
import DatePicker from "material-ui/DatePicker";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import Checkbox from "material-ui/Checkbox";
import ChipInput from "material-ui-chip-input";

// Component that render each fields of the form that create a new item
export default class ItemsForm extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  link() {
    return Items.find({entity:this.props.schema.params.schema}).fetch();
  }

  render () {
    var value;
    if (this.props.item[this.props.schema.name] === undefined) {
      value = "";
    } else {
      value = this.props.item[this.props.schema.name].value;
    }
    switch (this.props.schema.type) {
    case "number":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <TextField
              type="number"
              step={this.props.schema.params.step}
              min={this.props.schema.params.min}
              max={this.props.schema.params.max}
              value={value}
              onChange={this.props.handleChange}
              floatingLabelText={this.props.schema.params.units}
              id={"item-form-" + this.props.schema.name}
            />
            </TableRowColumn>
        </TableRow>
      );

    case "text":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <TextField
              type={this.props.schema.type}
              value={value}
              onChange={this.props.handleChange}
              id={"item-form-" + this.props.schema.name}
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
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <DatePicker
              value={value}
              onChange={this.props.handleChange}
              id={"item-form-" + this.props.schema.name}
            />
          </TableRowColumn>
        </TableRow>
      );

    case "checkbox":
      if (value === "") {
        value = false;
      }
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <Checkbox
              checked={value}
              onCheck={this.props.handleChange} />
          </TableRowColumn>
        </TableRow>
      );

    case "textarea":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <TextField
              type={this.props.schema.type}
              id={"item-form-" + this.props.schema.name}
              multiLine={true}
              onChange={this.props.handleChange}
              value={value}
              rows={5}
            />
          </TableRowColumn>
        </TableRow>
      );

    case "dropdown":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <DropDownMenu
              id={"item-form-" + this.props.schema.name}
              value={value}
              onChange={this.props.handleChangeDropdown}
              multiple={this.props.schema.params.multi} >
              {this.props.schema.params.elements.map((element)=>{
                return(
                  <MenuItem key={element} value={element} primaryText={element} />
                );
              })}
            </DropDownMenu>
          </TableRowColumn>
        </TableRow>
      );

    case "tags":
      if (value === "") {
        value = [];
      }
      return (
        <TableRow>
          <TableRowColumn><label>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <ChipInput
              value={value}
              onRequestAdd={this.props.handleAddTag}
              onRequestDelete={this.props.handleDeleteTag}
            />
          </TableRowColumn>
        </TableRow>
      );

    case "link":
    console.log(this.link());
    console.log(this.props.schema.params.field);
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <DropDownMenu
              id={"item-form-" + this.props.schema.name}
              value={value}
              onChange={this.props.handleChangeDropdown}
              multiple={this.props.schema.params.multi} >
              {this.link().map((element)=>{
                return(
                  <MenuItem
                    key={element.id}
                    value={element.id}
                    primaryText={element[this.props.schema.params.field].value} />
                );
              })}
            </DropDownMenu>
          </TableRowColumn>
        </TableRow>
      );

    default:
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn></TableRowColumn>
        </TableRow>
      );
    }

    /*return (
      <TableRow>
        <TableRowColumn><label>{this.props.schema.name}</label></TableRowColumn>
        <TableRowColumn><input
          type={this.props.schema.type}
          ref={this.props.schema.name}
          id={"item-form-" + this.props.schema.name} /></TableRowColumn>
      </TableRow>
    )*/
  }
}
