/*jshint esversion: 6 */
import React, {Component} from "react";

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import TextField from "material-ui/TextField";
import Checkbox from "material-ui/Checkbox";
import DatePicker from "material-ui/DatePicker";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import ChipInput from "material-ui-chip-input";
import SuperSelectField from "material-ui-superselectfield";
import FlatButton from "material-ui/FlatButton";

// Component that render each fields of the form that create a new item
export default class ItemsEditForm extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
    this.handleChangeNumber = this.handleChangeNumber.bind(this);
    this.handleSuperSelect = this.handleSuperSelect.bind(this);

    this.state = {
      item: this.props.item,
      type: ""
    };
  }

  defaultValue() {
    return this.state.editingItem[this.props.schema.name] ;
  }

  handleChangeDropdown(type, event, index, value) {
    this.props.handleChange(this.props.schema.name, value, type);
  }

  handleChangeNumber(type, event, value) {
    this.props.handleChange(this.props.schema.name, Number(value), type);
  }

  handleChange(type, event, value) {
    this.props.handleChange(this.props.schema.name, value, type);
  }

  handleSuperSelect(type, value) {
    this.props.handleChange(this.props.schema.name, value, type);
  }

  handleAddTag(type, value) {
    this.props.handleAddTag(this.props.schema.name, value, type);
  }

  handleDeleteTag(type, value, index) {
    this.props.handleDeleteTag(this.props.schema.name, index, type);
  }

  render () {
    var value;
    var type;
    if (this.props.item[this.props.schema.name] === undefined) {
      value = "";
    } else if (this.props.item[this.props.schema.name].value === undefined) {
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
              type={this.props.schema.type}
              step={this.props.schema.params.step}
              min={this.props.schema.params.min}
              max={this.props.schema.params.max}
              id={"item-edit-form-" + this.props.schema.name}
              value={value}
              floatingLabelText={this.props.schema.params.units}
              onChange={this.handleChangeNumber.bind(this, "number")} />
          </TableRowColumn>
        </TableRow>
      );

    case "text":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn><TextField
            type={this.props.schema.type}
            id={"item-edit-form-" + this.props.schema.name}
            value={value}
            onChange={this.handleChange.bind(this, "text")} />
          </TableRowColumn>
        </TableRow>
      );

    case "date":
      if (value === "") {
        value = null;
      } else {
        var d = Date.parse(this.props.item[this.props.schema.name].value);
        value = new Date(d);
      }
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn><DatePicker
            type={this.props.schema.type}
            id={"item-edit-form-" + this.props.schema.name}
            value={value}
            onChange={this.handleChange.bind(this, "date")} />
          </TableRowColumn>
        </TableRow>
      );

    case "dropdown":
      if (value === "") {
        value =[];
      }
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <DropDownMenu
              id={"item-edit-form-" + this.props.schema.name}
              value={value}
              onChange={this.handleChangeDropdown.bind(this, "dropdown")}
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

    /*case "multiselect":
      if (value === "") {
        value = [];
      }
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <SuperSelectField
              id={"item-edit-form-" + this.props.schema.name}
              value={this.props.item[this.props.schema.name]}
              onChange={this.handleSuperSelect}
              multiple
              checkPosition='right'
              unCheckedIcon={null}
              menuCloseButton={<FlatButton label='close' />} >
              {this.props.schema.params.elements.map((element)=>{
                return(
                  <div key={element} value={element} >{element}</div>
                );
              })}
            </SuperSelectField>
          </TableRowColumn>
        </TableRow>
      );*/

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
              onCheck={this.handleChange.bind(this, "checkbox")} />
          </TableRowColumn>
        </TableRow>
      );

    case "textarea":
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn><TextField
            cols="15"
            id={"item-edit-form-" + this.props.schema.name}
            value={value}
            onChange={this.handleChange.bind(this, "textarea")} />
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
              onRequestAdd={this.handleAddTag.bind(this, "tags")}
              onRequestDelete={this.handleDeleteTag.bind(this, "tags")}
            />
          </TableRowColumn>
        </TableRow>
      );

    default:
      return (
        <TableRow>
          <TableRowColumn><label htmlFor={this.props.schema.name}>{this.props.schema.name}</label></TableRowColumn>
          <TableRowColumn>
            <input
              type={this.props.schema.type}
              id={"item-edit-form-" + this.props.schema.name}
              value={this.props.item[this.props.schema.name]}
              onChange={this.handleChange.bind(this, "undefined")} />
          </TableRowColumn>
        </TableRow>
      );
    }
  }
}
