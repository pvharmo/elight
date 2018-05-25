/*jshint esversion: 6 */
import React, {Component} from "react";
import nav from "../../../../../flux/stores/NavigationStore.js";

import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import {red, blue} from "@material-ui/core/colors";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Toc from "@material-ui/icons/Toc";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Create from "@material-ui/icons/Create";
import Clear from "@material-ui/icons/Clear";

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
    var prompt = confirm("Êtes-vous sûr de vouloir supprimer ce champ?");
    if (prompt) {
      Meteor.call("deleteFormField", this.props.field.id, /*this.props.field.order,*/ this.props.field.module);
    }
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
        <IconButton onClick={this.moveUp.bind(this)} >­<ExpandLess color={blue[500]} /></IconButton>
      );
    }
  }

  showBtnDown() {
    var highestOrderField = Fields.findOne({module: this.props.id}, {sort: {order:-1}});
    if (highestOrderField) {
      if(this.props.field.order < highestOrderField.order) {
        return(
          <IconButton onClick={this.moveDown.bind(this)} >­<ExpandMore color={blue[500]} /></IconButton>
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

  edit() {
    this.props.edit(this.props.field);
  }

  render() {
    return (
      <ListItem button onClick={this.edit.bind(this)} >
        <ListItemText primary={this.props.field.name} secondary={this.props.field.type} />
        <ListItemSecondaryAction>
          <IconButton disabled >
            <Toc style={{width:32, height: 32}} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

// // Render table if editState === false
// if(this.state.editState === false)  {
//   //console.log(this.singleField()[0].form);
//   return (
//     <TableRow>
//       {/*<TableCell style={styleCheckbox}>
//         <Checkbox checked={this.props.field.total} onCheck={this.handleCheck.bind(this, "total")} />
//         {//<Checkbox checked={this.props.field.total} onCheck={this.handleCheck.total} />
//         }
//       </TableCell>
//       <TableCell style={styleCheckbox}>
//         <Checkbox checked={this.props.field.form} onCheck={this.handleCheck.bind(this, "form")} />
//       </TableCell>
//       <TableCell style={styleCheckbox}>
//         <Checkbox checked={this.props.field.list} onCheck={this.handleCheck.bind(this, "list")} />
//       </TableCell>*/}
//       <TableCell style={styleCheckbox}>
//         <Checkbox checked={this.props.field.required} onChange={this.handleCheck.bind(this, "required")} />
//       </TableCell>
//       <TableCell style={{textAlign:"left", fontSize:16, color: "rgba(0,0,0,0.9)"}} >
//         {this.props.field.name}
//       </TableCell>
//       <TableCell style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
//         {this.props.field.type}
//       </TableCell>
//       <TableCell style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
//         {this.props.field.action}
//       </TableCell>
//       <TableCell style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
//         {this.connection()}
//       </TableCell>
//       <TableCell style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
//         {this.showBtnUp()}
//         {this.showBtnDown()}
//       </TableCell>
//       <TableCell style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
//         <IconButton onClick={this.editField.bind(this)} disabled={true} ><Create color={blue[500]} /></IconButton>
//         <IconButton onClick={this.deleteField.bind(this)} ><Clear color={red[500]} /></IconButton>
//       </TableCell>
//     </TableRow>
//   );
// }
//
// // Show the form to edit the field if editState === true
// else {
//   return (
//     <TableRow>
//       <TableCell style={styleCheckbox}>
//         <Checkbox checked={this.singleField()[0].total} onCheck={this.handleCheck.total} />
//       </TableCell>
//       <TableCell style={styleCheckbox}>
//         <Checkbox checked={this.singleField()[0].form} onCheck={this.handleCheck.form} />
//       </TableCell>
//       <TableCell style={styleCheckbox}>
//         <Checkbox checked={this.singleField()[0].list} onCheck={this.handleCheck.list} />
//       </TableCell>
//       <TableCell style={{textAlign:"left", fontSize:16, color: "rgba(0,0,0,0.9)"}} >
//         {this.props.field.name}
//       </TableCell>
//       <TableCell style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
//         {this.props.field.type}
//       </TableCell>
//       <TableCell style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
//         {this.props.field.action}
//       </TableCell>
//       <TableCell style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
//         <div style={{textAlign: "left",color: "rgba(0,0,0,0.6)",height: "17px",fontSize: "11px"}} >{this.connection()[0].schema}</div>
//         {this.connection()[0].name}
//       </TableCell>
//       <TableCell>
//         {/*this.showBtnUp()}
//         {this.showBtnDown()*/}
//       </TableCell>
//       <TableCell>
//         <IconButton onClick={this.editField.bind(this)} ><Create color={blue[500]} /></IconButton>
//         <IconButton onClick={this.deleteField.bind(this)} ><Clear color={red[500]} /></IconButton>
//       </TableCell>
//     </TableRow>
//   );
//   /*return (
//     <TableRow>
//       <TableCell className="checkbox-list">
//         <input id={this.props.operator.name + "-checkbox"} type="checkbox" className="checkbox" readOnly checked={this.props.operator.showInForm} onClick={this.toggleChecked.bind(this)} />
//       </TableCell>
//       <TableCell className="name-field">
//         <input ref="fieldName" type="text" defaultValue={this.props.operator.name} />
//       </TableCell>
//       <TableCell>
//         { this.props.operator.type}
//       </TableCell>
//       <TableCell></TableCell>
//       <TableCell>
//         <div className="btn-round-new" onClick={this.saveEdited.bind(this)}>&#10003;</div>
//       </TableCell>
//     </TableRow>
//   )*/
// }
