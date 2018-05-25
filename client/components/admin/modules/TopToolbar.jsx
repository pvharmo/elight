
import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "/client/languages/languages.js";
import moduleTypes from "/lib/moduleTypes.json";
import * as adminActions from "/client/flux/actions/adminActions.js";
import adminStore from "/client/flux/stores/adminStore.js";
import formStore from "/client/flux/stores/formStore.js";

import Options from "./chart/admin/Options.jsx";
import ModuleSettingsWrapper from "./ModuleSettingsWrapper.jsx";
import Form from "/client/components/FormGenerator/Form.jsx";

import {grey} from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ContentAdd from "@material-ui/icons/Add";
import Create from "@material-ui/icons/Create";

export default class TopToolbarPages extends TrackerReact(React.Component) {
  constructor() {
    super();

    this.editModule = this.editModule.bind(this);

    adminStore.on("edit-module", this.editModule);

    this.state = {
      advancedSearchDialog: false,
      dialog: false,
      newFieldType: "",
      alert: false,
      testCount: 0,
      sectionsMenu: false
    };
  }

  componentWillUnmount() {
    adminStore.removeListener("edit-module", this.editModule);
  }

  sections() {
    return Pages.find().fetch();
  }

  modules() {
    if (Session.get("selected-page-name") !== undefined) {
      return Modules.find({page: Session.get("selected-schema-name")}, {sort: {order:1}}).fetch();
    } else {
      return [];
    }
  }

  newModule() {
    if (Session.get("selected-page") == "" || Session.get("selected-page") == undefined) {
      alert(language().pages.modules.newModuleAlert);
    } else {
      this.setState({dialog: true});
    }
  }

  saveNewModule() {
    var name = document.getElementById("new-field-name").value;
    var page = Session.get("selected-page");
    var type = this.state.newFieldType;

    var double = Modules.findOne({name:name, page:page});

    if (double) {
      this.setState({alert:true});
    } else {
      Meteor.call("addModule", name, type, page);

      this.setState({newFieldType: ""});
      name = "";

      this.setState({dialog:false});
    }

  }

  cancelNewModule() {
    this.setState({dialog:false});
  }

  handleChangeType(event, index, value) {
    this.setState({newFieldType: value});
  }

  moduleTypes() {
    var types = [];
    for (var i = 0; i < moduleTypes.types.length; i++) {
      types[i] = {};
      types[i].value = moduleTypes.types[i].name;
      types[i].label = moduleTypes.types[i].name;
    }
    return types;
  }

  closeAlert() {
    this.setState({alert: false});
  }

  section() {
    var section = Pages.findOne({id: adminStore.getSections().section});
    if (section) {
      return section;
    } else {
      return {name:"Sélectionnez une section"};
    }
  }

  handleClick(event) {
    this.setState({sectionsMenu: true, anchorEl: event.currentTarget});
  }

  onRequestClose(item) {
    this.setState({[item]: false, anchorEl: undefined});
  }

  selectSection(section) {
    adminActions.selectSection(section.id);
    this.onRequestClose("sectionsMenu");
  }

  editSection() {
    this.setState({dialog: true, edit: true, section: true, title: language().pages.editPage});
  }

  newSection() {
    this.setState({dialog: true, edit: false, section: true, title: language().pages.newPage});
  }

  editModule() {
    this.setState({dialog: true, edit: true, section: false, title: adminStore.getSections().module.name});
  }

  newModule() {
    this.setState({dialog: true, edit: false, section:false, title: language().pages.modules.newModule});
  }

  cancel() {
    this.setState({dialog: false, edit: false, title: undefined});
  }

  delete() {
    if (this.state.section) {
      Meteor.call("deletePage", adminStore.getSections().section);
    } else {
      Meteor.call("deleteModule", adminStore.getSections().module.id);
    }
    this.cancel();
  }

  save() {
    if (this.state.section) {
      if (this.state.edit) {
        Meteor.call("editPage", adminStore.getSections().section, formStore.getData("sections").name);
        this.forceUpdate();
      } else {
        Meteor.call("newPage", formStore.getData("sections").name);
      }
    } else {
      if (this.state.edit) {
        console.log(formStore.getData("params"));
        Meteor.call("addParams", adminStore.getSections("sections").module.id, formStore.getData("params").params);
      } else {
        Meteor.call("newModule", formStore.getData("sections"), adminStore.getSections().section);
      }
    }
    this.cancel();
  }

  fields() {
    if (this.state.section) {
      return [
        {type: "text", name: "name", label: language().name}
      ];
    } else {
      return [
        {type: "text", name: "name", label: language().name},
        {type: "dropdown", name: "type", label: language().type, options: this.moduleTypes()}
      ];
    }
  }

  data() {
    if (this.state.edit) {
      if (this.state.section) {
        return Pages.findOne({id:adminStore.getSections().section});
      }
    } else {
      return {};
    }
  }

  render() {
    return (
      <div>
        <Toolbar style={{backgroundColor:grey[200]}}>
          <Button onClick={this.handleClick.bind(this)} >
            {this.section().name}
          </Button>
          <Menu
            open={this.state.sectionsMenu}
            anchorEl={this.state.anchorEl}
            onRequestClose={this.onRequestClose.bind(this, "sectionsMenu")} >
            {this.sections().map((section)=>{
              return <MenuItem key={section.id} onClick={this.selectSection.bind(this, section)} >{section.name}</MenuItem>;
            })}
          </Menu>
          <IconButton onClick={this.editSection.bind(this)} color="primary"  >
            <Create/>
          </IconButton>
          <IconButton onClick={this.newSection.bind(this)} color="primary" >
            <ContentAdd />
          </IconButton>
          <div style={{flex:1}}></div>
          <Button color="secondary" onClick={this.newModule.bind(this)} >
            Nouveau module
          </Button>
        </Toolbar>
        <Dialog open={this.state.dialog} onRequestClose={this.onRequestClose.bind(this, "moduleDialog")} >
          <DialogTitle>{this.state.title}</DialogTitle>
          <DialogContent>
            {this.state.edit && !this.state.section ? (
              <ModuleSettingsWrapper params={{id:adminStore.getSections().module.id, type:adminStore.getSections().module.type}} />
            ) : (
              <Form formId="sections" fields={this.fields()} data={this.data()} />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={this.cancel.bind(this)} >
              {language().cancel}
            </Button>
            {this.state.edit &&
              <Button
                color="accent"
                onClick={this.delete.bind(this)} >
                {language().delete}
              </Button>
            }
            <Button
              color="primary"
              onClick={this.save.bind(this)} >
              {language().save}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
