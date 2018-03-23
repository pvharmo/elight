
import React, {Component} from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";
import formStore from "/client/flux/stores/formStore.js";

import FormFieldSingle from "./FormFieldSingle.jsx";
import Form from "/client/components/FormGenerator/Form.jsx";

import Dialog, {DialogActions, DialogContent, DialogTitle} from "material-ui/Dialog";
import List from "material-ui/List";
import Button from "material-ui/Button";

Fields = new Mongo.Collection("fields");

export default class FormFieldsWrapper extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.state = {
      dialog: false,
      edit: false
    };
  }

  schemas() {
    return Schemas.find().fetch();
  }

  fields() {
    return Fields.find({module:this.props.id}, {sort:{order:1}}).fetch();
  }

  newField() {
    this.setState({dialog: true, edit: false});
  }

  data() {
    if (this.state.edit) {
      return this.state.field;
    } else {
      return {};
    }
  }

  edit(field) {
    this.setState({dialog: true, edit: true, field});
  }

  save() {
    Meteor.call("newFormField", formStore.getData(), this.props.id);
    this.cancel();
  }

  delete() {
    Meteor.call("deleteFormField", this.state.field.id);
    this.cancel();
  }

  cancel() {
    this.setState({dialog:false});
  }

  connection() {
    var options = [];
    for (var i = 0; i < this.schemas().length; i++) {
      options[i] = {};
      options[i].value = this.schemas()[i].id;
      options[i].label = this.schemas()[i].name;
    }
    return options;
  }

  render() {
    const fields = [
      {type: "checkbox", name: "required", label: language().required},
      {type: "text", name: "name", label: language().name},
      {type: "dropdown", name: "type", label: language().type, options: [
        {value: "text", label: language().dataType.text},
        {value: "textarea", label: language().dataType.textarea},
        {value: "number", label: language().dataType.number},
        {value: "date", label: language().dataType.date},
        {value: "checkbox", label: language().dataType.checkbox},
        {value: "dropdown", label: language().dataType.dropdown}
      ]},
      {type: "dropdown", name: "action", label: language().action, options:[
        {value: "search", label: "Recherche"},
        {value: "modify", label: "Modifier"},
        {value: "add", label: "Ajouter"},
        {value: "substract", label: "Soustraire"},
        {value: "multiply", label: "Multiplier"},
        {value: "divide", label: "Diviser"},
      ]},
      {type: "dropdown", name: "connection", label: language().fieldConnection, options:this.connection()}
    ];

    return (
      <div>
        <List>
          {this.fields().map( (field)=>{
            return (<FormFieldSingle key={field.id} field={field} id={this.props.id} edit={this.edit.bind(this)} />);
          })}
        </List>
        <Button onClick={this.newField.bind(this)}>
          Ajouter un champ
        </Button>
        <Dialog open={this.state.dialog} onRequestClose={this.cancel.bind(this)} >
          <DialogTitle>Ajouter un champ</DialogTitle>
          <DialogContent>
            <Form fields={fields} data={this.data()} />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={this.cancel.bind(this)} >
              {language().cancel}
            </Button>
            {this.state.edit &&
              <Button
                color="secondary"
                onClick={this.delete.bind(this)} >
                {language().delete}
              </Button>
            }
            <Button
              color="primary"
              onClick={this.save.bind(this)} >
              {language().save}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
