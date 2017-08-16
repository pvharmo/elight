import React, {Component} from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import DatePicker from "material-ui/DatePicker";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import IconButton from "material-ui/IconButton";
import Tune from "material-ui/svg-icons/image/tune";

export default class Options extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

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
      xDialog: false
    };
  }

  componentWillUnmount() {
    this.state.subscription.modules.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();
    this.state.subscription.fields.stop();
  }

  handleChangeAction(param, event, index, value) {
    if (param === "schemas") {
      var schemas = [];
      this.schemas().map((schema)=>{
        schemas.push(schema.id);
      });
      var matches = [];
      value.map((val)=>{
        if (schemas.includes(val)) {
          matches.push(val);
        }
      });
      value = matches;
    }
    this.setState({[param]: value});
    Meteor.call("updateParams", this.props.id, value, "params." + param);
  }

  handleChange(param, event, value) {
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

  items() {
    return Items.find({entity:this.module().params.entity}).fetch();
  }

  handleClose(dialog) {
    this.setState({[dialog]: false});
  }

  handleOpen(dialog) {
    this.setState({[dialog]: true});
  }

  render() {

    const xDialogActions = [];

    return (
      <div>
        <MuiThemeProvider>
          <Table selectable={false} >
            <TableBody displayRowCheckbox={false} >
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right"}} >Source des données</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu
                    value={this.module().params.valuesSource}
                    onChange={this.handleChangeAction.bind(this, "valuesSource")}
                    style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                    {/*<MenuItem value="Items" primaryText="Valeur actuelle des articles" />*/}
                    <MenuItem value="History" primaryText="Historique des articles" />
                    <MenuItem value="HistoryVariations" primaryText="Variation des valeurs des articles" />
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right"}} >{language().entity}</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu
                    value={this.module().params.entity}
                    onChange={this.handleChangeAction.bind(this, "entity")}
                    style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                    {this.entities().map((entity)=>{
                      return <MenuItem key={entity.id} value={entity.id} primaryText={entity.name} />;
                    })}
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right"}} >{language().x}</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu
                    value={this.module().params.x}
                    onChange={this.handleChangeAction.bind(this, "x")}
                    multiple={false}
                    style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                    {this.schemas().map((schema)=>{
                      return <MenuItem key={schema.id} value={schema.id} primaryText={schema.name} />;
                    })}
                    <MenuItem value="date" primaryText="Date" />
                  </ DropDownMenu>
                  {this.module().params.x === "date" &&
                    <span>
                      <IconButton onTouchTap={this.handleOpen.bind(this, "xDialog")} style={{verticalAlign:"middle", marginRight:"-8px"}} >
                        <Tune />
                      </IconButton>
                      <Dialog open={this.state.xDialog} title={"Options"} actions={xDialogActions} onRequestClose={this.handleClose.bind(this, "xDialog")}>
                        <Table selectable={false} >
                          <TableBody displayRowCheckbox={false} >
                            <TableRow style={{borderBottom: "none"}}>
                              <TableRowColumn style={{textAlign:"right"}} >Interval régulier</TableRowColumn>
                              <TableRowColumn>
                                <Checkbox checked={true} disabled={true} />
                              </TableRowColumn>
                            </TableRow>
                            <TableRow style={{borderBottom: "none"}}>
                              <TableRowColumn style={{textAlign:"right"}} >Grouper par</TableRowColumn>
                              <TableRowColumn>
                                <DropDownMenu
                                  value={this.module().params.groupByDate}
                                  onChange={this.handleChangeAction.bind(this, "groupByDate")}
                                  style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                                  <MenuItem value="days" primaryText="Jours" />
                                  <MenuItem value="daysOfWeek" primaryText="Jours de la semaine" />
                                  <MenuItem value="months" primaryText="Mois" />
                                  <MenuItem value="monthsOfYear" primaryText="Mois de l'année" />
                                  <MenuItem value="years" primaryText="Années" />
                                </ DropDownMenu>
                              </TableRowColumn>
                            </TableRow>
                            <TableRow style={{borderBottom: "none"}}>
                              <TableRowColumn style={{textAlign:"right"}} >Grouper par</TableRowColumn>
                              <TableRowColumn>
                                <DatePicker id="afterDate" floatingLabelText={"Après"} value={this.module().params.afterDate} onChange={this.handleChange.bind(this, "afterDate")} />
                                <DatePicker id="beforeDate" floatingLabelText={"Avant"} value={this.module().params.beforeDate} onChange={this.handleChange.bind(this, "beforeDate")} />
                              </TableRowColumn>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Dialog>
                    </span>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right", borderBottom: "none"}} >{language().y}</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu
                    value={this.module().params.y}
                    onChange={this.handleChangeAction.bind(this, "y")}
                    multiple={false}
                    style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                    {this.schemas().map((schema)=>{
                      return <MenuItem key={schema.id} value={schema.id} primaryText={schema.name} />;
                    })}
                    <MenuItem value="date" primaryText="Date" />
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right", borderBottom: "none"}} >{language().graphType}</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu
                    value={this.module().params.chartType}
                    onChange={this.handleChangeAction.bind(this, "chartType")}
                    style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                    <MenuItem value="line" primaryText="Lignes" />
                    <MenuItem value="bar" primaryText="Barres" />
                    <MenuItem value="radar" primaryText="Radar" />
                    {/*<MenuItem value="pie" primaryText="Secteurs" />*/}
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right"}} >Opération</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu
                    value={this.module().params.operation}
                    onChange={this.handleChangeAction.bind(this, "operation")}
                    style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                    <MenuItem value="$sum" primaryText="Somme" />
                    <MenuItem value="$avg" primaryText="Moyenne" />
                    <MenuItem value="$first" primaryText="Première entrée" />
                    <MenuItem value="$last" primaryText="Dernière entrée" />
                    <MenuItem value="$max" primaryText="Maximum" />
                    <MenuItem value="$min" primaryText="Minimum" />
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              <TableRow style={{borderBottom: "none"}}>
                <TableRowColumn style={{textAlign:"right", borderBottom: "none"}} >{language().chartLegend}</TableRowColumn>
                <TableRowColumn>
                  <DropDownMenu
                    value={this.module().params.chartLegend}
                    onChange={this.handleChangeAction.bind(this, "chartLegend")}
                    style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                    {this.schemas().map((schema)=>{
                      return <MenuItem key={schema.id} value={schema.id} primaryText={schema.name} />;
                    })}
                  </ DropDownMenu>
                </TableRowColumn>
              </TableRow>
              {(this.module().params.valuesSource === "HistoryVariations" || this.module().params.valuesSource === "History") &&
                <TableRow style={{borderBottom: "none"}}>
                  <TableRowColumn style={{textAlign:"right"}} >Article</TableRowColumn>
                  <TableRowColumn>
                    <DropDownMenu
                      value={this.module().params.items}
                      onChange={this.handleChangeAction.bind(this, "items")}
                      multiple={true}
                      style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                      {this.items().map((item)=>{
                        if (this.schemas()[0]) {
                          return <MenuItem key={item.id} value={item.id} primaryText={item[this.schemas()[0].id]} />;
                        } else {
                          return <div key={item.id}></div>;
                        }
                      })}
                    </ DropDownMenu>
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
