
import React, {Component} from "react";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";
import * as adminActions from "/client/flux/actions/adminActions.js";
import adminStore from "/client/flux/stores/adminStore.js";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {cyan, red, blue} from "@material-ui/core/colors";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Create from "@material-ui/icons/Create";
import Clear from "@material-ui/icons/Clear";
import Done from "@material-ui/icons/Done";
import AvNotInterested from "@material-ui/icons/NotInterested";


export default class ItemSingle extends Component {

  constructor() {
    super();

    this.state = {
      editingItem:false
    };

    this.closeDialog = this.closeDialog.bind(this);

    // this.style = {};
  }

  deleteItem() {
    var prompt = confirm("Êtes-vous sûr de vouloir supprimer cet article?");
    if (prompt) {
      Meteor.call("deleteItem", {id:this.props.item.id});
    }
  }

  schemas() {
    return Schemas.find({entity: adminStore.getStructure().entity}, {sort:{order: 1}}).fetch();
  }

  startEdit() {
    NavigationActions.openEditForm(this.props.item, this.props.schema);
    Session.set("edited-item", this.props.item);
    this.setState({editingItem: true});
  }

  closeDialog() {
    this.setState({editingItem:false});
  }

  selectRow() {
    adminActions.editRecord(this.props.item);
  }

  render() {
    return (
      <TableRow hover onClick={this.selectRow.bind(this)} >
        {this.schemas().map((header)=>{
          if (this.props.item[header.id] && header.showInList) {
            switch (header.type) {
            case "boolean":
            case "checkbox":
              return (
                <TableCell key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)"}} >
                  <Checkbox
                    checked={this.props.item[header.id]}
                    checkedIcon={<Done style={{color:blue[500]}} />}
                    icon={<AvNotInterested style={{color:red[500]}} />}
                    style={{margin:"0 auto", width:"24px"}} />
                </TableCell>
              );

            case "date":
              return (
                <TableCell key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  {this.props.item[header.id]}
                </TableCell>
              );

            case "dropdown":
            case "tags":
              var values;
              if (typeof this.props.item[header.id] === "object") {
                return (
                  <TableCell key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                    <Menu value={this.props.item[header.id].join()} underlineStyle={{display:"none"}} >
                      <MenuItem value={this.props.item[header.id].join()} primaryText={this.props.item[header.id].join(", ")} style={{display:"none"}} />
                      {this.props.item[header.id].map((value)=>{
                        return <MenuItem key={value} primaryText={value} />;
                      })}
                    </Menu>
                  </TableCell>
                );
              } else {
                return (
                  <TableCell key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}}>
                    {this.props.item[header.id]}
                  </TableCell>
                );
              }

            case "object":
              if (typeof this.props.item[header.id].getMonth === "function") {
                return (
                  <TableCell key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                    {this.props.item[header.id].toLocaleDateString()}
                  </TableCell>);
              } else if (Array.isArray(this.props.item[header.id])) {
                return (
                  <TableCell key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                    <Menu value={this.props.item[header.id].join()} underlineStyle={{display:"none"}} >
                      <MenuItem value={this.props.item[header.id].join()} primaryText={this.props.item[header.id].join(", ")} style={{display:"none"}} />
                      {this.props.item[header.id].map((value)=>{
                        return <MenuItem key={value} primaryText={value} />;
                      })}
                    </Menu>
                  </TableCell>);
              } else {
                return (<TableCell key={header} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} ></TableCell>);
              }

            case "link":
              return (
                <TableCell key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                  {Items.findOne({id:this.props.item[header.id]})[header.params.schema]}
                  {// Items.findOne({id:this.props.item[header.id]})[Schemas.findOne({id: this.props.item[header.id].link.schema, entity: this.props.item[header.id].link.entity}).id]
                  }
                </TableCell>
              );

            default:
              return (<TableCell key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)"}}>{this.props.item[header.id]}</TableCell>);

            }
          } else if (header.showInList) {
            return (
              <TableCell key={header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)"}} ></TableCell>
            );
          }
        })}
      </TableRow>
    );
  }
}
