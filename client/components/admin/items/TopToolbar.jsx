/*jshint esversion: 6 */
import React, {Component} from "react";
import language from "../../../languages/languages.js";
import * as NavigationActions from "../../../flux/actions/NavigationActions.js";
import nav from "../../../flux/stores/NavigationStore.js";

import AdvancedSearchField from "./AdvancedSearchField.jsx";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {cyan50, cyan500, red500, blue500, grey600} from "material-ui/styles/colors";
import Dialog from "material-ui/Dialog";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from "material-ui/Toolbar";
import TextField from "material-ui/TextField";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import KeyboardArrowDown from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import Tune from "material-ui/svg-icons/image/tune";

export default class TopToolbar extends Component {
  constructor() {
    super();

    var _this = this;

    this.closeAdvancedSearch = this.closeAdvancedSearch.bind(this);
    this.search = this.search.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChange = this.handleChange.bind(this);

    if (Session.get("selected-entity-name") === undefined) {
      Session.set("selected-entity-name", "");
    }

    this.state = {
      advancedSearchDialog: false,
      title: Session.get("selected-entity-name")
    };
  }

  componentWillMount() {
    nav.on("schema-selected", this.changeTitle);
  }

  componentWillUnmount() {
    nav.removeListener("schema-selected", this.changeTitle);
  }

  changeTitle() {
    this.setState({title: Session.get("selected-entity-name")});
  }

  handleChange(event, index, value) {
    var text = document.getElementById("simple-search-text-field").value;
    this.setState({dropdown:text});
    NavigationActions.searchItem(this.state.text, value);
  }

  handleChangeText(event, value) {
    //_this.setState({text:value});
    NavigationActions.searchItem(value, this.state.dropdown);
  }

  selectMenuItem(value) {
    var text = document.getElementById("simple-search-text-field").value;
    this.setState({dropdown:value});
    NavigationActions.searchItem(text, value);
  }

  advancedSearch() {
    this.setState({advancedSearchDialog: true});
    Session.set("advanced-search", {});
  }

  closeAdvancedSearch() {
    this.setState({advancedSearchDialog: false});
  }

  search() {
    NavigationActions.advancedSearch();
    this.closeAdvancedSearch();
  }

  /*oneSchema() {
    //var schema = Session.get("selected-entity");
    var schema = this.props.schema;
    query = {};
    query.schema = schema;
    return Schemas.find(query,{sort: {order:1}}).fetch();
  }*/

  schema() {
    if (Session.get("selected-entity") !== undefined) {
      return Schemas.find({entity: Session.get("selected-entity")}, {sort: {order:1}}).fetch();
    } else {
      return [];
    }
  }

  clearSearch() {
    this.state.dropdown = "";
    document.getElementById("simple-search-text-field").value = "";
    NavigationActions.clearSearch();
  }

  newItem() {
    if (Session.get("selected-entity") == "" || Session.get("selected-entity") == undefined) {
      alert("You must select a schema before creating a new item.");
    } else {
      NavigationActions.newItem();
    }
  }

  render() {

    const actions = [
      <FlatButton
        label={language().cancel}
        primary={true}
        onTouchTap={this.closeAdvancedSearch}
      />,
      <FlatButton
        label={language().items.search}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.search}
      />,
    ];

    return (
      <MuiThemeProvider>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text={this.state.title} />
            <IconButton onTouchTap={this.newItem.bind(this)} tooltip={language().items.newItem} >
              <ContentAdd color={cyan500} />
            </IconButton>
          </ToolbarGroup>
          <ToolbarGroup>
            <FlatButton label={language().clear} primary={true} onTouchTap={this.clearSearch.bind(this)} />
            <TextField id="simple-search-text-field" onChange={this.handleChangeText} hintText={language().items.search} hintStyle={{color:"rgba(0,0,0,0.6)"}} underlineStyle={{borderBottomColor:"rgba(0,0,0,0.2)"}} ></TextField>
            <DropDownMenu value={this.state.dropdown}  style={{marginRight:-24}} iconStyle={{fill:"rgba(0,0,0,0.7)"}} iconButton={<KeyboardArrowDown />} >
              {this.schema().map((schema) =>{
                return (
                  <MenuItem key={schema.id} value={schema.id} primaryText={schema.name} onTouchTap={this.selectMenuItem.bind(this, schema.id)} />
                );
              })}
            </DropDownMenu>
            <IconButton tooltip={language().items.advancedSearch} onTouchTap={this.advancedSearch.bind(this)} >­
              <Tune color={grey600} />
            </IconButton>
            <Dialog title={language().items.advancedSearch} open={this.state.advancedSearchDialog} actions={actions} >
              <Table>
                <TableBody>
                  {// Show every entries of schema
                    this.schema().map( (schema)=>{
                      return (
                        <AdvancedSearchField key={schema.id} schema={schema} />
                      );
                    })}
                </TableBody>
              </Table>
            </Dialog>
          </ToolbarGroup>
        </Toolbar>
      </MuiThemeProvider>
    );
  }
}
