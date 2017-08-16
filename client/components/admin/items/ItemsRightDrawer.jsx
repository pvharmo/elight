/*jshint esversion: 6 */
import React, {Component} from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../../languages/languages.js";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";

import RightDrawer from "../rightDrawer/RightDrawer.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {red500} from "material-ui/styles/colors";
import RaisedButton from "material-ui/RaisedButton";
import {List, ListItem} from "material-ui/List";
import RemoveCircleOutline from "material-ui/svg-icons/content/remove-circle-outline";

export default class ItemsRightDrawer extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.state = {
      subscription: {
        entities:Meteor.subscribe("userEntities")
      },
    };
  }

  componentWillUnmount() {
    this.state.subscription.entities.stop();
  }

  entities() {
    return Entities.find().fetch();
  }

  sc() {
    var schemas = Entities.find().fetch();
    var schemasName = [];
    for (var i = 0; i < schemas.length; i++) {
      schemasName[i] = schemas[i].name;
    }
    return schemas;
  }

  selectSchema(id) {
    NavigationActions.selectSchema(id);
  }

  newItem() {
    NavigationActions.newItem();
  }

  openNewItemForm() {

  }

  render() {
    return (
      <RightDrawer
        list={this.entities()}
        onSelectListItem={this.selectSchema.bind(this)}
        newItem={this.openNewItemForm.bind(this)}
        text={this.state.newSchemaText}
        edit={false}
        newItem={false}
        activeItem={Session.get("selected-entity")}
        editDialog={
          <div></div>
        } />
    );
  }

  /*render() {
    return (
      <div>
        <MuiThemeProvider>
          <RaisedButton label={language().items.newItem} fullWidth={true} primary={true} onTouchTap={this.newItem.bind(this)} />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <List>
            {this.sc().map((schema)=>{
              return (
                <ListItem key={schema.id} primaryText={schema.name} onTouchTap={this.selectSchema.bind(this, schema.id)} />
              );
            })}
          </List>
        </MuiThemeProvider>
      </div>
    );
  }*/
}
