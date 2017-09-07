
import React, {Component} from "react";
import ReactDOM from "react-dom";
import language from "../../../../../languages/languages.js";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import * as pageActions from "../../../../../flux/actions/PageActions";

import SingleField from "./SingleField.jsx";
import Form from "/client/components/FormGenerator/Form.jsx";

import Grid from "material-ui/Grid";
import Card, {CardHeader, CardContent, CardActions} from "material-ui/Card";
import Snackbar from "material-ui/Snackbar";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Done from "material-ui-icons/Done";
import Clear from "material-ui-icons/Clear";

export default class FormWrapper extends TrackerReact(React.Component) {

  constructor(props) {
    super(props);

    this.updateInput = this.updateInput.bind(this);
    this.AutoCompleteData = this.AutoCompleteData.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      subscription: {
        schemas: Meteor.subscribe("userSchemas"),
        fields: Meteor.subscribe("userFields"),
        items: Meteor.subscribe("userItems")
      },
      item: {},
      query: {},
      openSnackbar: false,
      requiredFields: {},
      error: {}
    };
  }

  componentWillUnmount() {
    this.state.subscription.schemas.stop();
    this.state.subscription.fields.stop();
    this.state.subscription.items.stop();
  }

  fields() {
    return Fields.find({module:this.props.module.id}).fetch();
  }

  items() {
    return Items.find().fetch();
  }

  updateInput(text, connection, field) {
    var newStateItem = this.state.item;
    var query = this.state.query;
    newStateItem[field] = text;
    query[connection] = {$regex: ".*" + text + ".*", $options:"i"};
    this.setState({item:newStateItem, query:query});
  }

  AutoCompleteData(fieldConnection) {
    var _this = this;
    var query = {};
    if (this.state.fieldConnection !== "") {
      query[this.state.fieldConnection] = this.state.searchText;
      query.schema = this.state.schemaConnection;
    }
    var itemsArray = [];
    var items = Items.find(query).fetch();

    for (var i = 0; i < items.length; i++) {
      itemsArray[i] = items[i][fieldConnection];
    }

    return _.uniq(itemsArray);
  }

  handleChange(field, value) {
    var newState = this.state.item;
    newState[field] = value;
    this.setState({item:newState});
  }

  confirm() {
    var _this = this;
    var search = {};
    var modificationsQuery = {};
    var item = {};
    var modifications = {};

    var error = {};
    var errorBool = false;
    for (var i = 0; i < this.fields().length; i++) {
      if (this.fields()[i].required && this.state.item[this.fields()[i].id] === "" || this.state.item[this.fields()[i].id] === undefined ) {
        error[this.fields()[i].id] = true;
        this.setState({error});
        errorBool = true;
      }
    }
    if (!errorBool) {
      var fieldConnection;
      switch (this.props.module.params.action) {
      case "search":
        pageActions.searchItem(this.props.module.id, this.state.item);
        break;
      case "createItem":
        for (var x = 0; x < this.fields().length; x++) {
          fieldConnection = Schemas.findOne({id:this.fields()[x].fieldConnection});
          modificationsQuery[fieldConnection.name] = this.state.item[this.fields()[x].id];
        }
        Meteor.call("createItem", search, modificationsQuery);
        break;

      case "deleteItem":
        if (search !== {}) {
          Meteor.call("deleteItem", search, modificationsQuery);
        } else {
          alert("You must fill at least one field to remove an item");
        }
        break;

      case "modifyItem":
        for (var y = 0; y < this.fields().length; y++) {
          fieldConnection = Schemas.findOne({id:this.fields()[y].fieldConnection});
          var field = fieldConnection.id;
          switch (this.fields()[y].action) {
          case "search":
            search[field] = this.state.item[this.fields()[y].id];
            search.entity = fieldConnection.entity;
            break;

          case "add":
            if (modificationsQuery.$inc === undefined) {
              modificationsQuery.$inc = {};
            }
            modificationsQuery.$inc[field] = Number(this.state.item[this.fields()[y].id]);
            modifications[field] = Number(this.state.item[this.fields()[y].id]);
            break;

          case "substract":
            if (modificationsQuery.$inc === undefined) {
              modificationsQuery.$inc = {};
            }
            modificationsQuery.$inc[field] = -Number(this.state.item[this.fields()[y].id]);
            modifications[field] = -Number(this.state.item[this.fields()[y].id]);
            break;

          case "multiply":
            if (modificationsQuery.$mul === undefined) {
              modificationsQuery.$mul = {};
            }
            modificationsQuery.$mul[field] = this.state.item[this.fields()[y].id];
            modifications[field] = Number(this.state.item[this.fields()[y].id]);
            break;

          case "divide":
            if (modificationsQuery.$mul === undefined) {
              modificationsQuery.$mul = {};
            }
            modificationsQuery.$mul[field] = 1/this.state.item[this.fields()[y].id];
            modifications[field] = Number(this.state.item[this.fields()[y].id]);
            break;

          case "modify":
            if (modificationsQuery.$set === undefined) {
              modificationsQuery.$set = {};
            }
            modificationsQuery.$set[field] = this.state.item[this.fields()[y].id];
            modifications[field] = this.state.item[this.fields()[y].id];
            break;

          default:
            console.error("Aucune action sélectionné.");
          }
        }
        Meteor.call("modifyItem", search, modificationsQuery, this.props.module.params.autocreate, modifications);
        break;
      default:
      }

      var fields = this.fields();

      for (var z = 0; z < fields.length; z++) {
        switch (fields[z].type) {
        case "date":
          item[fields[z].id] = null;
          break;
        case "tags":
          item[fields[z].id] = [];
          break;
        default:
          item[fields[z].id] = "";
        }
      }
      this.setState({item:item,query:{},openSnackbar:true});

      setTimeout(function(){
        _this.setState({openSnackbar:false});
      }, 4000);
    }
  }

  cancel() {
    this.setState({item:{},query:{}});
  }

  fieldsForm() {
    var fields = [];
    for (var i = 0; i < this.fields().length; i++) {
      fields[i] = {};
      fields[i].type = this.fields()[i].type;
      fields[i].name = this.fields()[i].connection;
      fields[i].label = this.fields()[i].name;
    }
    return fields;
  }

  render() {
    return (
      <Grid item xs={3} >
        <Card style={{width:"auto"}} >
          <CardHeader style={{width:"auto"}}
            title={this.props.module.name} />
          <CardContent style={{width:"auto"}}>
            <Form formId={this.props.module.id} fields={this.fieldsForm()} data={{}} />
          </CardContent>
          <CardActions style={{width:"auto"}}>
            <Button onClick={this.confirm}>
              Confirmer
            </Button>
          </CardActions>
          <Snackbar
            open={this.state.openSnackbar}
            style={{textAlign:"center"}}
            bodyStyle={{minWidth:"60px"}}
            message={<Done color="#FFF" style={{marginTop: "10px"}} />} />
        </Card>
      </Grid>
    );
  }

}

/*<Table selectable={false} >
  <TableBody displayRowCheckbox={false} >
    {this.fields().map((field,i)=>{
      var fieldConnection = Schemas.find({id:field.fieldConnection}).fetch()[0];
      return (<SingleField
        key={field.id}
        field={field}
        fieldConnection={fieldConnection}
        updateInput={this.updateInput}
        item={this.state.item}
        error={this.state.error[field.id]}
        searchText={this.state.item[field.id]}
        data={this.AutoCompleteData}
        handleChange={this.handleChange} />);
    })}
    <TableRow>
      <TableRowColumn style={{textAlign:"right"}} >{language().confirm}</TableRowColumn>
      <TableRowColumn>
        <Button onTouchTap={this.confirm} primary={true} icon={<Done />} />
        <Button onTouchTap={this.cancel} secondary={true} icon={<Clear />} style={{marginLeft:"15px"}} />
      </TableRowColumn>
    </TableRow>
  </TableBody>
</Table>*/
