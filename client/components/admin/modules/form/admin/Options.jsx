
import React, {Component} from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";
import formStore from "/client/flux/stores/formStore.js";

import Form from "/client/components/FormGenerator/Form.jsx";

export default class Options extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.handleChangeAction = this.handleChangeAction.bind(this);
    this.handleCheck = this.handleCheck.bind(this);

    this.state = {
      subscription: {
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
    this.state.subscription.fields.stop();
  }

  handleChangeAction(event, index, value) {
    this.setState({action: value});
    Meteor.call("updateParams", this.props.id, value, "params.action");
  }

  handleCheck(event, value) {
    Meteor.call("updateParams", this.props.id, value, "params.autocreate");
  }

  module() {
    if (Modules.find({id: this.props.id}).fetch()[0] === undefined) {
      return {
        params: {
          action: "",
          autocreate: false
        }
      };
    } else {
      return Modules.find({id: this.props.id}).fetch()[0];
    }
  }

  update() {
    this.forceUpdate();
  }

  render() {
    const fields = [
      {type: "dropdown", name: "params.action", label: language().actionOnConfirm, options: [
        {value: "search", label: "Recherche"},
        {value: "modifyItem", label: "Modifier l'enregistrement"}
      ]},
      {type: "checkbox", name: "params.autocreate", label: language().autocreate, condition(data) {
        if (data.params.action === "modifyItem") {
          return true;
        }
      }}
    ];

    return (
      <Form formId="params" fields={fields} data={{}} update={this.update.bind(this)} />
    );
  }

}
