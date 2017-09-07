
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";
import {Meteor} from "meteor/meteor";
import * as NavigationActions from "../../flux/actions/NavigationActions.js";
import json2csv from "json2csv";
import JSZip from "jszip";
import FileSaver from "file-saver";
import moment from "moment";

import ImportApp from "./ImportApp.jsx";
import NewApp from "./NewApp.jsx";

import Table, {TableBody, TableRow, TableCell} from "material-ui/Table";
import IconButton from "material-ui/IconButton";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Create from "material-ui-icons/Create";
import Done from "material-ui-icons/Done";

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

  deleteAccount() {
    Meteor.call("deleteUser");
  }

  newApp() {
    this.setState({newApp:true});
  }

  cancelNewApp() {
    this.setState({newApp:false});
  }

  apps() {
    var options = [];
    var apps = Apps.find().fetch();
    for (var i = 0; i < apps.length; i++) {
      options[i] = {};
      options[i].label = apps[i].name;
      options[i].value = apps[i].id;
    }
    return options;
  }

  data() {
    var user = Meteor.users.find().fetch()[0];
    if (user) {
      var app = Apps.find({id:user.selectedApp}).fetch()[0];
      if (app) {
        return {id:app.name};
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  render() {

    return (
      <div>
        <ImportApp
          open={this.state.importAppDialog}
          closeDialog={this.closeDialog.bind(this)} />
        <NewApp open={this.state.newApp} cancel={this.cancelNewApp.bind(this)} />
        <Table >
          <TableBody>
            <TableRow>
              <TableCell style={{textAlign:"right", borderBottom: "0px none"}} >
                {language().account.email}
              </TableCell>
              <TableCell style={{verticalAlign:"middle", borderBottom: "0px none"}}>
                {this.state.editEmail === false ? (
                  <div>{this.user() && this.user().emails[0].address}
                    <IconButton onClick={this.editEmail.bind(this)} ><Create color="primary" /></IconButton>
                  </div>
                ) : (
                  <div><TextField id="email" value={this.state.email} onChange={this.handleChange.bind(this)} />
                    <IconButton onClick={this.saveEmail.bind(this)} ><Done color="primary" /></IconButton>
                  </div>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{textAlign:"right", borderBottom: "0px none"}} >Télécharger les enregistrements</TableCell>
              <TableCell style={{borderBottom: "0px none"}} >
                <Button raised onClick={this.itemsToCSV.bind(this)} >
                  Télécharger
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{textAlign:"right", borderBottom: "0px none"}} >Télécharger la structure et les sections</TableCell>
              <TableCell style={{borderBottom: "0px none"}} >
                <Button raised onClick={this.appToCSV.bind(this)} >
                  Télécharger
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{textAlign:"right", borderBottom: "0px none"}} >Importer des fichiers</TableCell>
              <TableCell style={{borderBottom: "0px none"}}>
                <Button raised onClick={this.openImportApp.bind(this)} >
                  Importer
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{textAlign:"right", borderBottom: "0px none"}} >Supprimer le compte</TableCell>
              <TableCell style={{borderBottom: "0px none"}}>
                <Button raised onClick={this.deleteAccount.bind(this)} >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}
