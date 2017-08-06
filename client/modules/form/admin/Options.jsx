/*jshint esversion: 6 */
import React, {Component} from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";

export default class Options extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.handleChangeAction = this.handleChangeAction.bind(this);
    this.handleCheck = this.handleCheck.bind(this);

    this.state = {
      subscription: {
        modules: Meteor.subscribe("userModules"),
        schemas: Meteor.subscribe("userSchemas"),
        fields: Meteor.subscribe("userFields")
      },
      action: "",
      autocreate: false
    };
  }

  componentWillUnmount() {
    this.state.subscription.modules.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.fields.stop();
  }

  handleChangeAction(event, index, value) {
    this.setState({action: value});
    Meteor.call("updateParams", this.props.id, value, "params.action");
  }

  handleCheck(event, value) {
    Meteor.call("updateParams", this.props.id, value, "params.autocreate");
  }

  module() {
    if (Modules.find({id: this.props.id}).fetch()[0] === undefined) {
      return {
        params: {
          action: "",
          autocreate: false
        }
      };
    } else {
      return Modules.find({id: this.props.id}).fetch()[0];
    }
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Table selectable={false} >
            <TableBody displayRowCheckbox={false} >
              <TableRow>
                <TableRowColumn style={{textAlign:"right"}} >{language().actionOnConfirm}</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu value={this.module().params.action} onChange={this.handleChangeAction} >
                    <MenuItem value="modify-item" primaryText="Modify item" />
                    {/*<MenuItem value="create-item" primaryText="Create item" />
                    <MenuItem value="delete-item" primaryText="Delete item" />*/}
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn style={{textAlign:"right"}} >{language().autocreate}</TableRowColumn>
                <TableRowColumn >
                  <Checkbox checked={this.module().params.autocreate} onCheck={this.handleCheck} />
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </MuiThemeProvider>
      </div>
    );
  }

}
