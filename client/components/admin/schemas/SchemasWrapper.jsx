
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../../languages/languages.js";
import nav from "../../../flux/stores/NavigationStore.js";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";

import SchemaSingle from "./SchemaSingle.jsx";
import TopToolbar from "./TopToolbar.jsx";
import RightDrawer from "../rightDrawer/RightDrawer.jsx";
import SchemasRightDrawer from "./SchemasRightDrawer";

import { Scrollbars } from "react-custom-scrollbars";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import IconButton from "material-ui/IconButton";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import ArrowDropDown from "material-ui/svg-icons/navigation/arrow-drop-down";
import ArrowDropUp from "material-ui/svg-icons/navigation/arrow-drop-up";

export default class SchemasWrapper extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.openNewSchemaDialog = this.openNewSchemaDialog.bind(this);
    this.cancelNewSchema = this.cancelNewSchema.bind(this);
    this.newSchema = this.newSchema.bind(this);
    this.handleChangeNewSchema = this.handleChangeNewSchema.bind(this);

    nav.on("new-schema", this.openNewSchemaDialog);

    this.state = {
      subscription: {
        schemas: Meteor.subscribe("userSchemas"),
        entities: Meteor.subscribe("userEntities")
      },
      dropdown: [0],
      newSchemaDialog: false,
      newSchemaName: "",
      alert: false,
      editSchemaText: ""
    };
  }

  componentWillUnmount() {
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();

    nav.removeListener("new-schema", this.openNewSchemaDialog);
  }

  selectSchema(schema) {
    Session.set("selected-entity", schema);
  }

  oneSchema() {
    return Schemas.find({entity: Session.get("selected-entity")},{sort: {order:1}}).fetch();
  }

  openNewSchemaDialog() {
    this.setState({newSchemaDialog: true});
  }

  cancelNewSchema() {
    this.setState({newSchemaDialog: false});
  }

  handleChangeNewSchema(event, value) {
    this.setState({newSchemaName: value});
  }

  newSchema() {
    var schemaName = this.state.newSchemaName;

    var double = Entities.findOne({name: schemaName});

    if (double) {
      this.setState({alert:true});
    } else {
      Meteor.call("newSchema", schemaName);
      this.setState({newSchemaDialog: false});
      this.setState({newSchemaName: ""});

      NavigationActions.newSchemaUpdate();
    }
  }

  // Creates a new field
  addField(event) {
    event.defaultPrevented;
    event.preventDefault();
    var text = this.refs.fieldName.value.trim();
    var type = this.refs.fieldType.value.trim();
    var schema = Session.get("selected-entity-name");
    var thisRefs = this.refs;
    var thisState = this.state;
    var params = {};
    switch (type) {
    case "number":
      var step = thisRefs.step.value.trim();
      var min = thisRefs.minNumber.value.trim();
      var max = thisRefs.maxNumber.value.trim();
      params = {
        step:step,
        min:min,
        max:max
      };
      break;
    case "dropdown":
      var dropdown = [];
      for (var i = 0; i < thisState.dropdown.length; i++) {
        var x = "dropdown-" + i;
        dropdown[i] = thisRefs[x].value.trim();
      }
      params = dropdown;
      break;
    default:
      params = {};
    }
    // Call the method on the server to create the new field
    Meteor.call("addField", text, type, schema, params, ()=>{
      this.refs.fieldName.value = "";
      this.refs.fieldType.value = "";
    });
  }

  closeAlert() {
    this.setState({alert:false});
  }

  render() {
    var stripState = true;
    var height = window.innerHeight - 199;

    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.cancelNewSchema}
      />,
      <FlatButton
        label={language().save}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.newSchema}
      />,
    ];

    const alert = [
      <FlatButton
        label={language().close}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.closeAlert.bind(this)}
      />
    ];

    var style = {};

    if (window.innerWidth > 1600) {
      style.paddingRight = "300px";
      style.width = window.innerWidth - 500;
    }

    return (
      <div className="row" style={style} >
        <TopToolbar />
        <SchemasRightDrawer />
        <div id="schema-fields-list">
          <MuiThemeProvider>
            <Dialog title={language().schemas.newEntity} open={this.state.newSchemaDialog} actions={actions} >
              <TextField hintText={language().schemas.newEntityName} onChange={this.handleChangeNewSchema} />
            </Dialog>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Dialog
              actions={alert}
              open={this.state.alert} >
              Ce schéma existe déjà.
            </Dialog>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{borderBottom: "2px solid rgba(0,0,0,0.5)"}} >
                <TableRow>
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500, width: 44}} >
                    {language().schemas.list.showInList}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                    {language().schemas.list.name}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                    {language().schemas.list.type}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                    {language().schemas.list.order}
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
                <TableBody>
                  {this.oneSchema().map( (schema)=>{
                    stripState = !stripState;
                    return (<SchemaSingle key={schema.id} stripState={stripState} schema={schema} />);
                  })}
                </TableBody>
              </Table>
            </MuiThemeProvider>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
