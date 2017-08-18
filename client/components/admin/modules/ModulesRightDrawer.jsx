
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
      Meteor.call("deletePage", page);
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

  /*render() {
    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={language().save}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.save}
      />,
    ];
    if (nav.getUser().admin) {
      actions.unshift(
        <FlatButton
          label={language().pages.deletePage}
          secondary={true}
          onTouchTap={this.deletePage.bind(this)} />
      );
    }
    return (
      <div>
        <MuiThemeProvider>
          <RaisedButton label={language().pages.newPage} fullWidth={true} primary={true} onTouchTap={this.newPage.bind(this)} />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <List>
            {this.pages().map((page)=>{
              return (
                <ListItem key={page.id}
                  primaryText={page.name}
                  onTouchTap={this.selectPage.bind(this,page.id)}
                  rightIcon={<IconButton onTouchTap={this.editPage.bind(this, page.id)} style={{padding:0}} ><Create color={blue500} /></IconButton>} />
              );
            })}
          </List>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Dialog title={language().pages.editPage} open={this.state.edit} actions={actions} >
            <TextField
              id={"edit-page-name"}
              value={this.state.text}
              onChange={this.handleChange} />
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }*/
}
