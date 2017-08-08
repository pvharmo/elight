/*jshint esversion: 6 */
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../languages/languages.js";
import nav from "../stores/NavigationStore.js";

import ItemsForm from "./ItemsForm.jsx";
import ItemSingle from "./ItemSingle.jsx";
import ItemsFormWrapper from "./ItemsFormWrapper.jsx";
import TopToolbar from "./TopToolbar.jsx";
import ItemsEditFormWrapper from "./ItemsEditFormWrapper.jsx";
import ItemsRightDrawer from "./ItemsRightDrawer.jsx";

import { Scrollbars } from "react-custom-scrollbars";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import IconButton from "material-ui/IconButton";
import ArrowDropDown from "material-ui/svg-icons/navigation/arrow-drop-down";
import ArrowDropUp from "material-ui/svg-icons/navigation/arrow-drop-up";

Items = new Mongo.Collection("items");
History = new Mongo.Collection("history");

//Component that wrap the form and the list of items
export default class ItemsWrapper extends TrackerReact(React.Component) {

  //subscribe to userItems and userSchemas
  constructor() {
    super();

    this.searchItem = this.searchItem.bind(this);
    this.getSelectedSchema = this.getSelectedSchema.bind(this);
    this.advancedSearch = this.advancedSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);

    this.state = {
      subscription: {
        items:Meteor.subscribe("userItems"),
        schemas:Meteor.subscribe("userSchemas"),
        entities: Meteor.subscribe("userEntities"),
        history: Meteor.subscribe("appHistory"),
      },
      header: "",
      sortOrder: -1,
      search:"",
      searchHeader:"",
    };
  }

  componentWillMount() {
    var _state = this.state;
    _state.selectedEntity = Session.get("selected-entity");
    this.setState(_state);

    nav.on("schema-selected", this.getSelectedSchema);
    nav.on("search-item", this.searchItem);
    nav.on("advanced-search", this.advancedSearch);
    nav.on("clear-search", this.clearSearch);
  }

  // Stop subscription to items and schemas
  componentWillUnmount() {
    this.state.subscription.items.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();

    nav.removeListener("schema-selected", this.getSelectedSchema);
    nav.removeListener("search-item", this.searchItem);
    nav.removeListener("advanced-search", this.advancedSearch);
    nav.removeListener("clear-search", this.clearSearch);
  }

  getSelectedSchema() {
    this.setState({selectedEntity: Session.get("selected-entity")});
  }

  // Fetch Items collection for the selected schema
  schemaItems() {
    var entity = this.state.selectedEntity;
    var sortQuery = {};
    sortQuery[this.state.header] = this.state.sortOrder;
    var query = {};
    query.entity = entity;

    // Adds the search to the query
    if (this.state.searchHeader !== []) {
      for (var i = 0; i < this.state.searchHeader.length; i++) {
        var header = this.state.searchHeader[i];
        var key = header + ".value";
        query[key] = {};
        query[key] = {$regex: ".*" + this.state.search[header] + ".*", $options:"i"};
      }
      //query[this.state.searchHeader] = {$regex: '.*' + this.state.search + '.*', $options:"i"};
    }

    //sort the query if header isnt empty
    if(this.state.header !== "") {
      return Items.find(query,{sort: sortQuery}).fetch();
    } else {
      return Items.find(query).fetch();
    }
  }

  schemas() {
    return Schemas.find().fetch();
  }

  distinctSchemas() {
    var schemasArray =[];
    for (var i = 0; i < this.schemas().length; i++) {
      schemasArray.push(this.schemas()[i].schema);
    }
    return _.uniq(schemasArray);
  }

  selectSchema(schema) {
    Session.set("selected-entity", schema);
  }

  oneSchema() {
    return Schemas.find({entity: Session.get("selected-entity")},{sort: {order:1}}).fetch();
  }

  sortBy(order,header) {
    this.setState({sortOrder:order});
    this.setState({header:header});
    var upArrow = document.getElementsByClassName("btn-sort-up-" + header)[0];
    var downArrow = document.getElementsByClassName("btn-sort-down-" + header)[0];
    if (order == -1) {
      upArrow.style.display = "none";
      downArrow.style.display = "inline-block";
    } else {
      upArrow.style.display = "inline-block";
      downArrow.style.display = "none";
    }
  }

  searchItem() {
    var search = {};
    search[nav.getItemSearch().dropdown] = nav.getItemSearch().text;
    var searchHeader = nav.getItemSearch().dropdown;
    this.setState({search: search});
    this.setState({searchHeader: [searchHeader]});
  }

  advancedSearch() {
    var fields = Session.get("advanced-search");
    var keys = [];
    for (var k in fields) {
      keys.push(k);
    }
    this.setState({search: fields});
    this.setState({searchHeader: keys});
  }

  clearSearch() {
    this.setState({search: {}});
    this.setState({searchHeader: []});
  }

  tableHeader() {
    var schemasArray = this.oneSchema();
    var tableHeaderArray = [];
    for (var i = 0; i < schemasArray.length; i++) {
      if (schemasArray[i].showInList) {
        tableHeaderArray.push(schemasArray[i].id);
      }
    }
    return tableHeaderArray;
  }

  render() {
    Session.set("tableHeader", this.tableHeader());
    var tableHeader = this.tableHeader();
    var stripState = true;
    var height = window.innerHeight - 199;

    var style = {};

    if (window.innerWidth > 1600) {
      style.paddingRight = "300px";
      style.width = window.innerWidth - 500;
    }

    return (
      <div className="row" style={style} >
        <TopToolbar />
        <ItemsRightDrawer />
        <ItemsEditFormWrapper />
        <div id="items-list">
          <ItemsFormWrapper />
          <MuiThemeProvider>
            <Table >
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{borderBottom: "2px solid rgba(0,0,0,0.5)"}} >
                <TableRow>
                  {this.oneSchema().map((header)=>{
                    return (
                      <TableHeaderColumn key={header.id} style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500, paddingBottom: "0"}} >
                        {header.name}
                        <IconButton className={"btn-sort-up-" + header.id} onTouchTap={this.sortBy.bind(this,-1,header.id)} style={{padding:0, width:30, height: 30, verticalAlign: "middle"}} >
                          <ArrowDropUp />
                        </IconButton>
                        <IconButton className={"btn-sort-down-" + header.id}  onTouchTap={this.sortBy.bind(this,1,header.id)} style={{display:"none",padding:0, width: 30, height: 30,  verticalAlign: "middle"}} >
                          <ArrowDropDown />
                        </IconButton>
                      </TableHeaderColumn>
                    );
                  })}
                  <TableHeaderColumn style={{fontSize:18, color: "rgba(0,0,0,0.8)", textAlign: "center", fontWeight: 500}} >{language().items.edit}</TableHeaderColumn>
                </TableRow>
              </TableHeader>
            </Table>
          </MuiThemeProvider>
          <Scrollbars style={{width: "100%", height}} >
            <MuiThemeProvider>
              <Table >
                <TableBody id="items-table-body" showRowHover={true} style={{overflowY: "auto"}} >
                      {this.schemaItems().map( (item)=>{
                        stripState = !stripState;
                        return (<ItemSingle key={item.id} item={item} stripState={stripState} schema={this.state.selectedEntity} />);
                      })}
                </TableBody>
              </Table>
            </MuiThemeProvider>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
