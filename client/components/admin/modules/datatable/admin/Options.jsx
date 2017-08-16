import React, {Component} from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";

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

  schemas() {
    return Schemas.find({entity:this.module().params.entity}).fetch();
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Table selectable={false} >
            <TableBody displayRowCheckbox={false} >
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right"}} >Source des données</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu value={this.module().params.valuesSource} onChange={this.handleChangeAction.bind(this, "valuesSource")} >
                    <MenuItem value="Items" primaryText="Valeur actuelle des articles" />
                    <MenuItem value="History" primaryText="Historique des articles" />
                    <MenuItem value="HistoryVariations" primaryText="Variation des valeurs des articles" />
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right"}} >{language().entity}</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu value={this.module().params.entity} onChange={this.handleChangeAction.bind(this, "entity")} >
                    {this.entities().map((entity)=>{
                      return <MenuItem key={entity.id} value={entity.id} primaryText={entity.name} />;
                    })}
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right"}} >{language().schemas}</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu value={this.module().params.schemas} onChange={this.handleChangeAction.bind(this, "schemas")} multiple={true} >
                    {this.schemas().map((schema)=>{
                      return <MenuItem key={schema.id} value={schema.id} primaryText={schema.name} />;
                    })}
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              {(this.module().params.valuesSource === "HistoryVariations" || this.module().params.valuesSource === "History") &&
                <TableRow style={{borderBottom: "none"}}>
                  <TableRowColumn style={{textAlign:"right"}} >{language().schemas} (valeurs actuelles)</TableRowColumn>
                  <TableRowColumn>
                    <DropDownMenu value={this.module().params.schemasCurrent} onChange={this.handleChangeAction.bind(this, "schemasCurrent")} multiple={true} >
                      {this.schemas().map((schema)=>{
                        return <MenuItem key={schema.id} value={schema.id} primaryText={schema.name} />;
                      })}
                    </ DropDownMenu>
                  </TableRowColumn>
                </TableRow>
              }
              {(this.module().params.valuesSource === "HistoryVariations" || this.module().params.valuesSource === "History") &&
                <TableRow style={{borderBottom: "none"}}>
                  <TableRowColumn style={{textAlign:"right"}} >Montrer la date de la modification</TableRowColumn>
                  <TableRowColumn>
                    <Checkbox checked={this.module().params.showDate} onCheck={this.handleCheck.bind(this, "showDate")} multiple={true} />
                  </TableRowColumn>
                </TableRow>
              }
            </TableBody>
          </Table>
        </MuiThemeProvider>
      </div>
    );
  }

}
