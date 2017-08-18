import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../../languages/languages.js";

import UsersRow from "./Row.jsx";

import { Scrollbars } from "react-custom-scrollbars";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {Tabs, Tab} from "material-ui/Tabs";
import IconButton from "material-ui/IconButton";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import Checkbox from "material-ui/Checkbox";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import ArrowDropDown from "material-ui/svg-icons/navigation/arrow-drop-down";
import ArrowDropUp from "material-ui/svg-icons/navigation/arrow-drop-up";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";

export default class Wrapper extends TrackerReact(React.Component) {
  constructor() {
    super();

    this.state = {
      subscription: {
        usersList: Meteor.subscribe("usersList")
      },
      alert: false
    };
  }

  users() {
    return Meteor.users.find().fetch();
  }

  editState() {

  }

  render() {
    var stripState = true;
    var height = window.innerHeight - 199;

    const alert = [
      <FlatButton
        label={language().close}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.editState.bind(this, {alert: false})}
      />
    ];

    var style = {};

    if (window.innerWidth > 1600) {
      style.paddingRight = "300px";
      style.width = window.innerWidth - 500;
    }

    return (
      <div>
        <MuiThemeProvider>
          <Dialog
            actions={alert}
            open={this.state.alert} >
            Cet utilisateur existe déjà.
          </Dialog>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{borderBottom: "2px solid rgba(0,0,0,0.5)"}} >
              <TableRow>
                <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                  Utilisateurs
                </TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                  {language().schemas.list.edit}
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
          </Table>
        </MuiThemeProvider>
        <Scrollbars style={{width: "100%", height}} >
          <MuiThemeProvider>
            <Table>
              <TableBody displayRowCheckbox={false} selectable={false} >
                {this.users().map( (user)=>{
                  stripState = !stripState;
                  return (
                    <UsersRow
                      key={user._id}
                      stripState={stripState}
                      openUserDialog={this.editState.bind(this, {editRole: true, user})}
                      user={user} />
                  );
                })}
              </TableBody>
            </Table>
          </MuiThemeProvider>
        </Scrollbars>
      </div>
    );
  }
}
