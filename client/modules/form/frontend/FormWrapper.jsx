/*jshint esversion: 6 */
import React, {Component} from "react";
import ReactDOM from "react-dom";
import language from "../../../languages/languages.js";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import SingleField from "./SingleField.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Card, CardActions, CardHeader, CardText, CardMedia} from "material-ui/Card";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Snackbar from "material-ui/Snackbar";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import FloatingActionButton from "material-ui/FloatingActionButton";
import IconButton from "material-ui/IconButton";
import Done from "material-ui/svg-icons/action/done";
import Clear from "material-ui/svg-icons/content/clear";

//Operators = new Mongo.Collection("operators");

export default class FormWrapper extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.updateInput = this.updateInput.bind(this);
    this.AutoCompleteData = this.AutoCompleteData.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      subscription: {
        schemas: Meteor.subscribe("userSchemas"),
        fields: Meteor.subscribe("userFields"),
        items: Meteor.subscribe("userItems")
      },
      item: {},
      query: {},
      openSnackbar: false,
      requiredFields: {},
      error: {}
    };
  }

  componentWillUnmount() {
    this.state.subscription.schemas.stop();
    this.state.subscription.fields.stop();
    this.state.subscription.items.stop();
  }

  fields() {
    return Fields.find({module:this.props.module.id}).fetch();
  }

  items() {
    return Items.find().fetch();
  }

  updateInput(text, connection, field) {
    var newStateItem = this.state.item;
    var query = this.state.query;
    newStateItem[field] = text;
    query[connection + ".value"] = {$regex: ".*" + text + ".*", $options:"i"};
    this.setState({item:newStateItem, query:query});
  }

  AutoCompleteData(fieldConnection) {
    var _this = this;
    var query = {};
    if (this.state.fieldConnection !== "") {
      query[this.state.fieldConnection] = this.state.searchText;
      query.schema = this.state.schemaConnection;
    }
    var itemsArray = [];
    var items = Items.find(this.state.query).fetch();

    for (var i = 0; i < items.length; i++) {
      itemsArray[i] = items[i][fieldConnection];
      /*itemsArray[i] = (<MenuItem PrimaryText={items[i][fieldConnection]}
        children={<div key={items[i][fieldConnection]} ><div style={{textAlign: "right",color: "rgba(0,0,0,0.6)",height: "17px",fontSize: "11px"}}>{items[i][fieldConnection]}</div></div>} />);*/
    }



    //_.uniq(itemsArray,function(item, key) {return item[_this.props.operator.schemaField];});

    return _.uniq(itemsArray);
  }

  handleChange(field, value) {
    var newState = this.state.item;
    newState[field] = value;
    this.setState({item:newState});
  }

  confirm() {
    var _this = this;
    var search = {};
    var modificationsQuery = {};
    var item = {};
    var modifications = {};

    var module = Modules.findOne({page:Pages.findOne({id:this.props.id}).name});
    var error = {};
    var errorBool = false;
    for (var i = 0; i < this.fields().length; i++) {
      if (this.fields()[i].required && this.state.item[this.fields()[i].id] === "" || this.state.item[this.fields()[i].id] === undefined ) {
        error[this.fields()[i].id] = true;
        this.setState({error});
        errorBool = true;
      }
    }
    if (!errorBool) {
      var fieldConnection;
      switch (this.props.module.params.action) {
      case "create-item":
        for (var x = 0; x < this.fields().length; x++) {
          fieldConnection = Schemas.findOne({id:this.fields()[x].fieldConnection});
          modificationsQuery[fieldConnection.name] = this.state.item[this.fields()[x].id];
        }
        Meteor.call("createItem", search, modificationsQuery);
        break;

      case "delete-item":
        if (search !== {}) {
          Meteor.call("deleteItem", search, modificationsQuery);
        } else {
          alert("You must fill at least one field to remove an item");
        }
        break;

      case "modify-item":
      default:
        for (var y = 0; y < this.fields().length; y++) {
          fieldConnection = Schemas.findOne({id:this.fields()[y].fieldConnection});
          var field = fieldConnection.name + ".value";
          switch (this.fields()[y].action) {
          case "search":
            search[field] = this.state.item[this.fields()[y].id];
            search.entity = fieldConnection.entity;
            break;

          case "add":
            if (modificationsQuery.$inc === undefined) {
              modificationsQuery.$inc = {};
            }
            modificationsQuery.$inc[field] = Number(this.state.item[this.fields()[y].id]);
            modifications[fieldConnection.name] = {};
            modifications[fieldConnection.name].value = Number(this.state.item[this.fields()[y].id]);
            modifications[fieldConnection.name].type = fieldConnection.type;
            modifications[fieldConnection.name].operation = "add";
            break;

          case "substract":
            if (modificationsQuery.$inc === undefined) {
              modificationsQuery.$inc = {};
            }
            modificationsQuery.$inc[field] = -Number(this.state.item[this.fields()[y].id]);
            modifications[fieldConnection.name] = {};
            modifications[fieldConnection.name].value = -Number(this.state.item[this.fields()[y].id]);
            modifications[fieldConnection.name].type = fieldConnection.type;
            modifications[fieldConnection.name].operation = "substract";
            break;

          case "multiply":
            if (modificationsQuery.$mul === undefined) {
              modificationsQuery.$mul = {};
            }
            modificationsQuery.$mul[field] = this.state.item[this.fields()[y].id];
            modifications[fieldConnection.name] = {};
            modifications[fieldConnection.name].value = Number(this.state.item[this.fields()[y].id]);
            modifications[fieldConnection.name].type = fieldConnection.type;
            modifications[fieldConnection.name].operation = "multiply";
            break;

          case "divide":
            if (modificationsQuery.$mul === undefined) {
              modificationsQuery.$mul = {};
            }
            modificationsQuery.$mul[field] = 1/this.state.item[this.fields()[y].id];
            modifications[fieldConnection.name] = {};
            modifications[fieldConnection.name].value = Number(this.state.item[this.fields()[y].id]);
            modifications[fieldConnection.name].type = fieldConnection.type;
            modifications[fieldConnection.name].operation = "divide";
            break;

          case "modify":
            if (modificationsQuery.$set === undefined) {
              modificationsQuery.$set = {};
            }
            modificationsQuery.$set[field] = this.state.item[this.fields()[y].id];
            modifications[fieldConnection.name] = {};
            modifications[fieldConnection.name].value = this.state.item[this.fields()[y].id];
            modifications[fieldConnection.name].type = fieldConnection.type;
            modifications[fieldConnection.name].operation = "modify";
            break;

          default:
          }
        }
        Meteor.call("modifyItem", search, modificationsQuery, this.props.module.params.autocreate, modifications);
        break;
      }

      var fields = this.fields();

      for (var z = 0; z < fields.length; z++) {
        switch (fields[z].type) {
        case "date":
          item[fields[z].id] = null;
          break;
        case "tags":
          item[fields[z].id] = [];
          break;
        default:
          item[fields[z].id] = "";
        }
      }
      this.setState({item:item,query:{},openSnackbar:true});

      setTimeout(function(){
        _this.setState({openSnackbar:false});
      }, 4000);
    }
  }

  cancel() {
    this.setState({item:{},query:{}});
  }

  render() {

    return (
      <div>
        <MuiThemeProvider>
          <Card style={{width: "99%", margin: "1% auto"}} >
            <CardHeader
              title={this.props.module.name}
              titleStyle={{fontWeight: "400", fontSize: "24px"}}
              style={{paddingBottom: "8px"}}
            />
          <CardText style={{paddingTop: "8px"}} >
              <Table selectable={false} >
                <TableBody displayRowCheckbox={false} >
                  {this.fields().map((field,i)=>{
                    var fieldConnection = Schemas.find({id:field.fieldConnection}).fetch()[0];
                    return (<SingleField
                      key={field.id}
                      field={field}
                      fieldConnection={fieldConnection}
                      updateInput={this.updateInput}
                      item={this.state.item}
                      error={this.state.error[field.id]}
                      searchText={this.state.item[field.id]}
                      data={this.AutoCompleteData}
                      handleChange={this.handleChange} />);
                  })}
                  <TableRow>
                    <TableRowColumn style={{textAlign:"right"}} >{language().confirm}</TableRowColumn>
                    <TableRowColumn>
                      <RaisedButton onTouchTap={this.confirm} primary={true} icon={<Done />} />
                      <RaisedButton onTouchTap={this.cancel} secondary={true} icon={<Clear />} style={{marginLeft:"15px"}} />
                    </TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </CardText>
          </Card>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Snackbar
            open={this.state.openSnackbar}
            style={{textAlign:"center"}}
            bodyStyle={{minWidth:"60px"}}
            message={<Done color="#FFF" style={{marginTop: "10px"}} />}
          />
        </MuiThemeProvider>
      </div>
    );
  }

}
