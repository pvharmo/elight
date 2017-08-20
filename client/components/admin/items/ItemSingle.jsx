/*jshint esversion: 6 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";
import nav from "../../../flux/stores/NavigationStore.js";

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
    var prompt = confirm("Êtes-vous sûr de vouloir supprimer cet article?");
    if (prompt) {
      Meteor.call("deleteItem", {id:this.props.item.id});
    }
  }

  schemas() {
    return Schemas.find({entity: Session.get("selected-entity")}).fetch();
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
        {this.schemas().map((header)=>{
          if (this.props.item[header.id] && header.showInList) {
            switch (header.type) {
            case "boolean":
            case "checkbox":
              return (
                <TableRowColumn key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)"}} >
                  <Checkbox
                    checked={this.props.item[header.id]}
                    checkedIcon={<Done color={blue500} />}
                    uncheckedIcon={<AvNotInterested color={red500} />}
                    style={{margin:"0 auto", width:"24px"}} />
                </TableRowColumn>
              );

            case "date":
              return (
                <TableRowColumn key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  {this.props.item[header.id].toLocaleDateString()}
                </TableRowColumn>
              );

            case "dropdown":
            case "tags":
              var values;
              if (typeof this.props.item[header.id] === "object") {
                return (
                  <TableRowColumn key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                    <DropDownMenu value={this.props.item[header.id].join()} underlineStyle={{display:"none"}} >
                      <MenuItem value={this.props.item[header.id].join()} primaryText={this.props.item[header.id].join(", ")} style={{display:"none"}} />
                      {this.props.item[header.id].map((value)=>{
                        return <MenuItem key={value} primaryText={value} />;
                      })}
                    </DropDownMenu>
                  </TableRowColumn>
                );
              } else {
                return (
                  <TableRowColumn key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}}>
                    {this.props.item[header.id]}
                  </TableRowColumn>
                );
              }

            case "object":
              if (typeof this.props.item[header.id].getMonth === "function") {
                return (
                  <TableRowColumn key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                    {this.props.item[header.id].toLocaleDateString()}
                  </TableRowColumn>);
              } else if (Array.isArray(this.props.item[header.id])) {
                return (
                  <TableRowColumn key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                    <DropDownMenu value={this.props.item[header.id].join()} underlineStyle={{display:"none"}} >
                      <MenuItem value={this.props.item[header.id].join()} primaryText={this.props.item[header.id].join(", ")} style={{display:"none"}} />
                      {this.props.item[header.id].map((value)=>{
                        return <MenuItem key={value} primaryText={value} />;
                      })}
                    </DropDownMenu>
                  </TableRowColumn>);
              } else {
                return (<TableRowColumn key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} ></TableRowColumn>);
              }

            case "link":
              return (
                <TableRowColumn key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  {Items.findOne({id:this.props.item[header.id]})[header.params.schema]}
                  {// Items.findOne({id:this.props.item[header.id]})[Schemas.findOne({id: this.props.item[header.id].link.schema, entity: this.props.item[header.id].link.entity}).id]
                  }
                </TableRowColumn>
              );

            default:
              return (<TableRowColumn key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}}>{this.props.item[header.id]}</TableRowColumn>);

            }
          } else if (header.showInList) {
            return (
              <TableRowColumn key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)"}} ></TableRowColumn>
            );
          }
        })}
        <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}}>
          <IconButton onTouchTap={this.startEdit.bind(this)} ><Create color={blue500} /></IconButton>
          <IconButton onTouchTap={this.deleteItem.bind(this)} ><Clear color={red500} /></IconButton>

        </TableRowColumn>
      </TableRow>
    );
  }
}
