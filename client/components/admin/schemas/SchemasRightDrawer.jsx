/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../../../languages/languages.js";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";
import nav from "../../../flux/stores/NavigationStore.js";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import RightDrawer from "../rightDrawer/RightDrawer.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {red500, blue500} from "material-ui/styles/colors";
import Dialog from "material-ui/Dialog";
import {List, ListItem} from "material-ui/List";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import RemoveCircleOutline from "material-ui/svg-icons/content/remove-circle-outline";
import Create from "material-ui/svg-icons/content/create";

export default class SchemasRightDrawer extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.state = {
      subscription: {
        schemas: Meteor.subscribe("userSchemas"),
        entities: Meteor.subscribe("userEntitites")
      },
      edit: false,
      text: "",
      newSchemaText: "",
      editEntityText: ""
    };
  }

  componentWillUnmount() {
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();
  }

  entities() {
    return Entities.find().fetch();
  }

  selectEntity(entity) {
    NavigationActions.selectSchema(entity);
  }

  openNewSchemaForm() {
    NavigationActions.newSchema();
  }

  deleteEntity(entity) {
    console.log(entity);
    var r = confirm("Are you sure you want to delete this schema. This action cannot be reversed. Every fields will be deleted.");
    if(r === true) {
      // Session.set("selected-entity", undefined);
      // Session.set("selected-entity-name", undefined);
      this.handleClose;
      Meteor.call("deleteSchema", entity, function() {
        var newSelection = Entities.findOne({id: {$ne: entity}});
        NavigationActions.selectSchema(newSelection.id);
      });
    }
  }

  handleNewItemTextChange(value) {
    this.setState({newSchemaText: value});
  }

  saveEditedEntity(entity) {
    Meteor.call("editEntity", entity, this.state.editEntityText);
  }

  handleEditedEntityText(event, value) {
    this.setState({editEntityText: value});
  }

  editEntity(entity) {
    var editEntityText = Entities.findOne({id:entity}).name;
    this.setState({editEntityText});
  }

  render() {
    return (
      <RightDrawer
        list={this.entities()}
        onSelectListItem={this.selectEntity.bind(this)}
        newButtonText={language().schemas.newEntity}
        newItem={this.openNewSchemaForm.bind(this)}
        deleteItem={this.deleteEntity.bind(this)}
        activeItem={Session.get("selected-entity")}
        edit={true}
        text={this.state.newSchemaText}

        saveEdited={this.saveEditedEntity.bind(this)}
        dialogTitle={language().schemas.editEntity}
        onEditItem={this.editEntity.bind(this)}
        editDialog={
          <TextField
            id={"edit-entity-name"}
            value={this.state.editEntityText}
            onChange={this.handleEditedEntityText.bind(this)} />
        } />
    );
  }
}
