
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../../languages/languages.js";
import nav from "../../../flux/stores/NavigationStore.js";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";

import RolesRow from "./Row.jsx";

import { Scrollbars } from "react-custom-scrollbars";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {Tabs, Tab} from "material-ui/Tabs";
import IconButton from "material-ui/IconButton";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import Checkbox from "material-ui/Checkbox";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import ArrowDropDown from "material-ui/svg-icons/navigation/arrow-drop-down";
import ArrowDropUp from "material-ui/svg-icons/navigation/arrow-drop-up";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";

export default class RolesWrapper extends TrackerReact(React.Component) {
  constructor() {
    super();

    // this.saveRole = this.saveRole.bind()

    this.state = {
      subscription: {
        roles: Meteor.subscribe("appRoles"),
      },
      newRole: "",
      editRole: false,
      alert: false,
      role: {}
    };
  }

  roles() {
    return Roles.find().fetch();
  }

  newRole() {
    if (Roles.findOne({name:this.state.newRole})) {
      this.setState({alert: true});
    } else {
      Meteor.call("newRole", this.state.newRole);
      this.setState({newRole: ""});
    }
  }

  saveRole() {
    Meteor.call("saveRole", this.state.role);
    this.setState({editRole: false, role: {}});
  }

  handleChange(key, event, value) {
    this.setState({[key]: value});
  }

  handleRoleChange(key, event, value) {
    var role = this.state.role;
    role[key] = value;
    this.setState(role);
  }

  handleDropdownRoleChange(key, event, index, value) {
    var role = this.state.role;
    role[key] = value;
    this.setState(role);
  }

  editState(state) {
    this.setState(state);
  }

  render() {
    var stripState = true;
    var height = window.innerHeight - 199;

    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.editState.bind(this, {editRole:false, role: {}})}
      />,
      <FlatButton
        label={language().save}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveRole.bind(this)}
      />,
    ];

    const alert = [
      <FlatButton
        label={language().close}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.editState.bind(this, {alert: false})}
      />
    ];

    var style = {};

    if (window.innerWidth > 1600) {
      style.paddingRight = "300px";
      style.width = window.innerWidth - 500;
    }

    return (
      <div>
        <div id="schema-fields-list">
          <MuiThemeProvider>
            <Dialog title={"Édition du rôle"} open={this.state.editRole} actions={actions} >
              <Tabs onChange={this.handleTabChange} tabItemContainerStyle={{ backgroundColor: "rgba(0,0,0,0)", color: "rgba(0,0,0,0.4)"}} >
                <Tab label={"Général"} style={{ backgroundColor: "rgba(0,0,0,0)", color: "rgba(0,0,0,0.4)", fontWeight: 400, padding: "0 35px"}} >
                  <Table style={{color: "rgba(0, 0, 0, 0.870588)"}} selectable={false} >
                    <TableBody displayRowCheckbox={false} >
                      <TableRow >
                        <TableRowColumn><label>Nom du rôle</label></TableRowColumn>
                        <TableRowColumn>
                          <TextField hintText={"Nom du rôle"} value={this.state.role.name} onChange={this.handleRoleChange.bind(this, "name")} />
                        </TableRowColumn>
                      </TableRow>
                      <TableRow >
                        <TableRowColumn><label>Accès</label></TableRowColumn>
                        <TableRowColumn>
                          <DropDownMenu
                            id="access"
                            value={this.state.role.access}
                            onChange={this.handleDropdownRoleChange.bind(this, "access")}
                            multiple={false} >
                            <MenuItem value={"admin"} primaryText={"Admin"} />
                            <MenuItem value={"app"} primaryText={"Application"} />
                            <MenuItem value={"both"} primaryText={"Tout"} />
                          </DropDownMenu>
                        </TableRowColumn>
                      </TableRow>
                      <TableRow >
                        <TableRowColumn><label>Modifier les paramètres de l'application</label></TableRowColumn>
                        <TableRowColumn>
                          <Checkbox checked={this.state.role.modifyApp} onCheck={this.handleRoleChange.bind(this, "modifyApp")} />
                        </TableRowColumn>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Tab>
                <Tab label={"CRUD"} style={{ backgroundColor: "rgba(0,0,0,0)", color: "rgba(0,0,0,0.4)", fontWeight: 400, padding: "0 35px"}} >
                  <Table style={{color: "rgba(0, 0, 0, 0.870588)"}} selectable={false} >
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                      <TableRow>
                        <TableRowColumn></TableRowColumn>
                        <TableRowColumn style={{textAlign: "center", width:64, color: "rgba(0,0,0,0.9)", paddingLeft: 14, paddingRight: 14}} >
                          Créer
                        </TableRowColumn>
                        <TableRowColumn style={{textAlign: "center", width:64, color: "rgba(0,0,0,0.9)", paddingLeft: 14, paddingRight: 14}} >
                          Lire
                        </TableRowColumn>
                        <TableRowColumn style={{textAlign: "center", width:64, color: "rgba(0,0,0,0.9)", paddingLeft: 14, paddingRight: 14}} >
                          Modifier
                        </TableRowColumn>
                        <TableRowColumn style={{textAlign: "center", width:64, color: "rgba(0,0,0,0.9)", paddingLeft: 14, paddingRight: 14}} >
                          Supprimer
                        </TableRowColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} >
                      <TableRow >
                        <TableRowColumn><label>Structure</label></TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.structureC} onCheck={this.handleRoleChange.bind(this, "structureC")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.structureR} onCheck={this.handleRoleChange.bind(this, "structureR")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.structureU} onCheck={this.handleRoleChange.bind(this, "structureU")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.structureD} onCheck={this.handleRoleChange.bind(this, "structureD")} />
                        </TableRowColumn>
                      </TableRow>
                      <TableRow >
                        <TableRowColumn><label>Enregistrements</label></TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.recordsC} onCheck={this.handleRoleChange.bind(this, "recordsC")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.recordsR} onCheck={this.handleRoleChange.bind(this, "recordsR")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.recordsU} onCheck={this.handleRoleChange.bind(this, "recordsU")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.recordsD} onCheck={this.handleRoleChange.bind(this, "recordsD")} />
                        </TableRowColumn>
                      </TableRow>
                      <TableRow >
                        <TableRowColumn><label>Sections</label></TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.sectionsC} onCheck={this.handleRoleChange.bind(this, "sectionsC")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.sectionsR} onCheck={this.handleRoleChange.bind(this, "sectionsR")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.sectionsU} onCheck={this.handleRoleChange.bind(this, "sectionsU")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.sectionsD} onCheck={this.handleRoleChange.bind(this, "sectionsD")} />
                        </TableRowColumn>
                      </TableRow>
                      <TableRow >
                        <TableRowColumn><label>Rôles</label></TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.rolesC} onCheck={this.handleRoleChange.bind(this, "rolesC")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.rolesR} onCheck={this.handleRoleChange.bind(this, "rolesR")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.rolesU} onCheck={this.handleRoleChange.bind(this, "rolesU")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.rolesD} onCheck={this.handleRoleChange.bind(this, "rolesD")} />
                        </TableRowColumn>
                      </TableRow>
                      <TableRow >
                        <TableRowColumn><label>Utilisateurs</label></TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.usersC} onCheck={this.handleRoleChange.bind(this, "usersC")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.usersR} onCheck={this.handleRoleChange.bind(this, "usersR")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.usersU} onCheck={this.handleRoleChange.bind(this, "usersU")} />
                        </TableRowColumn>
                        <TableRowColumn style={{width:24, color: "rgba(0,0,0,0.9)", paddingLeft: 34, paddingRight: 34}} >
                          <Checkbox checked={this.state.role.usersD} onCheck={this.handleRoleChange.bind(this, "usersD")} />
                        </TableRowColumn>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Tab>
              </Tabs>
            </Dialog>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Dialog
              actions={alert}
              open={this.state.alert} >
              Ce rôle existe déjà.
            </Dialog>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{borderBottom: "2px solid rgba(0,0,0,0.5)"}} >
                <TableRow>
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                    Rôles
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                    {language().schemas.list.edit}
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
            </Table>
          </MuiThemeProvider>
          <Scrollbars style={{width: "100%", height}} >
            <MuiThemeProvider>
              <Table>
                <TableBody displayRowCheckbox={false} selectable={false} >
                  {this.roles().map( (role)=>{
                    stripState = !stripState;
                    return (
                      <RolesRow
                        key={role.id}
                        stripState={stripState}
                        openRoleDialog={this.editState.bind(this, {editRole: true, role})}
                        role={role} />
                    );
                  })}
                  <TableRow selectable={false} >
                    <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)"}} >
                      <TextField
                        id="name"
                        placeholder="Nouveau rôle"
                        value={this.state.newRole}
                        onChange={this.handleChange.bind(this, "newRole")} />
                    </TableRowColumn>
                    <TableRowColumn style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
                      <FloatingActionButton onTouchTap={this.newRole.bind(this)} mini={true}>
                        <ContentAdd />
                      </FloatingActionButton>
                    </TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </MuiThemeProvider>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
