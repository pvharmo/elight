/*jshint esversion: 6 */
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../../languages/languages.js";
import moduleTypes from "/lib/moduleTypes.json";
import lodash from "lodash";

import FormFieldsWrapper from "./form/admin/FormFields.jsx";
import FormOptions from "./form/admin/Options.jsx";
import DatatableOptions from "./datatable/admin/Options.jsx";
import ChartOptions from "./chart/admin/Options.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from "material-ui/Toolbar";
import {Tabs, Tab} from "material-ui/Tabs";
import FlatButton from "material-ui/FlatButton";

//import moduleImport from "./moduleImport.js";

export default class ModuleSettingsWrapper extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);

    this.handleTabChange = this.handleTabChange.bind(this);

    this.state = {
      subscription: {
        modules: Meteor.subscribe("userModules"),
        moduleTypes: Meteor.subscribe("userModuleTypes"),
        schemas: Meteor.subscribe("userSchemas"),
        entities: Meteor.subscribe("userEntities"),
        pages: Meteor.subscribe("userPages"),
        fields: Meteor.subscribe("userFields")
      },
      rightDrawer: false,
      tab: "default"
    };
  }

  componentWillUnmount() {
    this.state.subscription.modules.stop();
    this.state.subscription.moduleTypes.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();
    this.state.subscription.pages.stop();
    this.state.subscription.fields.stop();
  }

  /*shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) {
      return true;
    } else {
      return false;
    }
  }*/

  module() {
    var singleModule = Modules.findOne({id:this.props.params.id});
    if (singleModule) {
      return singleModule.name;
    } else {
      return "";
    }
  }

  handleTabChange(value) {
    this.setState({tab:value});
  }

  singleModule() {
    //var module = [{}];
    //module = Modules.find({id:this.props.params.id}).fetch();
    return Modules.find({id:this.props.params.id}).fetch()[0];
  }

  moduleType() {
    return lodash.find(moduleTypes, {name: this.props.params.type});
    //return ModuleTypes.find({id: this.props.params.type}).fetch()[0];
  }

  tabs() {
    if (this.moduleType()) {
      return this.moduleType().tabs;
    } else {
      return [];
    }
  }

  tabsContent() {
    if (this.moduleType()) {
      var tabs = [];
      for (var i = 0; i < this.moduleType().tabsContent.length; i++) {

        switch (this.moduleType().tabsContent[i]) {
        case "Information":
          tabs.push(<div></div>);
          break;
        case "FormFieldsWrapper":
          tabs.push(<FormFieldsWrapper id={this.props.params.id} />);
          break;
        case "FormOptions":
          tabs.push(<FormOptions id={this.props.params.id} module={this.singleModule()} />);
          break;
        case "DatatableOptions":
          tabs.push(<DatatableOptions id={this.props.params.id} module={this.singleModule()} />);
          break;
        case "ChartOptions":
          tabs.push(<ChartOptions id={this.props.params.id} module={this.singleModule()} />);
          break;
        default:
          tabs.push(<div></div>);
        }
      }
      return tabs;
    } else {
      return [];
    }
  }

  render() {
    //var moduleType = ModuleTypes.find({id: this.singleModule().type}).fetch()[0];
    return (
      <div>
        <MuiThemeProvider>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={this.module()} />
            </ToolbarGroup>
            <ToolbarGroup>
              <Tabs onChange={this.handleTabChange} tabItemContainerStyle={{ backgroundColor: "rgba(0,0,0,0)", color: "rgba(0,0,0,0.4)"}} >
                {this.tabs().map((tab)=>{
                  return (
                    <Tab key={tab} value={tab} label={tab} style={{ backgroundColor: "rgba(0,0,0,0)", color: "rgba(0,0,0,0.4)", fontWeight: 400, padding: "0 35px"}} >
                    </Tab>
                  );
                })}
              </Tabs>
            </ToolbarGroup>
          </Toolbar>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Tabs value={this.state.tab} inkBarStyle={{display:"none"}} tabItemContainerStyle={{backgroundColor:"rgba(0,0,0,0)", color: "rgba(0,0,0,0.4)"}} >
            {this.tabsContent().map((tab, i)=>{
              var tabHeader = this.tabs()[i];
              return (
                <Tab key={tabHeader} value={tabHeader} label={tabHeader} style={{display:"none", backgroundColor:"rgba(0,0,0,0)", color: "rgba(0,0,0,0.4)", fontWeight: 400, padding: "0 35px"}} >
                  {tab}
                </Tab>
              );
            })}
          </Tabs>
        </MuiThemeProvider>
      </div>
    );
  }
}
