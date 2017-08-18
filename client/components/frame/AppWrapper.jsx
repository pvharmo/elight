
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";

import FormWrapper from "../admin/modules/form/frontend/FormWrapper.jsx";
import Datatable from "../admin/modules/datatable/frontend/Datatable.jsx";
import ChartWrapper from "../admin/modules/chart/frontend/Chart.jsx";

import { Scrollbars } from "react-custom-scrollbars";

export default class AppWrapper extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.state = {
      subscription: {
        modules: Meteor.subscribe("userModules"),
        moduleTypes: Meteor.subscribe("userModuleTypes"),
        schemas: Meteor.subscribe("userSchemas"),
        page: Meteor.subscribe("userPage"),
        items: Meteor.subscribe("userItems"),
        fields: Meteor.subscribe("userFields"),
        history: Meteor.subscribe("appHistory"),
      },
      rightDrawer: false,
    };
  }

  componentWillUnmount() {
    this.state.subscription.modules.stop();
    this.state.subscription.moduleTypes.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.page.stop();
    this.state.subscription.items.stop();
    this.state.subscription.fields.stop();
  }

  modules() {
    var page = Pages.find({id:this.props.params.id}).fetch();
    var renderModule = [];
    if (page.length > 0) {
      var modules = Modules.find({page:page[0].id}, {sort:{order:1}}).fetch();
      var moduleTypes = ModuleTypes.find().fetch();
      for (var i = 0; i < modules.length; i++) {
        switch (modules[i].type) {
        case "Datatable":
          renderModule.push(<Datatable key={modules[i].id} id={this.props.params.id} module={modules[i]} />);
          break;
        case "Form":
          renderModule.push(<FormWrapper key={modules[i].id} id={this.props.params.id} module={modules[i]} />);
          break;
        case "Chart":
          renderModule.push(<ChartWrapper key={modules[i].id} id={this.props.params.id} module={modules[i]} />);
          break;
        default:

        }
      }
    }
    return renderModule;
  }

  render() {
    var height = window.innerHeight - 78;
    var width = window.innerWidth;
    if (window.innerWidth > 900) {
      width = window.innerWidth - 200;
    }
    return (<Scrollbars style={{width, height}} >
      {this.modules().map((module)=>{
        return module;
      })}
    </Scrollbars>);
  }
}
