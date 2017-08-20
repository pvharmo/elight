
import React, {Component} from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../../languages/languages.js";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";
import nav from "../../../flux/stores/NavigationStore.js";

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

export default class ModulesRightDrawer extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.save = this.save.bind(this);

    this.state ={
      text: "",
      newPageText: "",
      editPageText: ""
    };
  }

  pages() {
    return Pages.find({}).fetch();
  }

  selectPage(id) {
    NavigationActions.selectPage(id);
  }

  newPage() {
    NavigationActions.newPage();
  }

  deletePage(page) {
    var r = confirm(language().pages.deleteConfirmation);
    if(r === true) {
      Meteor.call("deletePage", page, function() {
        var newSelection = Pages.findOne({id: {$ne: page}});
        NavigationActions.selectPage(newSelection.id);
      });
      Session.set("selected-page", undefined);
      Session.set("selected-page-name", undefined);
    }
  }

  editPage(page) {
    var editPageText = Pages.findOne({id:page}).name;
    this.setState({page:page, editPageText});
  }

  save(page) {
    Meteor.call("editPage", page, this.state.editPageText);
  }

  handleChange(event, value) {
    this.setState({text:value});
  }

  handleClose() {
    this.setState({text:"", edit:false});
  }

  handleNewItemTextChange(value) {
    this.setState({newPageText: value});
  }

  handleEditedPageText(event, value) {
    this.setState({editPageText: value});
  }

  render() {
    return (
      <RightDrawer
        list={this.pages()}
        onSelectListItem={this.selectPage.bind(this)}
        newButtonText={language().pages.newPage}
        newItem={this.newPage.bind(this)}
        deleteItem={this.deletePage.bind(this)}
        activeItem={Session.get("selected-page")}
        edit={true}
        text={this.state.newSchemaText}
        onNewItemTextChange={this.handleNewItemTextChange.bind(this)}
        saveEdited={this.save.bind(this)}
        dialogTitle={language().pages.editPage}
        onEditItem={this.editPage.bind(this)}
        editDialog={
          <TextField
            id={"edit-page-name"}
            value={this.state.editPageText}
            onChange={this.handleEditedPageText.bind(this)} />
        } />
    );
  }
}
