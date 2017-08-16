/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../../../languages/languages.js";
import nav from "../../../flux/stores/NavigationStore.js";

//import SchemaType from './SchemaType.jsx';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {cyan50, red500, blue500} from "material-ui/styles/colors";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import Visibility from "material-ui/svg-icons/action/visibility";
import VisibilityOff from "material-ui/svg-icons/action/visibility-off";
import ExpandLess from "material-ui/svg-icons/navigation/expand-less";
import ExpandMore from "material-ui/svg-icons/navigation/expand-more";
import Create from "material-ui/svg-icons/content/create";
import Clear from "material-ui/svg-icons/content/clear";
import Done from "material-ui/svg-icons/action/done";
import Cancel from "material-ui/svg-icons/navigation/cancel";

export default class ModuleSingle extends Component {

  constructor() {
    super();
    // Set by default
    this.style = {};

    /*this.state = {
      editState: false
    };*/
  }

  moduleType() {
    return this.props.module.type;
  }

  deleteModule() {
    var prompt = confirm("Êtes-vous sûr de vouloir supprimer ce module?");
    if (prompt) {
      Meteor.call("deleteModule", this.props.module.id, this.props.module.order, this.props.module.page);
    }
  }

  // Change state of editState to true
  editModule() {
    //this.setState({editState: true});
    FlowRouter.go("/admin/modules/"+this.props.module.type+"/"+this.props.module.id);
  }

  // Change key of every items with this key
  /*saveEdited() {
    this.setState({editState: false});
    modifiedObject = {};
    modifiedObject.name = document.getElementById("fieldName-" + this.props.module.name).value.trim();

    Meteor.call('SaveModuleEdited', this.props.module.id, modifiedObject);
  }*/

  /*cancelEdit() {
    this.setState({editState: false});
  }*/

  showBtnUp() {
    if(this.props.module.order > 1 && this.props.module.order < 1000) {
      return(
        <IconButton onTouchTap={this.moveUp.bind(this)} >­<ExpandLess color={blue500} /></IconButton>
      );
    }
  }

  showBtnDown() {
    var pageName = Session.get("selected-page");
    var highestOrderField = Modules.findOne({page: pageName}, {sort: {order:-1}, skip: 0});
    if (highestOrderField) {
      if(this.props.module.order < highestOrderField.order) {
        return(
          <IconButton onTouchTap={this.moveDown.bind(this)} >­<ExpandMore color={blue500} /></IconButton>
        );
      }
    }
  }

  moveUp() {
    var orderNumber = this.props.module.order;
    var id = this.props.module.id;
    var pageName = this.props.module.page;
    Meteor.call("moveUpModule", id, orderNumber, pageName);
  }

  moveDown() {
    var orderNumber = this.props.module.order;
    var id = this.props.module.id;
    var pageName = this.props.module.page;
    Meteor.call("moveDownModule", id, orderNumber, pageName);
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

    /*if (this.props.schema.name == "History") {
      this.disabledCheckbox = true;
    }*/

    // Render table if editState === false
    //if(this.state.editState === false)  {
    return (
        <TableRow style={this.style} hoverable={true}>
          <TableRowColumn style={{textAlign:"left", fontSize:16, color: "rgba(0,0,0,0.9)"}} >
            {this.props.module.name}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.moduleType()}{/*this.props.schema.type <SchemaType schema={this.props.module} />*/}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.showBtnUp()}
            {this.showBtnDown()}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            <IconButton onTouchTap={this.editModule.bind(this)} ><Create color={blue500} /></IconButton>
            <IconButton onTouchTap={this.deleteModule.bind(this)} ><Clear color={red500} /></IconButton>
          </TableRowColumn>
        </TableRow>
    );
    //}

    // Show the form to edit the field if editState === true
    /*else {
      return (
        <TableRow>
          <TableRowColumn className="name-field">
            <TextField id={"fieldName-" + this.props.module.name} defaultValue={this.props.module.name} />
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.moduleType()}
          </TableRowColumn>
          <TableRowColumn></TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            <IconButton onTouchTap={this.saveEdited.bind(this)}><Done color={blue500} /></IconButton>
            <IconButton onTouchTap={this.cancelEdit.bind(this)}><Cancel color={red500} /></IconButton>
          </TableRowColumn>
        </TableRow>
      )
    }*/
  }
}
