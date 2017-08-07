/*jshint esversion: 6 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import * as NavigationActions from "../actions/NavigationActions.js";
import nav from "../stores/NavigationStore.js";

import ItemsEditFormWrapper from "./ItemsEditFormWrapper.jsx";

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {cyan50, red500, blue500} from "material-ui/styles/colors";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import ChipInput from "material-ui-chip-input";
import Checkbox from "material-ui/Checkbox";
import IconButton from "material-ui/IconButton";
import Create from "material-ui/svg-icons/content/create";
import Clear from "material-ui/svg-icons/content/clear";
import Done from "material-ui/svg-icons/action/done";
import AvNotInterested from "material-ui/svg-icons/av/not-interested";
import Cancel from "material-ui/svg-icons/navigation/cancel";

// Component that render every single items
export default class ItemSingle extends Component {

  constructor() {
    super();

    this.state = {
      editingItem:false
    };

    this.closeDialog = this.closeDialog.bind(this);

    this.style = {};
  }

  // Delete selected item
  deleteItem() {
    Meteor.call("deleteItem", {id:this.props.item.id});
  }

  startEdit() {
    NavigationActions.openEditForm(this.props.item, this.props.schema);
    Session.set("edited-item", this.props.item);
    this.setState({editingItem: true});
  }

  closeDialog() {
    this.setState({editingItem:false});
  }

  render() {
    if (this.props.stripState) {
      this.style = {
        backgroundColor: cyan50,
        borderBottom: "0px solid rgba(0,0,0,0)"
      };
    } else {
      this.style = {
        borderBottom: "0px solid rgba(0,0,0,0)"
      };
    }
    var tableHeader = Session.get("tableHeader");

    return (
      <TableRow style={this.style} hoverable={true} >
        {tableHeader.map((header)=>{
          if (this.props.item[header]) {
            switch (this.props.item[header].type) {
            case "boolean":
            case "checkbox":
              return (
                <TableRowColumn key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)"}} >
                  <Checkbox
                    checked={this.props.item[header].value}
                    checkedIcon={<Done color={blue500} />}
                    uncheckedIcon={<AvNotInterested color={red500} />}
                    style={{margin:"0 auto", width:"24px"}} />
                </TableRowColumn>
              );

            case "date":
              return (
                <TableRowColumn key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  {this.props.item[header].value.toLocaleDateString()}
                </TableRowColumn>
              );

            case "dropdown":
            case "tags":
            console.log(this.props.item[header].value);
              return (
                <TableRowColumn key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  <DropDownMenu value={this.props.item[header].value.join()} underlineStyle={{display:"none"}} >
                    <MenuItem value={this.props.item[header].value.join()} primaryText={this.props.item[header].value.join(", ")} style={{display:"none"}} />
                    {this.props.item[header].value.map((value)=>{
                      return <MenuItem key={value} primaryText={value} />;
                    })}
                  </DropDownMenu>
                </TableRowColumn>
              );

            case "object":
              if (typeof this.props.item[header].value.getMonth === "function") {
                return (
                  <TableRowColumn key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                    {this.props.item[header].value.toLocaleDateString()}
                  </TableRowColumn>);
              } else if (Array.isArray(this.props.item[header].value)) {
                return (
                  <TableRowColumn key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                    <DropDownMenu value={this.props.item[header].value.join()} underlineStyle={{display:"none"}} >
                      <MenuItem value={this.props.item[header].value.join()} primaryText={this.props.item[header].value.join(", ")} style={{display:"none"}} />
                      {this.props.item[header].value.map((value)=>{
                        return <MenuItem key={value} primaryText={value} />;
                      })}
                    </DropDownMenu>
                  </TableRowColumn>);
              } else {
                return (<TableRowColumn key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} ></TableRowColumn>);
              }

            default:
              return (<TableRowColumn key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}}>{this.props.item[header].value}</TableRowColumn>);

            }
          } else {
            return (
              <TableRowColumn key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)"}} ></TableRowColumn>
            );
          }
        })}
        <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}}>
          <IconButton onTouchTap={this.startEdit.bind(this)} ><Create color={blue500} /></IconButton>
          {nav.getUser().admin &&
            <IconButton onTouchTap={this.deleteItem.bind(this)} ><Clear color={red500} /></IconButton>
          }

        </TableRowColumn>
      </TableRow>
    );
  }
}
