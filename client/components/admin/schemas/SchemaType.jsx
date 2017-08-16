/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../../../languages/languages.js";

import Dialog from "material-ui/Dialog";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import Checkbox from "material-ui/Checkbox";
import ChipInput from "material-ui-chip-input";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import Tune from "material-ui/svg-icons/image/tune";

export default class SchemaType extends Component {

  constructor(props) {
    super(props);

    this.cancelModifs = this.cancelModifs.bind(this);
    this.applyNumberOptions = this.applyNumberOptions.bind(this);
    this.applyDropdownOptions = this.applyDropdownOptions.bind(this);
    this.handleChangeSc = this.handleChangeSc.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.applyLinkOptions = this.applyLinkOptions.bind(this);

    this.state = {
      dialog: false,
      dropdown: [0],
      dropdownTags: this.props.schema.params.elements,
      multi: this.props.schema.params.multi,
      schemaLinked: this.props.schema.params.schema,
      fieldLinked: this.props.schema.params.field
    };
  }

  entities() {
    return Entities.find().fetch();
  }

  schemas(search) {
    if (!search) {
      search = {};
    }
    return Schemas.find(search).fetch();
  }

  openOptions() {
    this.setState({dialog:true});
  }

  cancelModifs() {
    this.setState({dialog:false});
  }

  applyNumberOptions () {
    var params = {
      step: document.getElementById("input-edit-step-" + this.props.schema.name).value.trim(),
      min : document.getElementById("input-edit-min-" + this.props.schema.name).value.trim(),
      max : document.getElementById("input-edit-max-" + this.props.schema.name).value.trim(),
      units : document.getElementById("input-edit-units-" + this.props.schema.name).value.trim()
    };
    var schemaId = this.props.schema.id;

    Meteor.call("updateSchemaParams", params, schemaId);
    this.setState({dialog:false});
  }

  applyDropdownOptions() {
    var schemaId = this.props.schema.id;

    var params = {
      elements: this.state.dropdownTags,
      multi: this.state.multi
    };

    Meteor.call("updateSchemaParams", params, schemaId);
    this.setState({dialog:false});
  }

  applyLinkOptions() {
    var schemaId = this.props.schema.id;

    var params = {
      multi: this.state.multi,
      schema: this.state.schemaLinked,
      field: this.state.fieldLinked
    };

    Meteor.call("updateSchemaParams", params, schemaId);
    this.setState({dialog:false});
  }

  handleChangeDropdown(id, event) {
    var params = {};
    var dropdown = this.state.dropdown;
    dropdown[id] = event.target.value;

    this.setState({dropdown : dropdown});
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

  handleMulti(event, value) {
    this.setState({multi:value});
  }

  handleChangeSc(event, index, value) {
    this.setState({schemaLinked:value});
  }

  handleChangeField(event, index, value) {
    this.setState({fieldLinked:value});
  }

  render() {
    const numberActions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.cancelModifs} />,
      <FlatButton
        label={language().save}
        primary={true}
        onTouchTap={this.applyNumberOptions} />
    ];

    const dropdownActions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.cancelModifs} />,
      <FlatButton
        label={language().save}
        primary={true}
        onTouchTap={this.applyDropdownOptions} />
    ];

    const linkActions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.cancelModifs} />,
      <FlatButton
        label={language().save}
        primary={true}
        onTouchTap={this.applyLinkOptions} />
    ];

    switch (this.props.schema.type) {
    case "number":
      return (
        <div>
          <div>
            <div className="type-number" style={{verticalAlign: "super"}} >{this.props.schema.type}</div>
            <IconButton onTouchTap={this.openOptions.bind(this)} ><Tune /></IconButton>
          </div>
          <Dialog open={this.state.dialog} id={this.props.schema.id} actions={numberActions} autoScrollBodyContent={true} >
            <Table className="options-list" selectable={false} >
              <TableBody displayRowCheckbox={false} >
                <TableRow>
                  <TableRowColumn><label >{language().schemas.newField.step}</label></TableRowColumn>
                  <TableRowColumn className="input-number">
                  <TextField id={"input-edit-step-" + this.props.schema.name} type="number" defaultValue={this.props.schema.params.step} label={language().schemas.newField.step} />
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn><label htmlFor="numberMin">{language().schemas.newField.minVal}</label></TableRowColumn>
                  <TableRowColumn className="input-number">
                    <TextField id={"input-edit-min-" + this.props.schema.name} type="number" defaultValue={this.props.schema.params.min} label={language().schemas.newField.minVal} />
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn><label htmlFor="numberMax">{language().schemas.newField.maxVal}</label></TableRowColumn>
                  <TableRowColumn className="input-number">
                    <TextField id={"input-edit-max-" + this.props.schema.name} type="number" defaultValue={this.props.schema.params.max} label={language().schemas.newField.maxVal} />
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn><label htmlFor="numberMax">{language().schemas.newField.units}</label></TableRowColumn>
                  <TableRowColumn className="input-number">
                    <TextField id={"input-edit-units-" + this.props.schema.name} type="text" defaultValue={this.props.schema.params.units} label={language().schemas.newField.units} />
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </Dialog>
        </div>
      );

    case "dropdown":
    case "multiselect":
      return (
        <div>
          <div>
            <div className="type-number" style={{verticalAlign: "super"}} >{this.props.schema.type}</div>
            <IconButton onTouchTap={this.openOptions.bind(this)} ><Tune /></IconButton>
          </div>
          <Dialog open={this.state.dialog} id={this.props.schema.id} actions={dropdownActions} autoScrollBodyContent={true} >
            <Table selectable={false} >
              <TableBody displayRowCheckbox={false} >
                <TableRow>
                  <TableRowColumn>
                    <label>{language().schemas.newField.elements}</label>
                  </TableRowColumn>
                  <TableRowColumn>
                    <ChipInput
                      id={"input-edit-dropdown-" + this.props.schema.name}
                      value={this.state.dropdownTags}
                      onRequestAdd={this.handleAddTag.bind(this)}
                      onRequestDelete={this.handleDeleteTag.bind(this)} />
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>
                    <label>{language().schemas.newField.multi}</label>
                  </TableRowColumn>
                  <TableRowColumn>
                    <Checkbox
                      id={"input-edit-dropdown-" + this.props.schema.name}
                      checked={this.state.multi}
                      onCheck={this.handleMulti.bind(this)} />
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </Dialog>
        </div>
      );

    case "link":
      return (
        <div>
          <div>
            <div className="type-number" style={{verticalAlign: "super"}} >{this.props.schema.type}</div>
            <IconButton onTouchTap={this.openOptions.bind(this)} ><Tune /></IconButton>
          </div>
          <Dialog open={this.state.dialog} id={this.props.schema.id} actions={linkActions} autoScrollBodyContent={true} >
            <Table selectable={false} >
              <TableBody displayRowCheckbox={false} >
                <TableRow>
                  <TableRowColumn>
                    <label>{language().schemas.newField.multi}</label>
                  </TableRowColumn>
                  <TableRowColumn>
                    {/*<TextField hintText={language().schemas.newField.elements} id="new-field-dropdown-elements" />*/}
                    <Checkbox
                      id="new-field-multi-elements"
                      checked={this.state.multi}
                      onCheck={this.handleMulti.bind(this)} />
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>
                    <label>{language().schemas.newField.linkedSchema}</label>
                  </TableRowColumn>
                  <TableRowColumn>
                    <DropDownMenu
                      value={this.state.schemaLinked}
                      onChange={this.handleChangeSc}
                      multiple={this.state.multi} >
                      {this.entities().map((entity)=>{
                        return (
                          <MenuItem key={entity.id} value={entity.id} primaryText={entity.name} />
                        );
                      })}
                    </DropDownMenu>
                  </TableRowColumn>
                </TableRow>
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
                          <MenuItem key={schema.id} value={schema.name} primaryText={schema.name} />
                        );
                      })}
                    </DropDownMenu>
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </Dialog>
        </div>
      );

    default:
      return (
        <div>{this.props.schema.type}</div>
      );

    }
  }
}
