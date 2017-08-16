/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../../../languages/languages.js";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";
import nav from "../../../flux/stores/NavigationStore.js";
import moduleTypes from "./moduleTypes.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {cyan50, cyan500, red500, blue500, grey600} from "material-ui/styles/colors";
import Dialog from "material-ui/Dialog";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from "material-ui/Toolbar";
import TextField from "material-ui/TextField";
import Checkbox from "material-ui/Checkbox";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import Info from "material-ui/svg-icons/action/info";

export default class TopToolbarPages extends Component {
  constructor() {
    super();

    this.changeTitle = this.changeTitle.bind(this);
    this.cancelNewModule = this.cancelNewModule.bind(this);

    if (Session.get("selected-page-name") === undefined) {
      Session.set("selected-page-name", "");
    }

    this.state = {
      /*subscription: {
        moduleTypes: Meteor.subscribe("userModuleTypes"),
      },*/
      advancedSearchDialog: false,
      title: Session.get("selected-page-name"),
      dialog: false,
      newFieldType: "",
      alert: false,
      testCount: 0
    };
  }

  componentWillMount() {
    nav.on("page-selected", this.changeTitle);
  }

  componentWillUnmount() {
    //this.state.subscription.moduleTypes.stop();
    nav.removeListener("page-selected", this.changeTitle);
  }

  changeTitle() {
    this.setState({title: Session.get("selected-page-name")});
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
    return moduleTypes;
  }

  closeAlert() {
    this.setState({alert: false});
  }

  test() {
    var testCount = this.state.testCount;
    if (this.state.testCount < 3) {
      testCount++;
      this.setState({testCount});
    } else {
      Meteor.call("test");
      this.setState({testCount: 0});
    }
  }

  render() {

    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.cancelNewModule} />,
      <FlatButton
        label={language().save}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveNewModule.bind(this)} />
    ];

    const alert = [
      <FlatButton
        label={language().close}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.closeAlert.bind(this)}
      />
    ];

    return (
      <div>
        <MuiThemeProvider>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={this.state.title} />
              <IconButton onTouchTap={this.newModule.bind(this)} tooltip={language().pages.modules.newModule} >
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
                      <label>{language().schemas.list.name}</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <TextField hintText={language().schemas.list.name} id="new-field-name" />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn onTouchTap={this.test.bind(this)} >
                      <label>{language().schemas.list.type}</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <DropDownMenu value={this.state.newFieldType} onChange={this.handleChangeType.bind(this)} ref="type" >
                        {this.moduleTypes().map((type)=>{
                          return <MenuItem key={type.name} value={type.name} primaryText={type.name} />;
                        })}
                      </DropDownMenu>
                    </TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </form>
          </Dialog>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Dialog actions={alert} open={this.state.alert} >
            Un article avec ces propriétés existe déjà.
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}
