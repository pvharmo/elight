
import React, {Component} from "react";
import language from "../../../languages/languages.js";
import nav from "../../../flux/stores/NavigationStore.js";

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {red, blue} from "material-ui/colors";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import Create from "material-ui-icons/Create";
import Clear from "material-ui-icons/Clear";

export default class RolesRow extends Component {
  constructor() {
    super();
  }

  deleteRole() {
    // Meteor.call("deleteRole", this.props.role._id);
  }

  render() {
    return (
      <TableRow>
        <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)"}} >
          {this.props.user.emails[0].address}
        </TableRowColumn>
        <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
          <IconButton onTouchTap={this.props.openUserDialog.bind(this)} ><Create color={blue[500]} /></IconButton>
          <IconButton onTouchTap={this.deleteRole.bind(this)} ><Clear color={red[500]} /></IconButton>
        </TableRowColumn>
      </TableRow>
    );
  }
}
