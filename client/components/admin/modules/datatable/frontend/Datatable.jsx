/* global AggregationResult:true */
import React, {Component} from "react";
import ReactDOM from "react-dom";
import language from "../../../../../languages/languages";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import moment from "moment";
import _ from "lodash";
import * as pageActions from "../../../../../flux/actions/PageActions";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {cyan50, red500, blue500} from "material-ui/styles/colors";
import {Card, CardActions, CardHeader, CardText, CardMedia} from "material-ui/Card";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Snackbar from "material-ui/Snackbar";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import ArrowDropDown from "material-ui/svg-icons/navigation/arrow-drop-down";
import ArrowDropUp from "material-ui/svg-icons/navigation/arrow-drop-up";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Done from "material-ui/svg-icons/action/done";
import AvNotInterested from "material-ui/svg-icons/av/not-interested";
import Clear from "material-ui/svg-icons/content/clear";
import NavNext from "material-ui/svg-icons/image/navigate-next";
import NavPrev from "material-ui/svg-icons/image/navigate-before";

export default class FormWrapper extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      listSize: 5,
      sort: {},
      sortOrder: -1,
      sortColumn: "",
      data: []
    };
  }

  componentDidMount() {
    this.dataRequest();
  }

  dataRequest(arg) {
    var _this = this;
    var options = {
      entity:this.props.module.entity,
      sort: this.state.sort,
      listSize: this.state.listSize,
      page: this.state.page
    };
    if (Object.keys(options.sort).length === 0 && options.sort.constructor === Object) {
      options.sort = {date: 1};
    }
    if (arg) {
      options[arg.id] = arg.value;
    }
    //console.log(Meteor.call("dataRequest", this.props.module.entity, this.state.sort, this.state.listSize, this.state.page));
    Meteor.call("datatableRequest", options, _this.props.module, function(err, res) {
      if (err) {
        console.error(err);
      } else {
        _this.setState({data:res});
      }
    });
  }

  columns() {
    var columns = [];
    for (var i = 0; i < this.props.module.params.schemas.length; i++) {
      columns.push(Schemas.findOne({id: this.props.module.params.schemas[i], entity: this.props.module.params.entity}));
    }
    return columns;
  }

  columnsCurrent() {
    var columns = [];
    if (this.props.module.params.valuesSource === "HistoryVariations" || this.props.module.params.valuesSource === "History") {
      if (this.props.module.params.schemasCurrent) {
        this.props.module.params.schemasCurrent.map((val)=>{
          columns.push(Schemas.findOne({id: val, entity: this.props.module.params.entity}));
        });
      }
    }
    return columns;
  }

  length() {
    var items = 0;
    if (this.props.module.params.valuesSource === "History" || this.props.module.params.valuesSource === "HistoryVariations") {
      items = History.find({"refItem.entity": this.props.module.params.entity}).count();
    } else {
      items = Items.find().count();
    }
    return items;
  }

  data() {
    var skip = this.state.listSize * (this.state.page - 1);
    var options = {"sort": this.state.sort, limit:this.state.listSize, skip };
    for (var i = 0; i < this.columns().length; i++) {
      options[this.columns()[i]] = 1;
    }
    if (this.props.module.params.valuesSource === "History" || this.props.module.params.valuesSource === "HistoryVariations") {
      var data = [];
      var history = History.find({},options).fetch();
      //return history;
      return this.state.data;
    } else {
      options.sort = this.state.sort.refItem;
      return Items.find({},options).fetch();
    }
  }

  changePage(inc) {
    var page = this.state.page + inc;
    this.dataRequest({id: "page", value: page});
    this.setState({page});
  }

  listSize(index, value) {
    this.setState({listSize: value});
  }

  sort(order, column, columnsGroup) {
    var sort = this.state.sort;
    if (columnsGroup == "history") {
      if (this.props.module.params.valuesSource === "History") {
        sort["item." + column] = order;
      } else {
        sort["modifications." + column] = order;
      }
    } else if (columnsGroup === "date") {
      sort["date"] = order;
    } else {
      sort["refItem." + column] = order;
    }

    this.setState(sort);
    this.dataRequest({id: "sort", value: sort});
  }

  resetSort() {
    this.setState({sort:{}});
    this.dataRequest({id: "sort", value: {date:1}});
  }

  handleDropdownChange(event, i, value) {
    this.setState({page:value});
    this.dataRequest({id: "page", value: value});
  }

  handleChange(event, i, value) {
    this.setState({listSize:value});
    this.dataRequest({id: "listSize", value: value});
  }

  pageCount() {
    var pageCount = this.length()/this.state.listSize;
    var pageCountArray = [];
    for (var i = 0; i < Math.ceil(pageCount); i++) {
      pageCountArray[i] = i+1;
    }
    return pageCountArray;
  }

  rowSelection(index) {
    pageActions.searchItem(this.props.module.id, this.data()[index]);
  }

  cells(data, header, id) {
    if (data[header.id]) {
      switch (header.type) {
      case "date":
        var d = moment(data[header.id]);
        return <TableRowColumn key={id + header} style={{textAlign: "center"}} >{d.format("D/M/YYYY")}</TableRowColumn>;
      case "checkbox":
        return (
          <TableRowColumn key={id + header} >
            <Checkbox
              checked={data[header.id]}
              checkedIcon={<Done color={blue500} />}
              uncheckedIcon={<AvNotInterested color={red500} />}
              style={{margin:"0 auto", width:"24px"}} />
          </TableRowColumn>
        );
      case "dropdown":
      case "tags":
        return (
          <TableRowColumn key={id + header} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            <DropDownMenu value={data[header.id].join()} underlineStyle={{display:"none"}} >
              <MenuItem
                value={data[header.id].join()}
                primaryText={data[header.id].join(", ")}
                style={{display:"none"}} />
              {data[header.id].map((value)=>{
                return <MenuItem key={value} primaryText={value} />;
              })}
            </DropDownMenu>
          </TableRowColumn>
        );
      case "link":
        return <TableRowColumn key={id + header} style={{textAlign: "center"}} >{Items.findOne({id: data[header.id], entity: header.params.entity})[header.params.schema]}</TableRowColumn>;
      default:
        return <TableRowColumn key={id + header} style={{textAlign: "center"}} >{data[header.id]}</TableRowColumn>;
      }
    } else {
      return <TableRowColumn key={id + header} ></TableRowColumn>;
    }
  }

  render() {
    const reset = <div >{this.props.module.name} <RaisedButton label="Réinitialiser le tri" onTouchTap={this.resetSort.bind(this)} style={{marginLeft: "15px"}} /></div>;
    return (
      <div>
        <MuiThemeProvider>
          <Card style={{width: "99%", margin: "1% auto"}}>
            <CardHeader
              title={reset}
              titleStyle={{fontWeight: "400", fontSize: "24px"}}
              style={{paddingBottom: "8px"}}
            />
            <CardText style={{paddingBottom: "8px"}} >
              <Table selectable={true} onRowSelection={this.rowSelection.bind(this)} >
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                  <TableRow>
                    {this.props.module.params.showDate &&
                      <TableRowColumn style={{textAlign: "center"}} >
                        Date
                        {this.state.sort["date"] == 1 ? (
                          <IconButton
                            className={"btn-sort-up-date"}
                            onTouchTap={this.sort.bind(this,-1, "date", "date")}
                            style={{padding:0, width:30, height: 30, verticalAlign: "middle"}} >
                            <ArrowDropUp />
                          </IconButton>
                        ) : (
                          <IconButton
                            className={"btn-sort-down-date"}
                            onTouchTap={this.sort.bind(this,1, "date", "date")}
                            style={{padding:0, width: 30, height: 30,  verticalAlign: "middle"}} >
                            <ArrowDropDown />
                          </IconButton>
                        )}
                      </TableRowColumn>
                    }
                    {this.columnsCurrent().map((header) => {
                      return (
                        <TableRowColumn key={header.id} style={{textAlign: "center"}} >
                          {header.name}
                          {this.state.sort["refItem." + header.name] == 1 ? (
                            <IconButton
                              className={"btn-sort-up-" + header.id}
                              onTouchTap={this.sort.bind(this,-1, header.name, "refItem")}
                              style={{padding:0, width:30, height: 30, verticalAlign: "middle"}} >
                              <ArrowDropUp />
                            </IconButton>
                          ) : (
                            <IconButton
                              className={"btn-sort-down-" + header.id}
                              onTouchTap={this.sort.bind(this,1, header.name, "refItem")}
                              style={{padding:0, width: 30, height: 30,  verticalAlign: "middle"}} >
                              <ArrowDropDown />
                            </IconButton>
                          )}
                        </TableRowColumn>
                      );
                    })}
                    {this.columns().map((header) => {
                      return (
                        <TableRowColumn key={header.id} style={{textAlign: "center"}} >
                          {header.name}
                          {(this.state.sort["modifications." + header.name] == 1 || this.state.sort["item" + header.name] == 1) ? (
                            <IconButton
                              className={"btn-sort-up-" + header.id}
                              onTouchTap={this.sort.bind(this,-1, header.name, "history")}
                              style={{padding:0, width:30, height: 30, verticalAlign: "middle"}} >
                              <ArrowDropUp />
                            </IconButton>
                          ) : (
                            <IconButton
                              className={"btn-sort-down-" + header.id}
                              onTouchTap={this.sort.bind(this,1, header.name, "history")}
                              style={{padding:0, width: 30, height: 30,  verticalAlign: "middle"}} >
                              <ArrowDropDown />
                            </IconButton>
                          )}
                        </TableRowColumn>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} >
                  {this.data().map((data)=>{
                    var id = data.id;
                    var dataItem;
                    if (this.props.module.params.valuesSource === "History") {
                      dataItem = data.item;
                    } else if (this.props.module.params.valuesSource === "HistoryVariations") {
                      dataItem = data.modifications;
                    } else {
                      dataItem = data;
                    }
                    var d = moment(data.date);
                    return (
                      <TableRow key={id} hoverable={true} selectable={true} >
                        <TableRowColumn style={{textAlign: "center"}} >{d.format("D/M/YYYY")}</TableRowColumn>;
                        {this.columnsCurrent().map((header)=>{
                          return this.cells(data.refItem, header, id);
                        })}
                        {this.columns().map((header)=>{
                          return this.cells(dataItem, header, id);
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardText>
            <CardActions>
              <FlatButton
                icon={<NavPrev />}
                onTouchTap={this.changePage.bind(this, -1)}
                disabled={this.state.page > 1 ? false : true}
                style={{width: "30px", minWidth: "30px", marginLeft: "10px"}} />
              <DropDownMenu
                value={this.state.page}
                onChange={this.handleDropdownChange.bind(this)}
                style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
                {this.pageCount().map((count)=>{
                  return <MenuItem key={count} value={count} primaryText={count} />;
                })}
              </DropDownMenu>
              <FlatButton
                icon={<NavNext />}
                disabled={Math.ceil(this.length()/this.state.listSize) - 1 < this.state.page ? true : false}
                onTouchTap={this.changePage.bind(this, 1)}
                style={{width: "40px", minWidth: "40px"}} />
              <label >Articles par pages</label>
              <DropDownMenu
                value={this.state.listSize}
                onChange={this.handleChange.bind(this)}
                style={{verticalAlign:"middle", marginBottom:"10px"}} >
                <MenuItem value={5} primaryText="5" />
                <MenuItem value={10} primaryText="10" />
                <MenuItem value={25} primaryText="25" />
                <MenuItem value={50} primaryText="50" />
                <MenuItem value={100} primaryText="100" />
              </DropDownMenu>
            </CardActions>
          </Card>
        </MuiThemeProvider>
      </div>
    );
  }
}
