
import React, {Component} from "react";
import language from "../../../languages/languages.js";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";
import * as adminActions from "/client/flux/actions/adminActions.js";
import adminStore from "/client/flux/stores/adminStore.js";
import formStore from "/client/flux/stores/formStore.js";

import Form from "/client/components/FormGenerator/Form.jsx";

import grey from "material-ui/colors/grey";
import Dialog, {DialogActions, DialogContent, DialogTitle} from "material-ui/Dialog";
import Toolbar from "material-ui/Toolbar";
import TextField from "material-ui/TextField";
import Menu, {MenuItem} from "material-ui/Menu";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import KeyboardArrowDown from "material-ui-icons/KeyboardArrowDown";
import Search from "material-ui-icons/Search";
import Tune from "material-ui-icons/Tune";
import Clear from "material-ui-icons/Clear";

export default class TopToolbar extends Component {
  constructor() {
    super();

    this.editRecord = this.editRecord.bind(this);

    adminStore.on("edit-record", this.editRecord);

    this.state = {
      dialog: false,
      entitiesMenu: false,
      searchEntity: false,
      searchField: {name: ""},
      openSearch: false
    };
  }

  selectMenuItem(field) {
    this.setState({searchField:field});
    this.onClose("searchEntity");
  }

  advancedSearch() {
    this.setState({dialog: true, dialogTitle: "Rechercher"});
  }

  search(simple, event) {
    if (simple) {
      adminActions.searchRecords(event.target.value);
    } else {
      adminActions.searchRecords(formStore.getData("item"));
    }
    this.onClose("dialog");
  }

  schema() {
    if (adminStore.getStructure().entity !== undefined) {
      return Schemas.find({entity: adminStore.getStructure().entity}, {sort: {order:1}}).fetch();
    } else {
      return [];
    }
  }

  newItem() {
    if (Session.get("selected-entity") == "" || Session.get("selected-entity") == undefined) {
      alert("You must select a schema before creating a new item.");
    } else {
      NavigationActions.newItem();
    }
  }

  handleClick(menu, event) {
    this.setState({[menu]: true, anchorEl: event.currentTarget});
  }

  onClose(menu) {
    this.setState({[menu]: false, anchorEl: undefined});
  }

  entities() {
    return Entities.find().fetch();
  }

  entity() {
    var entity = Entities.findOne({id: adminStore.getStructure().entity});
    if (entity) {
      return entity;
    } else {
      return {name:"Sélectionnez une entité"};
    }
  }

  selectEntity(entity) {
    adminActions.selectEntity(entity.id);
    this.onClose("entitiesMenu");
  }

  update() {
    this.forceUpdate();
  }

  closeDialog() {
    this.setState({dialog: false});
  }

  saveRecord() {
    var record = formStore.getData("item");
    if (language().items.edit === this.state.dialogTitle) {
      Meteor.call("updateItem", record);
    } else if (language().items.newItem === this.state.dialogTitle) {
      Meteor.call("newItem", record, record, adminStore.getStructure().entity);
    }
    this.onClose("dialog");
  }

  fields() {
    var schemas = Schemas.find({entity:adminStore.getStructure().entity}, {sort:{order:1}}).fetch();
    var fields = [];
    for (var i = 0; i < schemas.length; i++) {
      fields[i] = {};
      fields[i].name = schemas[i].id;
      fields[i].label = schemas[i].name;
      fields[i].type = schemas[i].type;
      fields[i].options = [];
      if (schemas[i].params.elements) {
        for (var j = 0; j < schemas[i].params.elements.length; j++) {
          fields[i].options[j] = {};
          fields[i].options[j].value = schemas[i].params.elements[j];
          fields[i].options[j].label = schemas[i].params.elements[j];
        }
      }
    }
    return fields;
  }

  openSearch() {
    this.setState({openSearch:true});
  }

  closeSearch() {
    this.setState({openSearch:false, search: {}});
    adminActions.clearSearch();
  }

  newRecord() {
    this.setState({dialog: true, dialogTitle: language().items.newItem});
  }

  editRecord() {
    this.setState({dialog: true, dialogTitle: language().items.edit});
  }

  data() {
    if (this.state.dialogTitle === language().items.edit) {
      return adminStore.getStructure().record;
    } else {
      return {};
    }
  }

  render() {
    return (
      <Toolbar style={{backgroundColor:"rgba(0,0,0,0.1)"}} >
        <Button onClick={this.handleClick.bind(this, "entitiesMenu")} >
          {this.entity().name}
        </Button>
        <Menu
          open={this.state.entitiesMenu}
          anchorEl={this.state.anchorEl}
          onClose={this.onClose.bind(this, "entitiesMenu")} >
          {this.entities().map((entity)=>{
            return <MenuItem key={entity.id} onClick={this.selectEntity.bind(this, entity)} >{entity.name}</MenuItem>;
          })}
        </Menu>
        <div style={{flex:2}}></div>

        { this.state.openSearch &&
          <div>
            <Button onClick={this.handleClick.bind(this, "searchEntity")} >­
              {this.state.searchField.name}
              <KeyboardArrowDown />
            </Button>
            <Menu
              open={this.state.searchEntity}
              anchorEl={this.state.anchorEl}
              onClose={this.onClose.bind(this, "searchEntity")} >
              {this.schema().map((field) =>{
                return (
                  <MenuItem key={field.id} onClick={this.selectMenuItem.bind(this, field)} >
                    {field.name}
                  </MenuItem>
                );
              })}
            </Menu>
            <TextField id="simple-search-text-field" onChange={this.search.bind(this, true)} placeholder={language().items.search} />
            <IconButton onClick={this.advancedSearch.bind(this)} >­
              <Tune style={{color:grey[600]}} />
            </IconButton>
          </div>
        }
        {this.state.openSearch ? (
          <IconButton onClick={this.closeSearch.bind(this)} >­
            <Clear style={{color:grey[600]}} />
          </IconButton>
        ) : (
          <IconButton onClick={this.openSearch.bind(this)} >­
            <Search style={{color:grey[600]}} />
          </IconButton>
        )}
        <Dialog
          open={this.state.dialog}
          onClose={this.onClose.bind(this, "dialog")} >
          <DialogTitle>
            {this.state.dialogTitle}
          </DialogTitle>
          <DialogContent>
            <Form formId="item" fields={this.fields()} data={this.data()} update={this.update.bind(this)} />
          </ DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={this.closeDialog.bind(this)} >
              {language().cancel}
            </Button>
            {this.state.dialogTitle === "Rechercher" ? (
              <Button
                color="primary"
                onClick={this.search.bind(this)} >
                {language().items.search}
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={this.saveRecord.bind(this)} >
                {language().save}
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Button color="secondary" onClick={this.newRecord.bind(this)} >
          {language().items.newItem}
        </Button>
      </Toolbar>
    );
  }
}
