/*jshint esversion: 6 */
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";
import { Meteor } from "meteor/meteor";
import * as NavigationActions from "../actions/NavigationActions.js";
import nav from "../stores/NavigationStore.js";
import json2csv from "json2csv";
import JSZip from "jszip";
import FileSaver from "file-saver";
import moment from "moment";

import AccountRightDrawer from "./AccountRightDrawer.jsx";
import ImportApp from "./ImportApp.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {cyan50, red500, blue500} from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import Dialog from "material-ui/Dialog";
import Toggle from "material-ui/Toggle";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import Create from "material-ui/svg-icons/content/create";
import Done from "material-ui/svg-icons/action/done";

User = new Mongo.Collection("user");
Apps = new Mongo.Collection("apps");

export default class Account extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.handleToggle = this.handleToggle.bind(this);

    this.state = {
      subscription: {
        user: Meteor.subscribe("user"),
        entities: Meteor.subscribe("appEntities"),
        fields: Meteor.subscribe("appFields"),
        items: Meteor.subscribe("appItems"),
        modules: Meteor.subscribe("appModules"),
        schemas: Meteor.subscribe("appSchemas"),
        apps: Meteor.subscribe("userApps")
      },
      editEmail: false,
      email: "",
      toggle: nav.getUser().admin,
      importAppDialog: false
    };
  }

  componentWillUnmount() {
    this.state.subscription.user.stop();
    this.state.subscription.apps.stop();
    this.state.subscription.items.stop();
    this.state.subscription.modules.stop();
    this.state.subscription.schemas.stop();
  }

  user() {
    return Meteor.users.find().fetch()[0];
  }

  editEmail() {
    this.setState({editEmail:true, email: this.user().emails[0].address});
  }

  saveEmail() {
    Meteor.call("changeEmail", this.state.email);
    this.setState({editEmail:false});
  }

  handleChange(event, value) {
    this.setState({email: value});
  }

  handleToggle(event, value) {
    NavigationActions.adminRights(value);
    Session.set("admin-rights", value);
    this.setState({toggle:value});
  }

  itemsToCSV() {
    var content = this.toCSV(Items.find().fetch());
    var file = new File([content], "Items.csv", {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(file);
  }

  toCSV(collection) {
    var text = "";
    var keys = "";
    var keysArray = [];
    for (var key in collection[0]) {
      if (key !== "_id") {
        keysArray.push(key);
        keys += (key + ";");
      }
    }
    for (var i = 0; i < collection.length; i++) {
      var line = "";
      for (var j = 0; j < keysArray.length; j++) {
        if (collection[i][keysArray[j]] !== "_id") {
          if (collection[i][keysArray[j]] === null || undefined) {
            line += "null;";
          } else if (typeof collection[i][keysArray[j]] === "object") {
            if (typeof collection[i][keysArray[j]].getMonth === "function") {
              var m = moment(collection[i][keysArray[j]]);
              line += m.format();
            } else {
              line += (JSON.stringify(collection[i][keysArray[j]]) + ";");
            }
          } else {
            line += (collection[i][keysArray[j]] + ";");
          }
        }
      }
      text += line.slice(0,-1);
      if (i < collection.length-1) {
        text += "\n";
      }
    }
    var header = keys.slice(0, -1);
    header += "\n";
    return header + text;
  }

  appToCSV() {
    var zip = new JSZip();
    var entities = this.toCSV(Entities.find().fetch());
    var schemas = this.toCSV(Schemas.find().fetch());
    var pages = this.toCSV(Pages.find().fetch());
    var modules = this.toCSV(Modules.find().fetch());
    var fields = this.toCSV(Fields.find().fetch());
    zip.file("Entities.csv", entities);
    zip.file("Schemas.csv", schemas);
    zip.file("Pages.csv", pages);
    zip.file("Modules.csv", modules);
    zip.file("Fields.csv", fields);
    zip.generateAsync({type:"blob"}).then(function(content) {
      FileSaver.saveAs(content, "application.zip");
    });
  }

  openImportApp() {
    this.setState({importAppDialog: true});
  }

  closeDialog() {
    this.setState({importAppDialog: false});
  }

  render() {
    return (
      <div>
        <AccountRightDrawer />
        <ImportApp
          open={this.state.importAppDialog}
          closeDialog={this.closeDialog.bind(this)} />
        <MuiThemeProvider>
          <Table selectable={false} >
            <TableBody displayRowCheckbox={false} >
              <TableRow style={{borderBottom: "0px none"}} >
                <TableRowColumn style={{textAlign:"right"}} >
                  {language().account.email}
                </TableRowColumn>
                <TableRowColumn style={{verticalAlign:"middle"}}>
                  {this.state.editEmail === false ? (
                    <div>{this.user() && this.user().emails[0].address}
                    <IconButton onTouchTap={this.editEmail.bind(this)} ><Create color={blue500} /></IconButton></div>
                  ) : (
                    <div><TextField id="email" value={this.state.email} onChange={this.handleChange.bind(this)} />
                    <IconButton onTouchTap={this.saveEmail.bind(this)} ><Done color={blue500} /></IconButton></div>
                  )}
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "0px none"}} >
                <TableRowColumn style={{textAlign:"right"}} >M'accorder les droits d'administrateur pour 5 minutes</TableRowColumn>
                <TableRowColumn>
                  <Toggle toggled={this.state.toggle} onToggle={this.handleToggle} />
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "0px none"}} >
                <TableRowColumn style={{textAlign:"right"}} >Télécharger les articles</TableRowColumn>
                <TableRowColumn>
                  <RaisedButton label={"Télécharger"} onTouchTap={this.itemsToCSV.bind(this)} />
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "0px none"}} >
                <TableRowColumn style={{textAlign:"right"}} >Télécharger l'application (à l'exception des articles)</TableRowColumn>
                <TableRowColumn>
                  <RaisedButton label={"Télécharger"} onTouchTap={this.appToCSV.bind(this)} />
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "0px none"}} >
                <TableRowColumn style={{textAlign:"right"}} >Importer des fichiers</TableRowColumn>
                <TableRowColumn>
                  <RaisedButton label={"Importer"} onTouchTap={this.openImportApp.bind(this)} />
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </MuiThemeProvider>
      </div>
    );
  }
}
