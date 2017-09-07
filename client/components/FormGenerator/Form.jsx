import React, {Component} from "react";
import * as formActions from "/client/flux/actions/formActions.js";
import formStore from "/client/flux/stores/formStore.js";

import Typography from "material-ui/Typography";
import Divider from "material-ui/Divider";
import TextField from "material-ui/TextField";
import {FormGroup, FormControlLabel} from "material-ui/Form";
import Card, {CardActions, CardContent} from "material-ui/Card";
import Collapse from "material-ui/transitions/Collapse";
import Checkbox from "material-ui/Checkbox";
import Button from "material-ui/Button";
import Switch from "material-ui/Switch";
import List, {ListItem, ListItemText} from "material-ui/List";
import Menu, {MenuItem} from "material-ui/Menu";
import Chip from "material-ui/Chip";
import IconButton from "material-ui/IconButton";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";

export default class NewFieldForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    var data = {};
    if (this.props.data) {
      data = this.props.data;
    }
    formActions.setData(this.props.formId, data);
  }

  handleCheck(name, event, value) {
    var data = formStore.getData(this.props.formId);
    this.setToValue(data, value, name);
    data[name] = value;
    formActions.setData(this.props.formId, data);
    if (this.props.update) {
      this.props.update(name);
    }
    this.forceUpdate();
  }

  handleChange(name, event) {
    var data = formStore.getData(this.props.formId);
    this.setToValue(data, event.target.value, name);
    data[name] = event.target.value;
    formActions.setData(this.props.formId, data);
    if (this.props.update) {
      this.props.update(name);
    }
    this.forceUpdate();
  }

  data(obj, path) {
    path = path.split(".");

    for (var i = 0; i < path.length - 1; i++) {
      if (!obj[path[i]]) {
        obj[path[i]] = {};
      }
      obj = obj[path[i]];
    }
    return obj[path[i]];
  }

  setToValue(obj, value, path) {
    path = path.split(".");

    for (var i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
      if (!obj) {
        obj = {};
      }
    }
    obj[path[i]] = value;
  }

  changeState(key, value) {
    this.setState({[key]:value});
  }

  handleClick(name, event, value, multi) {
    var data = formStore.getData(this.props.formId);
    if (multi) {
      var arr = this.data(data, name);
      if (arr) {
        arr.push(value);
      } else {
        arr = [value];
      }
      this.setToValue(data, arr, name);
      formActions.setData(this.props.formId, data);
    } else {
      this.setToValue(data, value, name);
      formActions.setData(this.props.formId, data);
    }
    if (event === "menu" && !multi) {
      this.changeState(name, false);
    }
    if (this.props.update) {
      this.props.update(name);
    }
    this.forceUpdate();
  }

  openMenu(menu, event) {
    this.setState({[menu]:true, anchorEl:event.currentTarget});
  }

  localChange(name, event) {
    this.setState({[name]: event.target.value});
  }

  handleEnter(name, event) {
    if (event.key === "Enter") {
      var value = [];
      if (this.data(formStore.getData(this.props.formId), name)) {
        value = this.data(formStore.getData(this.props.formId), name);
        value.push(this.state[name]);
      } else {
        value = [this.state[name]];
      }
      var data = formStore.getData(this.props.formId);
      this.setToValue(data, value, name);
      formActions.setData(this.props.formId, data);
      this.setState({[name]: ""});
    }
  }

  handleRequestDelete(name, event) {
    var data = this.data(formStore.getData(this.props.formId), name);
    var index = data.indexOf(event.label);
    data.splice(index, 1);
    this.setToValue(data, data, name);
    this.forceUpdate();
  }

  fields(index, field) {
    var data = formStore.getData(this.props.formId);
    if (field.name) {
      var value = this.data(data, field.name);
    }
    if (!field.condition || field.condition(data)) {
      switch (field.type) {
      case "title":
        return (
          <Typography key={index}>{field.label}</Typography>
        );
        break;
      case "text":
      case "number":
      case "date":
      case "password":
        return (
          <div key={field.name}>
            <TextField
              id={field.name}
              margin="normal"
              label={field.label}
              type={field.type}
              value={value}
              onChange={this.handleChange.bind(this, field.name)} />
          </div>
        );
      case "checkbox":
        return (
          <FormGroup key={field.name} >
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={this.handleClick.bind(this, field.name)} />
              }
              label={field.label} />
          </FormGroup>
        );
      case "button":
        return (
          <div key={field.name}>{field.label} : <Button onClick={this.props.update.bind(this, field.name)}>{value}</Button></div>
        );
        break;
      case "dropdown":
        if (Array.isArray(value)) {
          value = value.map((val)=>{
            return <span key={val}>{val}<br /></span>;
          });
        }
        return(
          <div key={field.name}>
            <List>
              <ListItem
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                aria-label={field.label}
                onClick={this.openMenu.bind(this, field.name)} >
                <ListItemText
                  primary={field.label}
                  secondary={value} />
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={this.state.anchorEl}
              open={this.state[field.name]}
              onRequestClose={this.changeState.bind(this, field.name, false)} >
              {field.options.map((option)=>{
                return (
                  <MenuItem
                    key={option.value}
                    onClick={this.handleClick.bind(this, field.name, "menu", option.value, field.multi)} >
                    {option.label}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        );
      case "chip":
        if (!value) {
          value = [];
        }
        return (
          <div id={"form-" + field.name} key={field.name} >
            <div style={{display: "flex", flexWrap: "wrap", maxWidth: "100%"}} >
              {value.map((val)=>{
                return (
                  <Chip
                    key={val}
                    label={val}
                    onRequestDelete={this.handleRequestDelete.bind(this, field.name)}
                    style={{margin:4}} />
                );
              })}
            </div>
            <div>
              <TextField
                value={this.state[field.name]}
                onChange={this.localChange.bind(this, field.name)}
                onKeyPress={this.handleEnter.bind(this, field.name)} />
            </div>
          </div>
        );
      case "switchesGroup":
        return (
          <div key={index}>
            <FormGroup row >
              {field.options.map((option)=>{
                value = this.data(data, option.value);
                if (option.switch) {
                  return (
                    <FormControlLabel key={option.value}
                      control={
                        <Switch
                          checked={value}
                          onChange={this.handleClick.bind(this, option.value)} />
                      }
                      label={option.label} />
                  );
                } else {
                  return (
                    <FormControlLabel key={option.value}
                      control={
                        <Checkbox
                          checked={value}
                          onChange={this.handleClick.bind(this, option.value)} />
                      }
                      label={option.label} />
                  );
                }
              })}
            </FormGroup>
          </div>
        );
        break;
      default:
        return <div key={index} >Erreur</div>;
      }
    } else {
      return <div key={field.name} ></div>;
    }
  }

  openCollapse(name) {
    this.setState({[name]: !this.state[name]});
  }

  render() {
    var style = {};

    return (
      <div>
        {this.props.fields.map((field, index)=>{
          if (field.type === "group") {
            if (this.state[field.name]) {
              style = {transform: "rotate(180deg)"};
            } else {
              style = {transform: "rotate(0deg)"};
            }
            return (
              <div key={index}>
                <Card style={{boxShadow: "none"}}>
                  <CardActions>
                    <Typography type="button">{field.label}</Typography>
                    <div style={{flex:1}}></div>
                    <IconButton
                      onClick={this.openCollapse.bind(this, field.name)}
                      style={style} >
                      <ExpandMoreIcon />
                    </IconButton>
                  </CardActions>
                  <Collapse in={this.state[field.name]}>
                    <CardContent style={{paddingTop: 0}}>
                      {field.options.map((option, i)=>{
                        return this.fields(i, option);
                      })}
                    </CardContent>
                  </Collapse>
                </Card>
                <Divider />
              </div>
            );
          } else {
            return this.fields(index, field);
          }
        })}
      </div>
    );
  }
}
