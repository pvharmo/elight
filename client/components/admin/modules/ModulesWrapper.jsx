
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import adminStore from "/client/flux/stores/adminStore.js";

import TopToolbar from "./TopToolbar.jsx";

import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {Scrollbars} from "react-custom-scrollbars";
import List from "@material-ui/core/List";

import ModuleSingle from "./ModuleSingle.jsx";

class ModulesWrapper extends TrackerReact(React.Component) {
  constructor() {
    super();

    this.update = this.update.bind(this);

    adminStore.on("section-selected", this.update);

    this.state = {
      subscription: {
        modules: Meteor.subscribe("userModules"),
        moduleTypes: Meteor.subscribe("userModuleTypes"),
        schemas: Meteor.subscribe("userSchemas"),
        entities: Meteor.subscribe("userEntities"),
        pages: Meteor.subscribe("userPages")
      }
    };
  }

  componentWillUnmount() {
    adminStore.removeListener("section-selected", this.update);

    this.state.subscription.modules.stop();
    this.state.subscription.moduleTypes.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();
    this.state.subscription.pages.stop();
  }

  modules() {
    return Modules.find({page:adminStore.getSections().section}, {sort: {order:1}}).fetch();
  }

  onHover(id) {
    this.setState({hover:id});
  }

  update() {
    this.forceUpdate();
  }

  render() {
    var height = window.innerHeight - 203;

    return(
      <div className="row" >
        <TopToolbar />
        <div id="modules-fields-list">
          <Scrollbars style={{width: "100%", height}} >
            <List>
              {this.modules().map( (module)=>{
                return (<ModuleSingle
                  key={module.id}
                  module={module}
                  onHover={this.onHover.bind(this)}
                  hover={this.state.hover} />);
              })}
            </List>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(ModulesWrapper);
