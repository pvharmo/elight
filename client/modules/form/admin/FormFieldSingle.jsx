/*jshint esversion: 6 */
import React, {Component} from "react";
import nav from "../../../stores/NavigationStore.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {cyan50, red500, blue500} from "material-ui/styles/colors";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
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

export default class FormFieldSingle extends Component {

  constructor(props) {
    super(props);

    this.handleCheck.total = this.handleCheck.bind(this, "total");
    this.handleCheck.form = this.handleCheck.bind(this, "form");
    this.handleCheck.list = this.handleCheck.bind(this, "list");
    //this.handleCheck.required = this.handleCheck.bind(this, "required");

    // Set by default
    this.state = {
      subscription: {
        //schemas: Meteor.subscribe("appSchemas"),
        //entities: Meteor.subscribe("appEntities"),
        fields: Meteor.subscribe("appFields")
      },
      editState: false,
    };
  }

  componentWillUnmount() {
    //this.state.subscription.schemas.stop();
    this.state.subscription.fields.stop();
  }

  deleteField() {
    Meteor.call("deleteFormField", this.props.field.id, /*this.props.field.order,*/ this.props.field.module);
  }

  // Change state of editState to true
  editSchema() {
    this.setState({editState: true});
    Session.set("oldObjectName", this.props.operator.name);
  }

  // Change key of every items with this key
  saveEdited() {
    this.setState({editState: false});
    var modifiedObject = {};
    modifiedObject.name = this.refs.fieldName.value;
    var oldName = Session.get("oldObjectName");

    Meteor.call("SaveSchemaEdited", this.props.operator.id, modifiedObject);

    // If the name has been changed, change the key for every items
    if(oldName !== modifiedObject.name) {
      var newOldName = {};
      newOldName[oldName] = modifiedObject.name;
      Meteor.call("renameKeys", newOldName);
    }
  }

  showBtnUp() {
    if(this.props.field.order > 1) {
      return(
        <IconButton onTouchTap={this.moveUp.bind(this)} >­<ExpandLess color={blue500} /></IconButton>
      );
    }
  }

  showBtnDown() {
    var page = Session.get("selected-page");
    var highestOrderField = Fields.findOne({module: this.props.id}, {sort: {order:-1}});
    if (highestOrderField) {
      if(this.props.field.order < highestOrderField.order) {
        return(
          <IconButton onTouchTap={this.moveDown.bind(this)} >­<ExpandMore color={blue500} /></IconButton>
        );
      }
    }
  }

  moveUp() {
    var orderNumber = this.props.field.order;
    var id = this.props.field.id;
    var module = this.props.field.module;
    Meteor.call("moveUpField", id, orderNumber, module);
  }

  moveDown() {
    var orderNumber = this.props.field.order;
    var id = this.props.field.id;
    var module = this.props.field.module;
    Meteor.call("moveDownField", id, orderNumber, module);
  }

  module() {
    return Modules.find({id:this.props.id}).fetch();
  }

  handleCheck(checkbox, event, value) {
    var newValue = {};
    newValue[checkbox] = value;
    Meteor.call("updateField", this.props.field.id, newValue);
  }

  singleField() {
    return Fields.find({id:this.props.field.id}).fetch();
  }

  connection() {
    var schema = Schemas.find({id:this.singleField()[0].fieldConnection}).fetch()[0];
    var entity = Entities.find({id:this.singleField()[0].fieldConnectionEntity}).fetch()[0];
    return <div><div style={{textAlign: "left",color: "rgba(0,0,0,0.6)",height: "17px",fontSize: "11px"}} >
      {entity && entity.name}
    </div>
    {schema.name}</div>;
  }

  editField() {
    this.setState({editState:true});
  }

  render() {
    var styleCheckbox={width: "60px", paddingLeft: "5px", paddingRight: "5px", textAlign: "center"};

    // Render table if editState === false
    if(this.state.editState === false)  {
      //console.log(this.singleField()[0].form);
      return (
        <TableRow>
          {/*<TableRowColumn style={styleCheckbox}>
            <Checkbox checked={this.props.field.total} onCheck={this.handleCheck.bind(this, "total")} />
            {//<Checkbox checked={this.props.field.total} onCheck={this.handleCheck.total} />
            }
          </TableRowColumn>
          <TableRowColumn style={styleCheckbox}>
            <Checkbox checked={this.props.field.form} onCheck={this.handleCheck.bind(this, "form")} />
          </TableRowColumn>
          <TableRowColumn style={styleCheckbox}>
            <Checkbox checked={this.props.field.list} onCheck={this.handleCheck.bind(this, "list")} />
          </TableRowColumn>*/}
          <TableRowColumn style={styleCheckbox}>
            <Checkbox checked={this.props.field.required} onCheck={this.handleCheck.bind(this, "required")} />
          </TableRowColumn>
          <TableRowColumn style={{textAlign:"left", fontSize:16, color: "rgba(0,0,0,0.9)"}} >
            {this.props.field.name}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.props.field.type}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.props.field.action}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.connection()}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.showBtnUp()}
            {this.showBtnDown()}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            <IconButton onTouchTap={this.editField.bind(this)} disabled={true} ><Create color={blue500} /></IconButton>
            {nav.getUser().admin &&
              <IconButton onTouchTap={this.deleteField.bind(this)} ><Clear color={red500} /></IconButton>
            }
          </TableRowColumn>
        </TableRow>
      );
    }

    // Show the form to edit the field if editState === true
    else {
      return (
        <TableRow>
          <TableRowColumn style={styleCheckbox}>
            <Checkbox checked={this.singleField()[0].total} onCheck={this.handleCheck.total} />
          </TableRowColumn>
          <TableRowColumn style={styleCheckbox}>
            <Checkbox checked={this.singleField()[0].form} onCheck={this.handleCheck.form} />
          </TableRowColumn>
          <TableRowColumn style={styleCheckbox}>
            <Checkbox checked={this.singleField()[0].list} onCheck={this.handleCheck.list} />
          </TableRowColumn>
          <TableRowColumn style={{textAlign:"left", fontSize:16, color: "rgba(0,0,0,0.9)"}} >
            {this.props.field.name}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.props.field.type}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            {this.props.field.action}
          </TableRowColumn>
          <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            <div style={{textAlign: "left",color: "rgba(0,0,0,0.6)",height: "17px",fontSize: "11px"}} >{this.connection()[0].schema}</div>
            {this.connection()[0].name}
          </TableRowColumn>
          <TableRowColumn>
            {/*this.showBtnUp()}
            {this.showBtnDown()*/}
          </TableRowColumn>
          <TableRowColumn>
            <IconButton onTouchTap={this.editField.bind(this)} ><Create color={blue500} /></IconButton>
            <IconButton onTouchTap={this.deleteField.bind(this)} ><Clear color={red500} /></IconButton>
          </TableRowColumn>
        </TableRow>
      );
      /*return (
        <TableRow>
          <TableRowColumn className="checkbox-list">
            <input id={this.props.operator.name + "-checkbox"} type="checkbox" className="checkbox" readOnly checked={this.props.operator.showInForm} onClick={this.toggleChecked.bind(this)} />
          </TableRowColumn>
          <TableRowColumn className="name-field">
            <input ref="fieldName" type="text" defaultValue={this.props.operator.name} />
          </TableRowColumn>
          <TableRowColumn>
            { this.props.operator.type}
          </TableRowColumn>
          <TableRowColumn></TableRowColumn>
          <TableRowColumn>
            <div className="btn-round-new" onClick={this.saveEdited.bind(this)}>&#10003;</div>
          </TableRowColumn>
        </TableRow>
      )*/
    }
  }
}
