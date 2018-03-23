
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "/client/languages/languages.js";
import * as adminActions from "/client/flux/actions/adminActions.js";
import adminStore from "/client/flux/stores/adminStore.js";
import formStore from "/client/flux/stores/formStore.js";

import Form from "../../FormGenerator/Form.jsx";

import {grey} from "material-ui/colors";
import Typography from "material-ui/Typography";
import Dialog, {DialogActions, DialogContent, DialogTitle} from "material-ui/Dialog";
import Toolbar from "material-ui/Toolbar";
import Menu, {MenuItem} from "material-ui/Menu";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import ContentAdd from "material-ui-icons/Add";
import Create from "material-ui-icons/Create";

export default class RolesTopToolbar extends TrackerReact(React.Component) {
  constructor() {
    super();

    this.edit = this.edit.bind(this);

    adminStore.on("edit-role", this.edit);

    this.state = {
      subscription: {
        roles: Meteor.subscribe("appRoles"),
      },
      editRole: false,
      alert: false
    };
  }

  roles() {
    return Roles.find().fetch();
  }

  new() {
    this.setState({edit: false, dialog: true, dialogTitle: "Nouveau rôle"});
  }

  edit() {
    this.setState({edit: true, dialog: true, dialogTitle: "Éditer le rôle"});
  }

  save() {
    if (this.state.edit) {
      Meteor.call("saveRole", formStore.getData("role"));
      this.cancel();
    } else {
      Meteor.call("newRole", formStore.getData("role"));
      this.cancel();
    }
  }

  delete() {
    Meteor.call("deleteRole", adminStore.getState("role").id);
    this.cancel();
  }

  cancel() {
    this.setState({dialog: false});
  }

  render() {

    const fields =[
      {type: "text", name: "name", label: "Nom"},
      {type: "checkbox", name: "active", label: "Actif"},
      {type: "checkbox", name: "modifyApp", label: "Modifier les paramètres de l'application"},
      {type: "dropdown", name: "access", label: "Accès", multi: true, options: [
        {value: "app", label: "Application"},
        {value: "admin", label: "Administrateur"}
      ]},
      {type: "group", label: "Droits", options: [
        {type: "title", label: "Structure"},
        {type: "switchesGroup", options: [
          {label: "Créer", value:"structureC"},
          {label: "Lire", value:"structureR"},
          {label: "Modifier", value:"structureU"},
          {label: "Supprimer", value:"structureD"},
        ]},
        {type: "title", label: "Enregistrements"},
        {type: "switchesGroup", options: [
          {label: "Créer", value:"recordsC"},
          {label: "Lire", value:"recordsR"},
          {label: "Modifier", value:"recordsU"},
          {label: "Supprimer", value:"recordsD"},
        ]},
        {type: "title", label: "Sections"},
        {type: "switchesGroup", options: [
          {label: "Créer", value:"sectionsC"},
          {label: "Lire", value:"sectionsR"},
          {label: "Modifier", value:"sectionsU"},
          {label: "Supprimer", value:"sectionsD"},
        ]},
        {type: "title", label: "Rôles"},
        {type: "switchesGroup", options: [
          {label: "Créer", value:"rolesC"},
          {label: "Lire", value:"rolesR"},
          {label: "Modifier", value:"rolesU"},
          {label: "Supprimer", value:"rolesD"},
        ]},
        {type: "title", label: "Utilisateurs"},
        {type: "switchesGroup", options: [
          {label: "Créer", value:"usersC"},
          {label: "Lire", value:"usersR"},
          {label: "Modifier", value:"usersU"},
          {label: "Supprimer", value:"usersD"},
        ]}
      ]}
    ];

    return (
      <div>
        <Toolbar style={{backgroundColor:grey[200]}}>
          <div style={{flex:1}}></div>
          <Button color="secondary" onClick={this.new.bind(this)} >
            Nouveau rôle
          </Button>
        </Toolbar>
        <Dialog open={this.state.dialog} onRequestClose={this.cancel.bind(this)}>
          <DialogTitle>
            {this.state.dialogTitle}
          </DialogTitle>
          <DialogContent>
            <Form formId="role" fields={fields} data={this.state.edit ? adminStore.getState("role") : {}} />
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
