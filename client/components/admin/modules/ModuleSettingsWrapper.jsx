
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

import {grey} from "@material-ui/core/colors";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

//import moduleImport from "./moduleImport.js";

export default class ModuleSettingsWrapper extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);

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
      tab: "Information"
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

  module() {
    var singleModule = Modules.findOne({id:this.props.params.id});
    if (singleModule) {
      return singleModule.name;
    } else {
      return "";
    }
  }

  handleChange(event,value) {
    this.setState({tab:value});
  }

  singleModule() {
    return Modules.find({id:this.props.params.id}).fetch()[0];
  }

  moduleType() {
    return lodash.find(moduleTypes.types, {name: this.props.params.type});
  }

  tabs() {
    if (this.moduleType()) {
      return this.moduleType().tabs;
    } else {
      return [];
    }
  }

  tabsContent() {
    if (this.state.tab) {
      switch (this.state.tab) {
      case "Information":
        return <div></div>;
        break;
      case "FormFieldsWrapper":
        return <FormFieldsWrapper id={this.props.params.id} />;
        break;
      case "FormOptions":
        return <FormOptions id={this.props.params.id} module={this.singleModule()} />;
        break;
      case "DatatableOptions":
        return <DatatableOptions id={this.props.params.id} module={this.singleModule()} />;
        break;
      case "ChartOptions":
        return <ChartOptions id={this.props.params.id} module={this.singleModule()} />;
        break;
      default:
        return <div></div>;
      }
    } else {
      return <div></div>;
    }
  }

  render() {
    return (
      <div>
        <Tabs
          scrollable
          scrollButtons="auto"
          value={this.state.tab}
          onChange={this.handleChange.bind(this)}
          style={{backgroundColor: "rgba(0,0,0,0)", color: "rgba(0,0,0,0.4)"}} >
          {this.tabs().map((tab)=>{
            return (
              <Tab
                key={tab.name}
                value={tab.content}
                label={tab.name}
                style={{backgroundColor: "rgba(0,0,0,0)", color: "rgba(0,0,0,0.4)", fontWeight: 400, padding: "0 35px"}} />
            );
          })}
        </Tabs>
        {this.tabsContent()}
      </div>
    );
  }
}
