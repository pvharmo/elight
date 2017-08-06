/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../languages/languages.js";
import * as NavigationActions from "../actions/NavigationActions.js";
import nav from "../stores/NavigationStore.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {cyan50, cyan500, red500, blue500, grey600} from "material-ui/styles/colors";
import Dialog from "material-ui/Dialog";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from "material-ui/Toolbar";
import AutoComplete from "material-ui/AutoComplete";
import TextField from "material-ui/TextField";
import ChipInput from "material-ui-chip-input";
import Checkbox from "material-ui/Checkbox";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import Info from "material-ui/svg-icons/action/info";

export default class TopToolbarSchemas extends Component {
  constructor() {
    super();

    this.changeTitle = this.changeTitle.bind(this);
    this.cancelNewField = this.cancelNewField.bind(this);
    this.saveNewField = this.saveNewField.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleChangeSc = this.handleChangeSc.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);

    if (Session.get("selected-entity-name") === undefined) {
      Session.set("selected-entity-name", "");
    }

    this.state = {
      advancedSearchDialog: false,
      title: Session.get("selected-entity-name"),
      dialog: false,
      newFieldType: "",
      newFieldCheckbox: false,
      dropdownTags: [],
      multi: false,
      schemaLinked: "",
      fieldLinked: ""
    };
  }

  componentWillMount() {
    nav.on("schema-selected", this.changeTitle);
  }

  componentWillUnmount() {
    nav.removeListener("schema-selected", this.changeTitle);
  }

  changeTitle() {
    this.setState({title: Session.get("selected-entity-name")});
  }

  sc() {
    return Entities.find().fetch();
  }

  schema() {
    if (Session.get("selected-entity-name") !== undefined) {
      return Schemas.find({schema: Session.get("selected-entity-name")}, {sort: {order:1}}).fetch();
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

  newField() {
    if (Session.get("selected-entity") == "" || Session.get("selected-entity") == undefined) {
      alert(language().schemas.newField.newFieldAlert);
    } else {
      this.setState({dialog: true});
    }
  }

  saveNewField() {
    var showInList = this.state.newFieldCheckbox;
    var name = document.getElementById("new-field-name").value;
    var schema = Session.get("selected-entity");
    var schemaName = Session.get("selected-entity-name");
    var params = {};
    var type = this.state.newFieldType;
    var elements = this.state.dropdownTags;
    var multi = this.state.multi;

    if (this.state.newFieldType === "number") {
      params = {
        step: document.getElementById("new-field-step").value,
        min: document.getElementById("new-field-minVal").value,
        max: document.getElementById("new-field-maxVal").value,
        units: document.getElementById("new-field-units").value
      };
    } else if (this.state.newFieldType === "dropdown") {
      params = {
        elements,
        multi
      };
    } else if (this.state.newFieldType === "link") {
      params = {
        schema: this.state.schemaLinked,
        field: this.state.fieldLinked,
        multi
      };
    }

    Meteor.call("addField", showInList, name, type, schema, schemaName, params);

    this.setState({newFieldCheckbox:false});
    name = "";

    if (this.state.newFieldType == "number") {
      document.getElementById("new-field-step").value = "";
      document.getElementById("new-field-minVal").value = "";
      document.getElementById("new-field-maxVal").value= "";
    } else if (this.state.newFieldType == "dropdown" || "multiselect") {
      //document.getElementById("new-field-dropdown-elements").value = [];
      this.setState({dropdownTags:[]});
    }

    this.setState({dialog:false});
  }

  cancelNewField() {
    this.setState({dialog:false});
  }

  handleChangeType(event, index, value) {
    this.setState({newFieldType: value});
  }

  handleCheck(event, value) {
    this.setState({multi: value});
  }

  handleAddTag(value) {
    var dropdownTags = this.state.dropdownTags;
    dropdownTags.push(value);
    this.setState({dropdownTags});
  }

  handleDeleteTag(value, index) {
    var dropdownTags = this.state.dropdownTags;
    dropdownTags.splice(index,1);
    this.setState(dropdownTags);
  }

  handleChangeSc(event, index, value) {
    this.setState({schemaLinked:value});
  }

  handleChangeField(event, index, value) {
    this.setState({fieldLinked: value});
  }

  handleInList(event, value) {
    this.setState({newFieldCheckbox: value});
  }

  render() {

    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.cancelNewField} />,
      <FlatButton
        label={language().save}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveNewField} />
    ];

    console.log(this.state.schemaLinked);

    return (
      <div>
        <MuiThemeProvider>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={this.state.title} />
              <IconButton onTouchTap={this.newField.bind(this)} tooltip={language().schemas.newField.newField} >
                <ContentAdd color={cyan500} />
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Dialog open={this.state.dialog} actions={actions} >
            <form>
              <Table selectable={false} >
                <TableBody displayRowCheckbox={false} >
                  <TableRow>
                    <TableRowColumn>
                      <label>{language().schemas.list.showInList}</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <Checkbox onCheck={this.handleInList.bind(this)} checked={this.state.newFieldCheckbox} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      <label>{language().schemas.list.name}</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <TextField hintText={language().schemas.list.name} id="new-field-name" />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      <label>{language().schemas.list.type}</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <DropDownMenu value={this.state.newFieldType} onChange={this.handleChangeType} ref="type" >
                        <MenuItem value={"text"} primaryText={language().dataType.text} />
                        <MenuItem value={"textarea"} primaryText={language().dataType.textarea} />
                        <MenuItem value={"number"} primaryText={language().dataType.number} />
                        <MenuItem value={"checkbox"} primaryText={language().dataType.checkbox} />
                        <MenuItem value={"date"} primaryText={language().dataType.date} />
                        <MenuItem value={"dropdown"} primaryText={language().dataType.dropdown} />
                        <MenuItem value={"tags"} primaryText={language().dataType.tags} />
                        <MenuItem value={"link"} primaryText={language().dataType.link} />
                      </DropDownMenu>
                    </TableRowColumn>
                  </TableRow>
                  {this.state.newFieldType == "number" &&
                    <TableRow>
                      <TableRowColumn>
                        <label>{language().schemas.newField.step}</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        <TextField hintText={language().schemas.newField.step} type="number" id="new-field-step" />
                      </TableRowColumn>
                    </TableRow>
                  }
                  {this.state.newFieldType == "number" &&
                    <TableRow>
                      <TableRowColumn>
                        <label>{language().schemas.newField.minVal}</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        <TextField hintText={language().schemas.newField.minVal} type="number" id="new-field-minVal" />
                      </TableRowColumn>
                    </TableRow>
                  }
                  {this.state.newFieldType == "number" &&
                    <TableRow>
                      <TableRowColumn>
                        <label>{language().schemas.newField.maxVal}</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        <TextField hintText={language().schemas.newField.maxVal} type="number" id="new-field-maxVal" />
                      </TableRowColumn>
                    </TableRow>
                  }
                  {this.state.newFieldType == "number" &&
                    <TableRow>
                      <TableRowColumn>
                        <label>{language().schemas.newField.units}</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        <TextField hintText={language().schemas.newField.units} type="text" id="new-field-units" />
                      </TableRowColumn>
                    </TableRow>
                  }
                  {this.state.newFieldType == "dropdown" &&
                    <TableRow>
                      <TableRowColumn>
                        <label>{language().schemas.newField.elements}</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        {/*<TextField hintText={language().schemas.newField.elements} id="new-field-dropdown-elements" />*/}
                        <ChipInput
                          id="new-field-dropdown-elements"
                          value={this.state.dropdownTags}
                          onRequestAdd={this.handleAddTag.bind(this)}
                          onRequestDelete={this.handleDeleteTag.bind(this)} />
                      </TableRowColumn>
                    </TableRow>
                  }
                  {this.state.newFieldType == "dropdown" &&
                    <TableRow>
                      <TableRowColumn>
                        <label>{language().schemas.newField.multi}</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        {/*<TextField hintText={language().schemas.newField.elements} id="new-field-dropdown-elements" />*/}
                        <Checkbox
                          id="new-field-multi-elements"
                          checked={this.state.multi}
                          onCheck={this.handleCheck} />
                      </TableRowColumn>
                    </TableRow>
                  }
                  {this.state.newFieldType == "link" &&
                    <TableRow>
                      <TableRowColumn>
                        <label>{language().schemas.newField.multi}</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        {/*<TextField hintText={language().schemas.newField.elements} id="new-field-dropdown-elements" />*/}
                        <Checkbox
                          id="new-field-multi-elements"
                          checked={this.state.multi}
                          onCheck={this.handleCheck} />
                      </TableRowColumn>
                    </TableRow>
                  }
                  {this.state.newFieldType == "link" &&
                    <TableRow>
                      <TableRowColumn>
                        <label>{language().schemas.newField.linkedSchema}</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        <DropDownMenu
                          value={this.state.schemaLinked}
                          onChange={this.handleChangeSc}
                          multiple={this.state.multi} >
                          {this.sc().map((entity)=>{
                            return (
                              <MenuItem key={entity.id} value={entity.id} primaryText={entity.name} />
                            );
                          })}
                        </DropDownMenu>
                      </TableRowColumn>
                    </TableRow>
                  }
                  {this.state.newFieldType == "link" &&
                    <TableRow>
                      <TableRowColumn>
                        <label>{language().schemas.newField.LinkedField}</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        <DropDownMenu
                          value={this.state.fieldLinked}
                          onChange={this.handleChangeField}
                          multiple={this.state.multi} >
                          {this.schemas({entity:this.state.schemaLinked}).map((schema)=>{
                            return (
                              <MenuItem key={schema.id} value={schema.id} primaryText={schema.name} />
                            );
                          })}
                        </DropDownMenu>
                      </TableRowColumn>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </form>
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}
