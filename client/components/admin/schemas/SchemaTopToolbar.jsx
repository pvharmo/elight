
import React, {Component} from "react";
import language from "/client/languages/languages.js";
import * as adminActions from "/client/flux/actions/adminActions.js";
import adminStore from "/client/flux/stores/adminStore.js";
import formStore from "/client/flux/stores/formStore.js";

import Form from "../../FormGenerator/Form.jsx";

import {grey} from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ContentAdd from "@material-ui/icons/Add";
import Create from "@material-ui/icons/Create";

export default class TopToolbarSchemas extends Component {
  constructor() {
    super();

    this.editField = this.editField.bind(this);

    adminStore.on("edit-entity", this.editField);

    this.state = {
      advancedSearchDialog: false,
      dialog: false,
      newFieldType: "",
      newFieldCheckbox: false,
      dropdownTags: [],
      multi: false,
      schemaLinked: "",
      fieldLinked: "",
      entitiesMenu: false,
      newField: false,
      entityDialog: false,
      editEntity: false
    };
  }

  componentWillUnmount() {
    adminStore.removeListener("editField", this.editField);
  }

  entities() {
    return Entities.find().fetch();
  }

  entitiesArray() {
    var entitiesArray = [];
    var entities = Entities.find().fetch();
    for (var i = 0; i < entities.length; i++) {
      entitiesArray.push({label: entities[i].name, value: entities[i].id});
    }
    return entitiesArray;
  }

  schemasArray() {
    var schemasArray = [];
    if (formStore.getData("newField")) {
      var schemas = Schemas.find({entity:formStore.getData("newField").params.entity}).fetch();
      for (var i = 0; i < schemas.length; i++) {
        schemasArray.push({label: schemas[i].name, value: schemas[i].id});
      }
      return schemasArray;
    } else {
      return [];
    }
  }

  entity() {
    var entity = Entities.findOne({id: adminStore.getStructure().entity});
    if (entity) {
      return entity;
    } else {
      return {name:"Sélectionnez une entité"};
    }
  }

  editEntity() {
    this.setState({entityDialog:true, editEntity:true});
  }

  newEntity() {
    this.setState({entityDialog:true, editEntity:false});
  }

  editField() {
    this.setState({newField: true, editField:true});
  }

  newField() {
    if (adminStore.getStructure().entity == "" || adminStore.getStructure().entity == undefined) {
      alert(language().schemas.newField.newFieldAlert);
    } else {
      this.setState({newField: true, editField: false});
    }
  }

  cancelNewField() {
    this.setState({newField: false});
  }

  saveNewField() {
    if (this.state.editField) {
      Meteor.call("SaveSchemaEdited", formStore.getData("newField").id, formStore.getData("newField"));
    } else {
      Meteor.call("newField", formStore.getData("newField"), adminStore.getStructure().entity);
    }
    this.cancelNewField();
  }

  deleteField() {
    Meteor.call("deleteField", formStore.getData("newField"));
    this.cancelNewField();
  }

  schema() {
    if (adminStore.getStructure().entity !== undefined) {
      return Schemas.find({entity: adminStore.getStructure().entity}, {sort: {order:1}}).fetch();
    } else {
      return [];
    }
  }

  schemas(search) {
    if (!search) {
      search = {};
    }
    return Schemas.find(search).fetch();
  }

  cancelNewEntity() {
    this.setState({entityDialog: false});
  }

  saveEntity() {
    var double = Entities.findOne({name: formStore.getData("entity").name});
    var entity = formStore.getData("entity");

    if (double) {
      this.setState({alert:true});
    } else {
      if(this.state.editEntity) {
        Meteor.call("editEntity", entity.id, entity.name, function(err, id) {
          adminActions.selectEntity(entity.id);
        });
      } else {
        Meteor.call("newEntity", entity, function(err, id) {
          adminActions.selectEntity(id);
        });
      }
      this.cancelNewEntity();
    }
    this.update();
  }

  handleClick(event) {
    this.setState({entitiesMenu: true, anchorEl: event.currentTarget});
  }

  onClose(item) {
    this.setState({[item]: false, anchorEl: undefined});
  }

  selectEntity(entity) {
    adminActions.selectEntity(entity.id);
    this.onClose("entitiesMenu");
  }

  update() {
    this.forceUpdate();
  }

  deleteEntity() {
    Meteor.call("deleteEntity", adminStore.getStructure().entity);
    this.cancelNewEntity();
    this.update();
  }

  render() {

    const fields = [
      {type: "checkbox", name: "showInList", label: language().schemas.list.showInList},
      {type: "text", name: "name", label: language().schemas.list.name},
      {type: "dropdown", name: "type", label: language().schemas.list.type, options: [
        {label:language().dataType.text, value: "text"},
        {label:language().dataType.textarea, value: "textarea"},
        {label:language().dataType.number, value: "number"},
        {label:language().dataType.date, value: "date"},
        {label:language().dataType.checkbox, value: "checkbox"},
        {label:language().dataType.dropdown, value: "dropdown"},
        {label:language().dataType.tags, value: "tags"},
        {label:language().dataType.link, value: "link"},
      ]},
      {type:"dropdown", name: "params.entity", label:language().schemas.newField.linkedSchema, options:this.entitiesArray(), condition(data) {
        if (data.type === "link") {
          return true;
        }
      }},
      {type:"dropdown", name: "params.field", label:language().schemas.newField.linkedField, options:this.schemasArray(), condition(data) {
        if (data.type === "link") {
          return true;
        }
      }},
      {type: "chip", name: "params.elements", label: language().schemas.newField.elements, condition(data) {
        if (data.type === "dropdown") {
          return true;
        }
      }},
      {type: "checkbox", name: "params.multi", label: language().schemas.newField.multi, condition(data) {
        if (data.type === "dropdown") {
          return true;
        }
      }}
    ];

    const entityFields = [
      {type: "text", name: "name", label: language().schemas.newEntityName}
    ];

    return (
      <div>
        <Toolbar style={{backgroundColor:grey[200]}}>
          <Typography>{"Entité sélectionné: "}</Typography>
          <Button onClick={this.handleClick.bind(this)} >
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
          <IconButton onClick={this.editEntity.bind(this)} color="primary"  >
            <Create/>
          </IconButton>
          <IconButton onClick={this.newEntity.bind(this)} color="primary" >
            <ContentAdd />
          </IconButton>
          <div style={{flex:1}}></div>
          <Button color="secondary" onClick={this.newField.bind(this)} >
            Nouveau champ
          </Button>
        </Toolbar>
        <Dialog open={this.state.newField} >
          <DialogTitle>Nouveau Champ</DialogTitle>
          <DialogContent>
            <Form formId="newField" fields={fields} data={this.state.editField ? adminStore.getStructure().field : {}} update={this.update.bind(this)} />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={this.cancelNewField.bind(this)} >
              {language().cancel}
            </Button>
            {this.state.editField &&
              <Button
                color="secondary"
                onClick={this.deleteField.bind(this)} >
                {language().delete}
              </Button>
            }
            <Button
              color="primary"
              onClick={this.saveNewField.bind(this)} >
              {language().save}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.entityDialog} >
          <DialogTitle>Entité</DialogTitle>
          <DialogContent>
            <Form formId="entity" fields={entityFields} data={this.state.editEntity ? this.entity() : {}} update={this.update.bind(this)} />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={this.cancelNewEntity.bind(this)} >
              {language().cancel}
            </Button>
            {this.state.editEntity &&
              <Button
                color="secondary"
                onClick={this.deleteEntity.bind(this)} >
                {language().delete}
              </Button>
            }
            <Button
              color="primary"
              onClick={this.saveEntity.bind(this)} >
              {language().save}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
