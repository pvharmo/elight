
import React, {Component} from "react";
import ReactDOM from "react-dom";
import language from "/client/languages/languages";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import moment from "moment";
import _ from "lodash";
import * as pageActions from "/client/flux/actions/PageActions";

import Grid from "material-ui/Grid";
import {red, blue} from "material-ui/colors";
import Card, {CardActions, CardHeader, CardContent} from "material-ui/Card";
import Table, {TableBody, TableHead, TableRow, TableCell} from "material-ui/Table";
import Snackbar from "material-ui/Snackbar";
import Menu, {MenuItem} from "material-ui/Menu";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import ArrowDropDown from "material-ui-icons/ArrowDropDown";
import ArrowDropUp from "material-ui-icons/ArrowDropUp";
import Done from "material-ui-icons/Done";
import AvNotInterested from "material-ui-icons/NotInterested";
import Clear from "material-ui-icons/Clear";
import NavNext from "material-ui-icons/NavigateNext";
import NavPrev from "material-ui-icons/NavigateBefore";

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

  handleChange(menu, key, value) {
    this.setState({[key]:value});
    this.dataRequest({id: key, value: value});
    this.closeMenu(menu);
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

  openMenu(menu, event) {
    this.setState({[menu]: true, anchorEl: event.currentTarget});
  }

  closeMenu(menu) {
    this.setState({[menu]: false});
  }

  cells(data, header, id) {
    if (data[header.id]) {
      switch (header.type) {
      case "date":
        var d = moment(data[header.id]);
        return <TableCell key={id + header.id} style={{textAlign: "center"}} >{d.format("D/M/YYYY")}</TableCell>;
      case "checkbox":
        return (
          <TableCell key={id + header.id} >
            <Checkbox
              checked={data[header.id]}
              checkedIcon={<Done color={blue[500]} />}
              uncheckedIcon={<AvNotInterested color={red[500]} />}
              style={{margin:"0 auto", width:"24px"}} />
          </TableCell>
        );
      case "dropdown":
      case "tags":
        return (
          <TableCell key={id + header.id} style={{fontSize:16, color: "rgba(0,0,0,0.9)", textAlign: "center"}} >
            <Menu value={data[header.id].join()} underlineStyle={{display:"none"}} >
              <MenuItem
                value={data[header.id].join()}
                primaryText={data[header.id].join(", ")}
                style={{display:"none"}} />
              {data[header.id].map((value)=>{
                return <MenuItem key={value} primaryText={value} />;
              })}
            </Menu>
          </TableCell>
        );
      case "link":
        return <TableCell key={id + header.id} style={{textAlign: "center"}} >{Items.findOne({id: data[header.id], entity: header.params.entity})[header.params.schema]}</TableCell>;
      default:
        return <TableCell key={id + header.id} style={{textAlign: "center"}} >{data[header.id]}</TableCell>;
      }
    } else {
      return <TableCell key={id + header.id} ></TableCell>;
    }
  }

  render() {
    const reset = <div >{this.props.module.name} <Button onClick={this.resetSort.bind(this)} style={{marginLeft: "15px"}} >Réinitialiser le tri</Button></div>;
    return (
      <Grid item>
        <Card style={{width: "99%", margin: "1% auto"}}>
          <CardHeader
            title={reset} />
          <CardContent style={{paddingBottom: "8px"}} >
            <Table>
              <TableHead>
                <TableRow>
                  {this.columns().map((header) => {
                    return (
                      <TableCell key={header.id} style={{textAlign: "center"}} >
                        {header.name}
                        {this.state.sort["refItem." + header.name] == 1 ? (
                          <IconButton
                            className={"btn-sort-up-" + header.id}
                            onClick={this.sort.bind(this,-1, header.name, "refItem")}
                            style={{padding:0, width:30, height: 30, verticalAlign: "middle"}} >
                            <ArrowDropUp />
                          </IconButton>
                        ) : (
                          <IconButton
                            className={"btn-sort-down-" + header.id}
                            onClick={this.sort.bind(this,1, header.name, "refItem")}
                            style={{padding:0, width: 30, height: 30,  verticalAlign: "middle"}} >
                            <ArrowDropDown />
                          </IconButton>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.data().map((data)=>{
                  return (
                    <TableRow key={data.id} onClick={this.rowSelection.bind(this)} >
                      {this.columns().map((header)=>{
                        return this.cells(data, header, data.id);
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardActions>
            <IconButton
              onClick={this.changePage.bind(this, -1)}
              disabled={this.state.page > 1 ? false : true}
              style={{width: "30px", minWidth: "30px", marginLeft: "10px"}} >
              <NavPrev />
            </ IconButton>
            <Button
              onClick={this.openMenu.bind(this, "pageCount")}
              style={{width:40, minWidth:40}} >
              {this.state.page}
            </Button>
            <Menu
              open={this.state.pageCount}
              anchorEl={this.state.anchorEl}
              onRequestClose={this.closeMenu.bind(this, "pageCount")}
              style={{verticalAlign:"middle", marginRight:"-8px", marginBottom:"10px"}} >
              {this.pageCount().map((count)=>{
                return <MenuItem key={count} onClick={this.handleChange.bind(this, "pageCount", "page", count)} >{count}</MenuItem>;
              })}
            </Menu>
            <IconButton
              disabled={Math.ceil(this.length()/this.state.listSize) - 1 < this.state.page ? true : false}
              onClick={this.changePage.bind(this, 1)}
              style={{width: "40px", minWidth: "40px"}} >
              <NavNext />
            </IconButton>
            <label >Articles par pages</label>
            <Button
              onClick={this.openMenu.bind(this, "perPage")}
              style={{width:60, minWidth:60}} >
              {this.state.listSize}
            </Button>
            <Menu
              open={this.state.perPage}
              anchorEl={this.state.anchorEl}
              onRequestClose={this.closeMenu.bind(this, "perPage")}
              style={{verticalAlign:"middle", marginBottom:"10px"}} >
              <MenuItem onClick={this.handleChange.bind(this, "perPage", "listSize", 5)}>5</MenuItem>
              <MenuItem onClick={this.handleChange.bind(this, "perPage", "listSize", 10)}>10</MenuItem>
              <MenuItem onClick={this.handleChange.bind(this, "perPage", "listSize", 20)}>20</MenuItem>
              <MenuItem onClick={this.handleChange.bind(this, "perPage", "listSize", 50)}>50</MenuItem>
              <MenuItem onClick={this.handleChange.bind(this, "perPage", "listSize", 100)}>100</MenuItem>
            </Menu>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}
