/*jshint esversion: 6 */
import React,{Component} from "react";
import ReactDOM from "react-dom";
import language from "../../../languages/languages.js";
import nav from "../../../flux/stores/NavigationStore.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import FlatButton from "material-ui/FlatButton";

import ItemsEditForm from "./ItemsEditForm.jsx";

// Component that render the form to create a new item
export default class ItemsEditFormWrapper extends Component {

  constructor(props) {
    super(props);

    this.state = {
      subscription: {
        schemas:Meteor.subscribe("userSchemas")
      },
      dropdown: {},
      item: nav.getItemEditForm().item,
      dialog: false
    };

    this.openEditForm = this.openEditForm.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.saveItem = this.saveItem.bind(this);
  }

  componentWillMount() {
    nav.on("open-edit-form", this.openEditForm);
  }

  // Stop the subscription of schemas
  componentWillUnmount() {
    this.state.subscription.schemas.stop();
    nav.removeListener("open-edit-form", this.openEditForm);
  }

  // Fetch Schemas collection
  schemas() {
    return Schemas.find().fetch();
  }

  // Fetch the selected schema collection
  oneSchema() {
    return Schemas.find({entity: nav.getItemEditForm().schema},{sort: {order:1}}).fetch();
  }

  saveItem() {
    var editedItem = nav.getItemEditForm().item.id;

    Meteor.call("updateItem", editedItem, this.state.item);
    this.closeDialog();
  }

  openEditForm() {
    if (nav.getRightDrawer().itemEdit == nav.getItemEditForm().item.id) {
      this.setState({dialog: true, item: nav.getItemEditForm().item});
    }
  }

  closeDialog() {
    this.setState({dialog: false, item: nav.getItemEditForm().item});
  }

  handleChange(name, value, type, entity, schema) {
    var item = this.state.item;
    item[name] = value;
    this.setState(item);
  }

  handleAddTag(id, value, type) {
    var item = this.state.item;
    if (item[id]) {
      item[id].push(value);
    } else {
      item[id] = [value];
    }
    this.setState(item);
  }

  handleDeleteTag(id, index, type) {
    var item = this.state.item;
    item[id].splice(index,1);
    this.setState(item);
  }

  render() {

    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.closeDialog}
      />,
      <FlatButton
        label={language().save}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveItem}
      />,
    ];

    return (
      <div>
        <MuiThemeProvider>
          <Dialog title={language().items.edit} actions={actions} open={this.state.dialog} autoScrollBodyContent={true} >
            <form>
              <Table id="items-edit-form-table">
                <TableBody>
                  {// Show every entries of schema
                    this.oneSchema().map( (schema)=>{
                      return (<ItemsEditForm
                        key={schema.id}
                        schema={schema}
                        item={this.state.item}
                        dropdown={this.state.dropdown}
                        handleChange={this.handleChange.bind(this)}
                        handleAddTag={this.handleAddTag.bind(this)}
                        handleDeleteTag={this.handleDeleteTag.bind(this)} />);
                    })}
                </TableBody>
              </Table>
            </form>
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}
