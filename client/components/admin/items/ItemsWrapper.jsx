
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../../languages/languages.js";
import adminStore from "/client/flux/stores/adminStore.js";

import ItemSingle from "./ItemSingle.jsx";
import TopToolbar from "./ItemsTopToolbar.jsx";

import {Scrollbars} from "react-custom-scrollbars";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";


export default class ItemsWrapper extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.setSearch = this.setSearch.bind(this);
    this.update = this.update.bind(this);

    adminStore.on("search-records", this.setSearch);
    adminStore.on("entity-selected", this.update);

    // this.searchItem = this.searchItem.bind(this);
    // this.getSelectedSchema = this.getSelectedSchema.bind(this);
    // this.advancedSearch = this.advancedSearch.bind(this);
    // this.clearSearch = this.clearSearch.bind(this);

    this.state = {
      subscription: {
        items:Meteor.subscribe("appItems"),
        schemas:Meteor.subscribe("appSchemas"),
        entities: Meteor.subscribe("appEntities"),
        history: Meteor.subscribe("appHistory"),
      },
      header: "",
      sortOrder: -1,
      search:"",
      searchHeader:"",
    };
  }


  componentWillUnmount() {
    adminStore.removeListener("search-records", this.setSearch);
    adminStore.removeListener("entity-selected", this.update);

    this.state.subscription.items.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.entities.stop();
  }

  update() {
    this.forceUpdate();
  }

  getSelectedSchema() {
    this.setState({selectedEntity: adminStore.getStructure().entity});
  }

  setSearch() {
    this.setState({search: adminStore.getStructure.search});
  }

  schemaItems() {

    var entity = adminStore.getStructure().entity;
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

  // selectSchema(schema) {
  //   Session.set("selected-entity", schema);
  // }

  oneSchema() {
    return Schemas.find({entity: adminStore.getStructure().entity},{sort: {order:1}}).fetch();
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

  /*searchItem() {
    var search = {};
    search[nav.getItemSearch().dropdown] = nav.getItemSearch().text;
    var searchHeader = nav.getItemSearch().dropdown;
    this.setState({search: search});
    this.setState({searchHeader: [searchHeader]});
  }*/

  /*advancedSearch() {
    var fields = Session.get("advanced-search");
    var keys = [];
    for (var k in fields) {
      keys.push(k);
    }
    this.setState({search: fields});
    this.setState({searchHeader: keys});
  }*/

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
    var stripState = true;
    var height = window.innerHeight - 199;

    return (
      <div className="row" >
        <TopToolbar />
        <div id="items-list">
          <Scrollbars style={{width: "100%", height}} >
            <Table >
              <TableHead style={{borderBottom: "2px solid rgba(0,0,0,0.5)"}} >
                <TableRow>
                  {this.oneSchema().map((header)=>{
                    if (header.showInList) {
                      return (
                        <TableCell
                          key={header.id}
                          style={{fontSize:18, color: "rgba(0,0,0,0.8)", fontWeight: 500, paddingBottom: "0", flex:1}} >
                          {header.name}
                          <IconButton
                            className={"btn-sort-up-" + header.id}
                            onClick={this.sortBy.bind(this,-1,header.id)}
                            style={{padding:0, width:30, height: 30, verticalAlign: "middle"}} >
                            <ArrowDropUp />
                          </IconButton>
                          <IconButton
                            className={"btn-sort-down-" + header.id}
                            onClick={this.sortBy.bind(this,1,header.id)}
                            style={{display:"none",padding:0, width: 30, height: 30,  verticalAlign: "middle"}} >
                            <ArrowDropDown />
                          </IconButton>
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              </TableHead>
              <TableBody id="items-table-body" style={{overflowY: "auto"}} >
                {this.schemaItems().map( (item)=>{
                  stripState = !stripState;
                  return (<ItemSingle
                    key={item.id}
                    item={item}
                    stripState={stripState}
                    schema={this.state.selectedEntity} />);
                })}
              </TableBody>
            </Table>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
