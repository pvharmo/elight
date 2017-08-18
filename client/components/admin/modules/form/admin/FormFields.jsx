/*jshint esversion: 6 */
import React, {Component} from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";

import FormFieldSingle from "./FormFieldSingle.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";

Fields = new Mongo.Collection("fields");

export default class FormFieldsWrapper extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.handleChange.type = this.handleChange.bind(this, "type");
    this.handleChange.action = this.handleChange.bind(this, "action");
    this.handleChange.connection = this.handleChange.bind(this, "connection");
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCheck.total = this.handleCheck.bind(this, "total");
    this.handleCheck.form = this.handleCheck.bind(this, "form");
    this.handleCheck.list = this.handleCheck.bind(this, "list");
    this.handleCheck.required = this.handleCheck.bind(this, "required");

    this.state = {
      /*subscription: {
        schemas: Meteor.subscribe("userSchemas"),
        entities: Meteor.subscribe("appEntities"),
        fields: Meteor.subscribe("userFields")
      },*/
      name: "",
      total: false,
      form: false,
      list: false,
      required: false
    };
  }

  componentWillUnmount() {
    /*this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();
    this.state.subscription.fields.stop();*/
  }

  schemas() {
    return Schemas.find().fetch();
  }

  schemaFields() {
    var schema = this.opSchema();
    if (schema !== undefined) {
      return Schemas.find({schema:"Livres"}).fetch();
    } else {
      return [];
    }
  }

  distinctSchemas() {
    var schemasArray =[];
    for (var i = 0; i < this.schemas().length; i++) {
      schemasArray.push(this.schemas()[i].schema);
    }
    return _.uniq(schemasArray);
  }

  // Creates a new field
  addFormField(event) {
    var moduleParams = Modules.findOne({id: this.props.id}).params;
    var total = this.state.total;
    var form = this.state.form;
    var list = this.state.list;
    var requiredField = this.state.required;
    var name = this.state.name;
    var type = this.state.type;
    var action = this.state.action;
    var connection = this.state.connection;
    var page = Session.get("selected-page");
    var entity = Schemas.findOne({id:connection}).entity;
    var order = 1;

    var lastField = Fields.findOne({module:this.props.id},{sort:{order:-1}});

    if (lastField) {
      order = lastField.order + 1;
    }

    var field = {
      total: total,
      form: form,
      list: list,
      required: requiredField,
      name: name,
      type: type,
      action: action,
      fieldConnection: connection,
      fieldConnectionEntity: entity,
      page: page,
      order: order,
      module: this.props.id
    };

    // Call the method on the server to create the new field
    Meteor.call("newField", field, ()=>{
      this.setState({total:false, form:false, list:false, name:"", type:"", action:"", connection:""});
    });
  }

  handleChange(dropdown, event, index, value) {
    var newState = {};
    newState = this.state;
    newState[dropdown] = value;
    this.setState(newState);
  }

  handleTextChange(event, value) {
    this.setState({name:value});
  }

  handleCheck(checkbox, event, value) {
    var newState = {};
    newState = this.state;
    newState[checkbox] = value;
    this.setState(newState);
  }

  menuItems(schema) {
    return [
      <div key={schema} >
        <div style={{textAlign: "right",color: "rgba(0,0,0,0.6)",height: "17px",fontSize: "11px"}}>{schema}</div>
      </div>
    ];
  }

  fields() {
    return Fields.find({module:this.props.id}, {sort:{order:1}}).fetch();
  }

  render() {
    var headerStyle={fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500};
    var headerStyleCheckbox={fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500, width: "60px", paddingLeft: "5px", paddingRight: "5px"};
    var styleCheckbox={width: "60px", paddingLeft: "5px", paddingRight: "5px", textAlign: "center"};

    return (
      <div id="operator-fields-list">
        <MuiThemeProvider>
          <Table className="operators" selectable={false} >
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{borderBottom: "2px solid rgba(0,0,0,0.5)"}} >
              <TableRow>
                {/*<TableHeaderColumn style={headerStyleCheckbox}>{language().showTotal}</TableHeaderColumn>
                <TableHeaderColumn style={headerStyleCheckbox}>{language().showInForm}</TableHeaderColumn>
                <TableHeaderColumn style={headerStyleCheckbox}>{language().showInList}</TableHeaderColumn>*/}
                <TableHeaderColumn style={headerStyleCheckbox}>{language().required}</TableHeaderColumn>
                <TableHeaderColumn style={headerStyle}>{language().name}</TableHeaderColumn>
                <TableHeaderColumn style={headerStyle}>{language().type}</TableHeaderColumn>
                <TableHeaderColumn style={headerStyle}>{language().action}</TableHeaderColumn>
                <TableHeaderColumn style={headerStyle}>{language().fieldConnection}</TableHeaderColumn>
                <TableHeaderColumn style={headerStyle}>{language().order}</TableHeaderColumn>
                <TableHeaderColumn style={headerStyle}>{language().edit}</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} >
              {this.fields().map( (field)=>{
                return (<FormFieldSingle key={field.id} field={field} id={this.props.id} />);
              })}
              <TableRow hoverable={true}>
                {/*<TableRowColumn style={styleCheckbox} ><Checkbox checked={this.state.total} onCheck={this.handleCheck.total} /></TableRowColumn>
                <TableRowColumn style={styleCheckbox} ><Checkbox checked={this.state.form} onCheck={this.handleCheck.form} /></TableRowColumn>
                <TableRowColumn style={styleCheckbox} ><Checkbox checked={this.state.list} onCheck={this.handleCheck.list} /></TableRowColumn>*/}
                <TableRowColumn style={styleCheckbox} ><Checkbox checked={this.state.required} onCheck={this.handleCheck.required} /></TableRowColumn>
                <TableRowColumn className="name-field">
                  <TextField
                    type={"text"}
                    id={"new-field-name"}
                    placeholder="New field's name"
                    value={this.state.name}
                    onChange={this.handleTextChange} />
                </TableRowColumn>
                <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  <DropDownMenu value={this.state.type} onChange={this.handleChange.type} >
                    <MenuItem value={"text"} primaryText={language().dataType.text} />
                    <MenuItem value={"textarea"} primaryText={language().dataType.textarea} />
                    <MenuItem value={"number"} primaryText={language().dataType.number} />
                    <MenuItem value={"date"} primaryText={language().dataType.date} />
                    <MenuItem value={"checkbox"} primaryText={language().dataType.checkbox} />
                    {/*<MenuItem value={"dropdown"} primaryText={language().dataType.dropdown} />*/}
                  </DropDownMenu>
                </TableRowColumn>
                <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  <DropDownMenu value={this.state.action} onChange={this.handleChange.action} >
                    <MenuItem value={"search"} primaryText="Recherche" />
                    <MenuItem value={"add"} primaryText="Ajouter" />
                    <MenuItem value={"substract"} primaryText="Soustraire" />
                    <MenuItem value={"multiply"} primaryText="Multiplier" />
                    <MenuItem value={"divide"} primaryText="Diviser" />
                    <MenuItem value={"modify"} primaryText="Modifier" />
                  </DropDownMenu>
                </TableRowColumn>
                <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  <DropDownMenu value={this.state.connection} onChange={this.handleChange.connection} >
                    {this.schemas().map((field)=>{
                      return (<MenuItem
                        key={field.id}
                        value={field.id}
                        children={this.menuItems(field.entityName)}
                        primaryText={field.name} />);
                    })}
                  </DropDownMenu>
                </TableRowColumn>
                <TableRowColumn></TableRowColumn>
                <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  <FloatingActionButton onTouchTap={this.addFormField.bind(this)} mini={true}>
                    <ContentAdd />
                  </FloatingActionButton>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </MuiThemeProvider>
      </div>
    );
  }

}
