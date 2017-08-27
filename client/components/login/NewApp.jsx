
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";
import formStore from "/client/flux/stores/formStore.js";

import Form from "/client/components/FormGenerator/Form.jsx";

import Dialog, {DialogActions, DialogContent, DialogTitle} from "material-ui/Dialog";
import Table, {TableBody, TableRow, TableCell} from "material-ui/Table";
import IconButton from "material-ui/IconButton";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Create from "material-ui-icons/Create";
import Done from "material-ui-icons/Done";

export default class Account extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.state = {};
  }

  save() {
    var app = formStore.getData("newApp").name;
    console.log(app);
    Meteor.call("newApp", app);
    this.cancel();
  }

  delete() {

  }

  cancel() {
    this.props.cancel();
  }

  render() {

    const fields = [
      {type: "text", name: "name", label: "Nom"}
    ];

    return (
      <Dialog open={this.props.open} onRequestClose={this.cancel.bind(this)} >
        <DialogTitle>
          Nouvelle application
        </DialogTitle>
        <DialogContent>
          <Form formId="newApp" fields={fields} data={{}} />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={this.cancel.bind(this)} >
            {language().cancel}
          </Button>
          {this.state.editEntity &&
            <Button
              color="accent"
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
    );
  }
}
