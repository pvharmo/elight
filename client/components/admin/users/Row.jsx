
import React, {Component} from "react";
import language from "../../../languages/languages.js";
import nav from "../../../flux/stores/NavigationStore.js";

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {cyan50, red500, blue500} from "material-ui/styles/colors";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import Visibility from "material-ui/svg-icons/action/visibility";
import ExpandLess from "material-ui/svg-icons/navigation/expand-less";
import VisibilityOff from "material-ui/svg-icons/action/visibility-off";
import ExpandMore from "material-ui/svg-icons/navigation/expand-more";
import Create from "material-ui/svg-icons/content/create";
import Clear from "material-ui/svg-icons/content/clear";
import Done from "material-ui/svg-icons/action/done";
import Cancel from "material-ui/svg-icons/navigation/cancel";
import AvNotInterested from "material-ui/svg-icons/av/not-interested";

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
          <IconButton onTouchTap={this.props.openUserDialog.bind(this)} ><Create color={blue500} /></IconButton>
          <IconButton onTouchTap={this.deleteRole.bind(this)} ><Clear color={red500} /></IconButton>
        </TableRowColumn>
      </TableRow>
    );
  }
}
