
import React, {Component} from "react";
import * as adminActions from "/client/flux/actions/adminActions.js";

import {ListItem, ListItemText} from "material-ui/List";
import IconButton from "material-ui/IconButton";
import Checkbox from "material-ui/Checkbox";
import Done from "material-ui-icons/Done";
import NotInterested from "material-ui-icons/NotInterested";

export default class RoleSingle extends Component {
  constructor() {
    super();
  }

  edit() {
    adminActions.editRole(this.props.role);
  }

  toggleChecked(event, checked) {
    Meteor.call("toggleActive", this.props.role.id, checked);
  }

  render() {
    return (
      <ListItem button >
        <IconButton>
          <Checkbox
            checked={this.props.role.active}
            onChange={this.toggleChecked.bind(this)}
            checkedIcon={<Done />}
            icon={<NotInterested />} />
        </IconButton>
        <ListItemText primary={this.props.role.name} onClick={this.edit.bind(this)} />
      </ListItem>
    );
  }
}
