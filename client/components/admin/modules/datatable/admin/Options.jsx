
import React, {Component} from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";
import formStore from "/client/flux/stores/formStore";

import Form from "/client/components/FormGenerator/Form.jsx";

export default class Options extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.state = {
      subscription: {
        entities: Meteor.subscribe("userEntities"),
        modules: Meteor.subscribe("userModules"),
        schemas: Meteor.subscribe("userSchemas"),
        fields: Meteor.subscribe("userFields")
      },
      action: "",
      autocreate: false
    };
  }

  componentWillUnmount() {
    this.state.subscription.modules.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();
    this.state.subscription.fields.stop();
  }

  handleChangeAction(param, event, index, value) {
    var links = [];
    if (param === "schemas" || param === "schemasCurrent") {
      var schemas = [];
      this.schemas().map((schema)=>{
        schemas.push(schema.id);
      });
      var matches = [];
      value.map((val)=>{
        if (schemas.includes(val)) {
          //var type = Schemas.findOne({id:val}).type;
          matches.push(val);
        }
      });
      value = matches;
      if (param === "schemasCurrent") {
        for (var i = 0; i < matches.length; i++) {
          if (Schemas.findOne({id: matches[i]}).type === "link") {
            links.push(matches[i]);
          }
        }
        Meteor.call("updateParams", this.props.id, links, "params.links");
      }
    } /*else if(param === "schemasCurrent") {
      console.log(value);
      value = {value, type: Schemas.findOne({id:value}).type};
    }*/
    this.setState({[param]: value});
    Meteor.call("updateParams", this.props.id, value, "params." + param);
  }

  handleCheck(param, event, value) {
    Meteor.call("updateParams", this.props.id, value, "params." + param);
  }

  module() {
    if (Modules.find({id: this.props.id}).fetch()[0] === undefined) {
      return {
        params: {
          entity: "",
          schema: [],
          autocreate: false
        }
      };
    } else {
      return Modules.find({id: this.props.id}).fetch()[0];
    }
  }

  entities() {
    return Entities.find().fetch();
  }

  entitiesOptions() {
    var options = [];
    for (var i = 0; i < this.entities().length; i++) {
      options[i] = {};
      options[i].value = this.entities()[i].id;
      options[i].label = this.entities()[i].name;
    }
    return options;
  }

  schemas() {
    var options = [];
    if (formStore.getData("params") && formStore.getData("params").params) {
      var schemas = Schemas.find({entity:formStore.getData("params").params.entity}).fetch();
      for (var i = 0; i < schemas.length; i++) {
        options[i] = {};
        options[i].value = schemas[i].id;
        options[i].label = schemas[i].name;
      }
      return options;
    } else {
      return [];
    }
  }

  update() {
    this.forceUpdate();
  }

  render() {

    const fields = [
      {type: "dropdown", name: "params.entity", label: language().entity, options: this.entitiesOptions()},
      {type: "dropdown", name: "params.schemas", label: language().schemas, options: this.schemas(), multi: true}
    ];

    return (
      <div>
        <Form formId="params" fields={fields} data={this.props.module} update={this.update.bind(this)} />
      </div>
    );
  }
}
