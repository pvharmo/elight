
import React, {Component} from "react";
import language from "../../../languages/languages.js";
import nav from "../../../flux/stores/NavigationStore.js";

import {red, blue} from "@material-ui/core/colors";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Create from "@material-ui/icons/Create";
import Clear from "@material-ui/icons/Clear";

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
