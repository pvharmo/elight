/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../../../languages/languages.js";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";
import nav from "../../../flux/stores/NavigationStore.js";

import SchemasRightDrawer from "../schemas/SchemasRightDrawer.jsx";
import ItemsRightDrawer from "../items/ItemsRightDrawer.jsx";
import ModulesRightDrawer from "../modules/ModulesRightDrawer.jsx";
import Elements from "./Elements.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {red500, blue500} from "material-ui/styles/colors";
import Drawer from "material-ui/Drawer";
import Dialog from "material-ui/Dialog";
import FloatingActionButton from "material-ui/FloatingActionButton";
import {List, ListItem} from "material-ui/List";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import ChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import ChevronRight from "material-ui/svg-icons/navigation/chevron-right";
import RemoveCircleOutline from "material-ui/svg-icons/content/remove-circle-outline";
import Create from "material-ui/svg-icons/content/create";

export default class rightDrawer extends Component {
  constructor() {
    super();

    this.state = {
      "rightDrawer": false,
      "edit": false
    };
  }

  openRightDrawer() {
    var rightDrawerState = this.state.rightDrawer;
    this.setState({
      "rightDrawer": !rightDrawerState
    });
    var button = document.getElementsByClassName("open-right-drawer-button")[0];
    var chevronLeft = document.getElementsByClassName("chevron-left-open-right-drawer-button")[0];
    var chevronRight = document.getElementsByClassName("chevron-right-open-right-drawer-button")[0];
    if (button.style.right != "320px") {
      button.style.right = "320px";
      chevronLeft.style.display = "none";
      chevronRight.style.display = "inline-block";
    } else {
      button.style.right = "20px";
      chevronLeft.style.display = "inline-block";
      chevronRight.style.display = "none";
    }
  }

  elements() {
    return this.state.drawerElements.body;
  }

  handleTouch(event, value) {
    this.props.onSelectListItem(value);
    if (window.innerWidth <= 1600) {
      this.openRightDrawer();
    }
  }

  handleEditItem(id) {
    this.setState({edit: true, id});
    this.props.onEditItem(id);
  }

  handleChange(event, value) {
    if (this.props.onNewItemTextChange) {
      this.props.onNewItemTextChange(value);
    }
  }

  newItem() {
    this.props.newItem();
  }

  handleClose() {
    this.setState({edit: false});
  }

  save() {
    this.handleClose();
    if (this.props.saveEdited) {
      this.props.saveEdited(this.state.id);
    }
  }

  deleteItem() {
    var prompt = confirm("Êtes-vous sûr de vouloir supprimer ce schéma?");
    if (prompt) {
      this.handleClose();
      if (this.props.deleteItem) {
        this.props.deleteItem(this.state.id);
      }
    }
  }

  render() {

    var windowWidth = window.innerWidth;

    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
      <FlatButton
        label={language().submit}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.save.bind(this)}
      />,
      <FlatButton
        label={language().schemas.deleteEntity}
        secondary={true}
        onTouchTap={this.deleteItem.bind(this)} />
    ];

    return (
      <div>
        {windowWidth > 1600 ? true : (
          <MuiThemeProvider >
            <FloatingActionButton onTouchTap={this.openRightDrawer.bind(this)} className="open-right-drawer-button" secondary={true}>
              <ChevronLeft className="chevron-left-open-right-drawer-button" />
              <ChevronRight className="chevron-right-open-right-drawer-button" style={{display: "none"}} />
            </FloatingActionButton>
          </MuiThemeProvider>
        )}
        <MuiThemeProvider>
          <Drawer
            width={300}
            containerClassName="properties"
            openSecondary={true}
            open={windowWidth > 1600 ? true : this.state.rightDrawer}
            containerStyle={windowWidth > 1600 ? {boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 6px inset, rgba(0, 0, 0, 0.12) 0px 1px 4px inset"} : {}} >
            <div>
              {this.props.newItem && (<MuiThemeProvider>
                <RaisedButton label={this.props.newButtonText} fullWidth={true} primary={true} onTouchTap={this.newItem.bind(this)} />
              </MuiThemeProvider>)}
              <MuiThemeProvider>
                <Menu value={this.props.activeItem} onChange={this.handleTouch.bind(this)} disableAutoFocus={true} >
                  {this.props.list.map((item)=>{
                    var itemId;
                    if (!item.id) {
                      itemId = item._id;
                    } else {
                      itemId = item.id;
                    }
                    return (
                      <MenuItem key={itemId}
                        value={itemId}
                        primaryText={item.name}

                        rightIcon={this.props.edit ? (
                          <IconButton onTouchTap={this.handleEditItem.bind(this, itemId)} style={{padding:0}} ><Create color={blue500} /></IconButton>
                        ) : (
                          <div></div>
                        )} />
                    );
                  })}
                </Menu>
              </MuiThemeProvider>
              <MuiThemeProvider>
                <Dialog title={this.props.dialogTitle} open={this.state.edit} actions={actions} >
                  {this.props.editDialog}
                </Dialog>
              </MuiThemeProvider>
            </div>
          </Drawer>
        </MuiThemeProvider>
      </div>
    );
  }
}
