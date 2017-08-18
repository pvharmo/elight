
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../../languages/languages.js";
import list from "../../../flux/stores/FormStore.js";
import nav from "../../../flux/stores/NavigationStore.js";

import TopToolbar from "./TopToolbar.jsx";
import FormFieldsWrapper from "./form/admin/FormFields.jsx";
import ModulesRightDrawer from "./ModulesRightDrawer.jsx";

import { Scrollbars } from "react-custom-scrollbars";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import IconButton from "material-ui/IconButton";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import ArrowDropDown from "material-ui/svg-icons/navigation/arrow-drop-down";
import ArrowDropUp from "material-ui/svg-icons/navigation/arrow-drop-up";

import ModuleSingle from "./ModuleSingle.jsx";

export default class ModulesWrapper extends TrackerReact(React.Component) {
  constructor() {
    super();

    this.openNewPageDialog = this.openNewPageDialog.bind(this);
    this.cancelNewPage = this.cancelNewPage.bind(this);
    this.handleChangeNewPage = this.handleChangeNewPage.bind(this);
    this.newPage = this.newPage.bind(this);

    this.state = {
      subscription: {
        modules: Meteor.subscribe("userModules"),
        moduleTypes: Meteor.subscribe("userModuleTypes"),
        schemas: Meteor.subscribe("userSchemas"),
        entities: Meteor.subscribe("userEntities"),
        pages: Meteor.subscribe("userPages")
      },
      rightDrawer: false,
      newPageDialog: false,
      alert: false
    };
  }

  componentWillMount() {
    nav.on("new-page", this.openNewPageDialog);
  }

  componentWillUnmount() {
    this.state.subscription.modules.stop();
    this.state.subscription.moduleTypes.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();
    this.state.subscription.pages.stop();

    nav.removeListener("new-page", this.openNewPageDialog);
  }

  oneModule() {
    return Modules.find({page:Session.get("selected-page")}, {sort: {order:1}}).fetch();
  }

  newPage() {
    var pagesName = this.state.newPagesName;

    var double = Pages.findOne({name: pagesName});

    if (double) {
      this.setState({alert:true});
    } else {
      this.setState({newPageDialog: false});
      Meteor.call("newPage", this.state.newPagesName);
      this.setState({newPagesName: ""});
    }
  }

  cancelNewPage() {
    this.setState({newPageDialog: false});
  }

  openNewPageDialog() {
    this.setState({newPageDialog: true});
  }

  handleChangeNewPage(event, value) {
    this.setState({newPagesName: value});
  }

  closeAlert() {
    this.setState({alert: false});
  }

  render() {
    var stripState = true;
    var height = window.innerHeight - 203;

    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.cancelNewPage}
      />,
      <FlatButton
        label={language().save}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.newPage}
      />
    ];

    const alert = [
      <FlatButton
        label={language().close}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.closeAlert.bind(this)}
      />
    ];

    var style = {};

    if (window.innerWidth > 1600) {
      style.paddingRight = "300px";
      style.width = window.innerWidth - 500;
    }

    return(
      <div className="row" style={style} >
        <TopToolbar />
        <ModulesRightDrawer />
        <div id="modules-fields-list">
          <MuiThemeProvider>
            <Dialog title={language().pages.newPage} open={this.state.newPageDialog} actions={actions} >
              <TextField
                hintText={language().pages.newPagesName}
                onChange={this.handleChangeNewPage}
                value={this.state.newPagesName} />
            </Dialog>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Dialog
              actions={alert}
              open={this.state.alert}
            >
              Un article avec ces propriétés existe déjà.
            </Dialog>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{borderBottom: "2px solid rgba(0,0,0,0.5)"}} >
                <TableRow>
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                    {language().schemas.list.name}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                    {language().schemas.list.type}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >
                    {language().schemas.list.order}
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
                <TableBody>
                  {this.oneModule().map( (module)=>{
                    stripState = !stripState;
                    return (<ModuleSingle key={module.id} stripState={stripState} module={module} />);
                  })}
                </TableBody>
              </Table>
            </MuiThemeProvider>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
