/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../languages/languages.js";
import nav from "../stores/NavigationStore.js";

import SchemaType from "./SchemaType.jsx";

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {cyan50, red500, blue500} from "material-ui/styles/colors";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import Visibility from "material-ui/svg-icons/action/visibility";
import ExpandLess from "material-ui/svg-icons/navigation/expand-less";
import VisibilityOff from "material-ui/svg-icons/action/visibility-off";
import ExpandMore from "material-ui/svg-icons/navigation/expand-more";
import Create from "material-ui/svg-icons/content/create";
import Clear from "material-ui/svg-icons/content/clear";
import Done from "material-ui/svg-icons/action/done";
import Cancel from "material-ui/svg-icons/navigation/cancel";
import AvNotInterested from "material-ui/svg-icons/av/not-interested";

export default class SchemaSingle extends Component {

  constructor() {
    super();
    // Set by default
    this.style = {};
    this.disabledCheckbox = false;

    this.state = {
      editState: false
    };
  }

  deleteField() {
    var prompt = confirm("Êtes-vous sûr de vouloir supprimer ce schéma?");
    if (prompt) {
      Meteor.call("deleteField", this.props.schema.id, this.props.schema.order, this.props.schema.schema);
    }
  }

  // Change showInList
  toggleChecked() {
    var id = {};
    id.id = this.props.schema.id;
    Meteor.call("toggleShowInListSchema", id, this.props.schema.showInList);
  }

  // Change state of editState to true
  editSchema() {
    this.setState({editState: true});
    Session.set("oldObjectName", this.props.schema.name);
  }

  // Change key of every items with this key
  saveEdited() {
    var modifiedObject = {};
    modifiedObject.name = document.getElementById("fieldName-" + this.props.schema.name).value.trim();
    var oldName = Session.get("oldObjectName");

    Meteor.call("SaveSchemaEdited", this.props.schema.id, modifiedObject);

    this.setState({editState: false});
    // If the name has been changed, change the key for every items
    if(oldName !== modifiedObject.name) {
      var newOldName = {};
      newOldName[oldName] = modifiedObject.name;
      Meteor.call("renameKeys", newOldName, this.props.schema.entity);
    }
  }

  cancelEdit() {
    this.setState({editState: false});
  }

  showBtnUp() {
    if(this.props.schema.order > 1) {
      return(
        <IconButton onTouchTap={this.moveUp.bind(this)} >­<ExpandLess color={blue500} /></IconButton>
      );
    }
  }

  showBtnDown() {
    var highestOrderField = Schemas.findOne({entity: Session.get("selected-entity")}, {sort: {order:-1}});
    if (highestOrderField) {
      if(this.props.schema.order < highestOrderField.order) {
        return(
          <IconButton onTouchTap={this.moveDown.bind(this)} >­<ExpandMore color={blue500} /></IconButton>
        );
      }
    }
  }

  moveUp() {
    var orderNumber = this.props.schema.order;
    var id = this.props.schema.id;
    var entity = this.props.schema.entity;
    Meteor.call("moveUp", id, orderNumber, entity);
  }

  moveDown() {
    var orderNumber = this.props.schema.order;
    var id = this.props.schema.id;
    var entity = this.props.schema.entity;
    Meteor.call("moveDown", id, orderNumber, entity);
  }


  render() {

    if (this.props.stripState) {
      this.style = {
        backgroundColor: cyan50,
        borderBottom: "0px solid rgba(0,0,0,0)"
      };
    } else {
      this.style = {
        borderBottom: "0px solid rgba(0,0,0,0)"
      };
    }

    if (this.props.schema.name == "History") {
      this.disabledCheckbox = true;
    }

    // Render table if editState === false
    if(this.state.editState === false)  {
      return (
        <TableRow style={this.style} hoverable={true}>
          <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
            <Checkbox
              checked={this.props.schema.showInList}
              onCheck={this.toggleChecked.bind(this)}
              checkedIcon={<Visibility />} uncheckedIcon={<VisibilityOff />}
              disabled={this.disabledCheckbox} />
          </TableRowColumn>
          <TableRowColumn style={{textAlign:"left", fontSize:16, color: "rgba(0,0,0,0.9)"}} >
            {this.props.schema.name}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            <SchemaType schema={this.props.schema} />
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.showBtnUp()}
            {this.showBtnDown()}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.props.schema.name == "History" ? ( <div>
              <IconButton disabled={true} ><Create color={blue500} /></IconButton>
              <IconButton disabled={true} ><Clear color={red500} /></IconButton>
            </div>) : (<div>
              <IconButton onTouchTap={this.editSchema.bind(this)} ><Create color={blue500} /></IconButton>
              <IconButton onTouchTap={this.deleteField.bind(this)} ><Clear color={red500} /></IconButton>
            </div>)}
          </TableRowColumn>
        </TableRow>
      );
    }

    // Show the form to edit the field if editState === true
    else {
      return (
        <TableRow>
          <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
            <Checkbox
                checked={this.props.schema.showInList}
                onCheck={this.toggleChecked.bind(this)}
                checkedIcon={<Visibility />} uncheckedIcon={<VisibilityOff />}
                disabled={this.disabledCheckbox} />
          </TableRowColumn>
          <TableRowColumn className="name-field">
            <TextField id={"fieldName-" + this.props.schema.name} defaultValue={this.props.schema.name} />
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            { this.props.schema.type}
          </TableRowColumn>
          <TableRowColumn></TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            <IconButton onTouchTap={this.saveEdited.bind(this)}><Done color={blue500} /></IconButton>
            <IconButton onTouchTap={this.cancelEdit.bind(this)}><AvNotInterested color={red500} /></IconButton>
          </TableRowColumn>
        </TableRow>
      );
    }
  }
}
