/*jshint esversion: 6 */
import React, {Component} from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";
import * as NavigationActions from "../actions/NavigationActions.js";
import nav from "../stores/NavigationStore.js";

import RightDrawer from "../rightDrawer/RightDrawer.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {red500,blue500} from "material-ui/styles/colors";
import Dialog from "material-ui/Dialog";
import {List, ListItem} from "material-ui/List";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import IconButton from "material-ui/IconButton";
import TextField from "material-ui/TextField";
import RemoveCircleOutline from "material-ui/svg-icons/content/remove-circle-outline";
import Create from "material-ui/svg-icons/content/create";

export default class AccountRightDrawer extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.save = this.save.bind(this);

    this.state ={
      edit: false,
      text: "",
      newAppText: "",
      editAppText: "",
      dialog: false,
      newAppName: ""
    };
  }

  apps() {
    return Apps.find({}).fetch();
  }

  selectApp(id) {
    Meteor.call("selectApp", id);
  }

  newApp() {
    this.cancel();
    Meteor.call("newApp", this.state.newAppName);
  }

  deleteApp(app) {
    var r = confirm("Are you sure you want to delete this app. This action cannot be reversed. Every modules will be deleted.");
    if(r === true) {
      Meteor.call("deleteApp", app);
    }
  }

  editApp(app) {
    var editAppText = Apps.findOne({_id:app}).name;
    this.setState({app:app, editAppText});
  }

  save(app) {
    Meteor.call("editApp", app, this.state.editAppText);
  }

  handleChange(event, value) {
    this.setState({text:value});
  }

  handleClose() {
    this.setState({text:"", edit:false});
  }

  handleNewItemTextChange(value) {
    this.setState({newAppText: value});
  }

  handleEditedAppText(event, value) {
    this.setState({editAppText: value});
  }

  handleChangeNewAppName(event, value) {
    this.setState({newAppName: value});
  }

  openNewAppForm() {
    this.setState({dialog: true});
  }

  cancel() {
    this.setState({dialog: false, newAppName: ""});
  }

  render() {
    const actions = [
      <FlatButton
        label={language().cancel}
        onTouchTap={this.cancel.bind(this)} />,
      <FlatButton
        label={language().submit}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.newApp.bind(this)} />
    ];
    return (
      <div>
        <RightDrawer
          list={this.apps()}
          onSelectListItem={this.selectApp.bind(this)}
          newButtonText={language().apps.newApp}
          newItem={this.openNewAppForm.bind(this)}
          deleteItem={this.deleteApp.bind(this)}
          edit={true}
          text={this.state.newAppText}
          onNewItemTextChange={this.handleNewItemTextChange.bind(this)}
          saveEdited={this.save.bind(this)}
          dialogTitle={language().apps.editApp}
          onEditItem={this.editApp.bind(this)}
          editDialog={
            <TextField
              id={"edit-app-name"}
              value={this.state.editAppText}
              onChange={this.handleEditedAppText.bind(this)} />
          } />
        <MuiThemeProvider>
          <Dialog open={this.state.dialog} actions={actions} title={language().apps.newApp} >
            <TextField
              id="new-app-name"
              value={this.state.newAppName}
              onChange={this.handleChangeNewAppName.bind(this)}
              hintText={language().apps.newAppName} />
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}
