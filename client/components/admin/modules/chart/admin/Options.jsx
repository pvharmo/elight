import React, {Component} from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";
import formStore from "/client/flux/stores/formStore.js";

import Form from "/client/components/FormGenerator/Form.jsx";

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Menu, {MenuItem} from "material-ui/Menu";
// import DatePicker from "material-ui/DatePicker";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Tune from "material-ui-icons/Tune";

export default class Options extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.update = this.update.bind(this);

    this.state = {
      subscription: {
        entities: Meteor.subscribe("userEntities"),
        modules: Meteor.subscribe("userModules"),
        schemas: Meteor.subscribe("userSchemas"),
        fields: Meteor.subscribe("userFields"),
        items: Meteor.subscribe("userItems")
      },
      action: "",
      autocreate: false,
      xDialog: false,
      x: []
    };
  }

  componentWillUnmount() {
    this.state.subscription.modules.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();
    this.state.subscription.fields.stop();
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

  schemas(field) {
    var options = [];
    if (formStore.getData("params") && formStore.getData("params").params) {
      var schemas = Schemas.find({entity:formStore.getData("params").params.entity}).fetch();
      for (var i = 0; i < schemas.length; i++) {
        options[i] = {};
        options[i].value = schemas[i].id;
        options[i].label = schemas[i].name;
      }
      if (field === "x") {
        options.push({value: "_date", label:"Date"});
      }
      return options;
    } else {
      return [];
    }
  }

  y() {
    var options = [];
    if (formStore.getData("params") && formStore.getData("params").params) {
      var schemas = Schemas.find({entity:formStore.getData("params").params.entity}).fetch();
      for (var i = 0; i < schemas.length; i++) {
        if (schemas[i].type === "number") {
          options.push({value:schemas[i].id, label: schemas[i].name});
        }
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
      {type: "dropdown", name: "params.entity", label: language().entity, options:this.entitiesOptions()},
      {type: "dropdown", name: "params.x", label: language().x, options:this.schemas("x")},
      {type: "dropdown", name: "params.groupByDate", label: "Grouper par", options:[
        {value: "days", label: "Jours"},
        {value: "daysOfWeek", label:"Jours de la semaine"},
        {value: "months", label: "Mois"},
        {value: "monthsOfYear", label: "Mois de l'année"},
        {value: "years", label: "Années"}
      ], condition(data) {
        if (data.params.x === "_date") {
          return true;
        }
      }},
      {type: "date", name: "params.afterDate", label: "Après", condition(data) {
        if (data.params.x === "_date") {
          return true;
        }
      }},
      {type: "date", name: "params.BeforeDate", label: "Avant", condition(data) {
        if (data.params.x === "_date") {
          return true;
        }
      }},
      {type: "dropdown", name: "params.y", label: language().y, options:this.y()},
      {type: "dropdown", name: "params.chartType", label: language().graphType, options:[
        {value: "line", label: "Lignes"},
        {value: "bar", label: "Barres"},
        {value: "radar", label: "Radar"}
      ]},
      {type: "dropdown", name: "params.operation", label: "Opération", options:[
        {value: "$sum", label: "Somme"},
        {value: "$avg", label: "Moyenne"},
        {value: "$first", label: "Premier enregistrement"},
        {value: "$last", label: "Dernier enregistrement"},
        {value: "$max", label: "Maximum"},
        {value: "$min", label: "Minimum"}
      ]},
      {type: "dropdown", name: "params.chartLegend", label: language().chartLegend, options:this.schemas("chartLegend")},
    ];

    return (
      <Form formId={"params"} fields={fields} data={{}} update={this.update} />
    );
  }

}

// <Table selectable={false} >
//   <TableBody displayRowCheckbox={false} >
//     {(this.module().params.valuesSource === "HistoryVariations" || this.module().params.valuesSource === "History") &&
//       <TableRow style={{borderBottom: "none"}}>
//         <TableRowColumn style={{textAlign:"right"}} >Article</TableRowColumn>
//         <TableRowColumn>
//           <Menu
//             value={this.module().params.items}
//             onChange={this.handleChangeAction.bind(this, "items")}
//             multiple={true}
//             style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
//             {this.items().map((item)=>{
//               if (this.schemas()[0]) {
//                 return <MenuItem key={item.id} value={item.id} primaryText={item[this.schemas()[0].id]} />;
//               } else {
//                 return <div key={item.id}></div>;
//               }
//             })}
//           </ Menu>
//         </TableRowColumn>
//       </TableRow>
//     }
//   </TableBody>
// </Table>
