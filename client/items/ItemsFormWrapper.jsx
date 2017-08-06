/*jshint esversion: 6 */
import React,{Component} from "react";
import ReactDOM from "react-dom";
import language from "../languages/languages.js";
import nav from "../stores/NavigationStore.js";
import moment from "moment";

import ItemsForm from "./ItemsForm.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";

// Component that render the form to create a new item
export default class ItemsFormWrapper extends Component {

  // Subscribe to userSchemas
  constructor(props) {
    super(props);

    this.openDialog = this.openDialog.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = {
      subscription: {
        schemas:Meteor.subscribe("userSchemas")
      },
      dialog: false,
      alert: false,
      dropdown: {},
      item: {}
    };
  }

  componentWillMount() {
    nav.on("new-item", this.openDialog);
  }

  // Stop the subscription of schemas
  componentWillUnmount() {
    this.state.subscription.schemas.stop();
    nav.removeListener("new-item", this.openDialog);
  }

  // Fetch Schemas collection
  schemas() {
    return Schemas.find().fetch();
  }

  openDialog() {
    var thisState = this.state;
    thisState.dialog = true;
    this.setState(thisState);
  }

  // Fetch the selected schema collection
  oneSchema() {
    var entity = Session.get("selected-entity");
    var query = {};
    query.entity = entity;
    return Schemas.find(query,{sort: {order:1}}).fetch();
  }

  handleChangeDropdown(id, type, event, index, value) {
    var item = this.state.item;
    item[id] = {};
    item[id].value = value;
    item[id].type = "dropdown";
    this.setState({item});
  }

  handleChange(id, type, event, value) {
    var item = this.state.item;
    item[id] = {};
    if (type === "number") {
      item[id].value = Number(value);
    } else {
      item[id].value = value;
    }
    item[id].type = type;
    this.setState({item});
  }

  handleAddTag(name, type, value) {
    var item = this.state.item;
    if (!item[name] || item[name] === {}) {
      item[name] = {};
      item[name].value = [];
    }
    item[name].value.push(value);
    item[name].type = type;
    this.setState(item);
  }

  handleDeleteTag(name, type, value, index) {
    var item = this.state.item;
    //item[name] = {};
    item[name].value.splice(index,1);
    item[name].type = type;
    this.setState(item);
  }

  // Create a new item
  newItem(event) {
    event.preventDefault();

    var item = this.state.item;
    var modifications = this.state.item;
    var history = {};
    history.item = {};
    var formFields = this.oneSchema();
    // Get value of each input of the form by their id
    /*for (var i = 0; i < formFields.length; i++) {

      item[formFields[i].name] = document.getElementById("item-form-" + formFields[i].name).value;
      var fieldValue = item[formFields[i].name];

      if(formFields[i].type == "number") {
        item[formFields[i].name] = Number(item[formFields[i].name]);
      } else if (formFields[i].type == "dropdown") {
        var dropdownId = Schemas.findOne({name:formFields[i].name});
        item[formFields[i].name] = this.state.dropdown[dropdownId.id];
      }
    }*/
    item.entity = Session.get("selected-entity");
    var double = Items.findOne(item);
    if (double) {
      this.setState({alert:true});
    } else {
      this.closeModal();
      Meteor.call("newItem",item, modifications);
    }
  }

  closeModal() {
    this.setState({dialog: false});
  }

  closeAlert() {
    this.setState({alert: false});
  }

  render() {

    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.closeModal}
      />,
      <FlatButton
        label={language().save}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.newItem.bind(this)}
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

    return (
      <div>
        <MuiThemeProvider>
          <Dialog
            title={language().items.newItem}
            actions={actions} open={this.state.dialog}
            onRequestClose={this.closeModal}
            autoScrollBodyContent={true} >
            <Table id="items-form-table" style={{color: "rgba(0, 0, 0, 0.870588)"}}>
              <TableBody>
                {// Show every entries of schema
                  this.oneSchema().map( (schema)=>{
                    return (<ItemsForm
                      key={schema.id}
                      schema={schema}
                      dropdown={this.state.dropdown}
                      handleChangeDropdown={this.handleChangeDropdown.bind(this, schema.name, schema.type)}
                      handleChange={this.handleChange.bind(this, schema.name, schema.type)}
                      item={this.state.item}
                      handleAddTag={this.handleAddTag.bind(this, schema.name, schema.type)}
                      handleDeleteTag={this.handleDeleteTag.bind(this, schema.name, schema.type)} />);
                  })}
              </TableBody>
            </Table>
          </Dialog>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Dialog
            actions={alert}
            open={this.state.alert}
          >
            Un article avec ces propriétés existe déjà.
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}
