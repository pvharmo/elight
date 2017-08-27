/*jshint esversion: 6 */
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";
import { Meteor } from "meteor/meteor";
import * as NavigationActions from "../../flux/actions/NavigationActions.js";
import nav from "../../flux/stores/NavigationStore.js";
import json2csv from "json2csv";
import JSZip from "jszip";
import FileSaver from "file-saver";
import Papa from "babyparse";
import {moment} from "moment";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Table, {TableBody, TableRow, TableCell} from "material-ui/Table";
import IconButton from "material-ui/IconButton";
import Dialog, {DialogActions, DialogContent, DialogTitle} from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";

export default class ImportApp extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.import = this.import.bind(this);
    this.cancel = this.cancel.bind(this);

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
      email: ""
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

  import() {
    var items = {};
    var reader = new FileReader();
    var fileItems = document.getElementById("file-items").files[0];
    /*var filesApp = document.getElementById("files-app").files[0];

    if (filesApp) {
      JSZip.loadAsync(filesApp).then(function(zip) {
        return zip.files["Entities.csv"].async("text");
      }).then(function (content) {
        console.log(content);
      });
      Meteor.call("importApp");
    }*/

    if (fileItems) {
      reader.readAsText(fileItems, "UTF-8");
      reader.onloadend = () => {
        var result = reader.result;
        var lines = result.split("\n");
        var items = [];
        var keys = lines[0].split(";");

        for (var i = 1; i < lines.length; i++) {
          if (lines[i] !== "") {
            var rawValues = lines[i].split(";");
            var values = [];
            for (var j = 0; j < rawValues.length; j++) {
              switch (rawValues[j]) {
              case "":
                values[j] = "";
                break;
              case "true":
                values[j] = true;
                break;
              case "false":
                values[j] = false;
                break;
              case (rawValues[j].match(/^[0-9]*$/) || {}).input:
                values[j] = Number(rawValues[j]);
                break;
              case (rawValues[j].match(/\[\{/ && /\}\]/) || {}).input:
                values[j] = JSON.parse(rawValues[j]);
                break;
              case (rawValues[j].match(/\[/ && /\]/) || {}).input:
                var val = rawValues[j].match(/\"(.*?)\"/g);
                values[j] = [];
                for (var k = 0; k < val.length; k++) {
                  values[j][k] = val[k].slice(1,-1);
                }
                break;
              case (rawValues[j].match(/{/ && /}/) || {}).input:
                values[j] = JSON.parse(rawValues[j]);
                break;
              default:
                values[j] = rawValues[j];
                console.log(values[j]);
              }
            }
            items[i-1] = values;
          }
        }
        Meteor.call("importItems", keys, items);
      };
    }
    this.cancel;
  }

  cancel() {
    this.props.closeDialog();
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onRequestClose={this.cancel} >
        <DialogTitle>
          Importer
        </DialogTitle>
        <Table >
          <TableBody >
            <TableRow style={{borderBottom: "0px none"}} >
              <TableCell  style={{textAlign:"right"}} >Importer des articles</TableCell>
              <TableCell >
                <input id="file-items" type="file" />
              </TableCell>
            </TableRow>
            {/*<TableRow style={{borderBottom: "0px none"}} >
              <TableCell  style={{textAlign:"right"}} >Importer une application</TableCell>
              <TableCell >
                <input id="files-app" type="file" />
              </TableCell>
            </TableRow>*/}
          </TableBody>
        </Table>
        <DialogActions>
          <Button onClick={this.cancel}>
            {language().cancel}
          </Button>
          <Button onClick={this.import}>
            {language().confirm}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
