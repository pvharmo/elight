
import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import nav from "../../flux/stores/NavigationStore.js";
import formStore from "/client/flux/stores/formStore.js";

import Form from "../FormGenerator/Form.jsx";

import Grid from "material-ui/Grid";
import GridList, {GridListTile} from "material-ui/GridList";
import Button from "material-ui/Button";
import Card, {CardHeader, CardContent} from "material-ui/Card";
import Typography from "material-ui/Typography";
import List, {ListItem, ListItemIcon, ListItemText} from "material-ui/List";
import Dialog, {DialogActions, DialogContent, DialogTitle} from "material-ui/Dialog";


export default class AppForm extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.state = {
      subscription: {
        modules: Meteor.subscribe("userModules"),
        moduleTypes: Meteor.subscribe("userModuleTypes"),
        schemas: Meteor.subscribe("userSchemas"),
        pages: Meteor.subscribe("userPages"),
        user: Meteor.subscribe("user"),
        apps: Meteor.subscribe("userApps"),
        models: Meteor.subscribe("models")
      },
      navDrawer: false,
      page: FlowRouter.getRouteName(),
      selectApp: false,
      dialog: false,
      editApp: false,
      selectModel: false
    };
  }

  componentWillMount() {
    nav.on("open-nav-drawer", ()=> {
      var navDrawerState = this.state.navDrawer;
      this.setState({
        "navDrawer": !navDrawerState
      });

    });
  }

  componentWillUnmount() {
    this.state.subscription.modules.stop();
    this.state.subscription.moduleTypes.stop();
    this.state.subscription.schemas.stop();
    this.state.subscription.pages.stop();
    this.state.subscription.user.stop();
    this.state.subscription.apps.stop();
    this.state.subscription.models.stop();
  }

  title() {
    var user = Meteor.users.find().fetch()[0];
    if (user) {
      var app = Apps.find({id:user.selectedApp}).fetch()[0];
      if (app) {
        return app;
      } else {
        return {name:"", subtitle: ""};
      }
    } else {
      return {name:"", subtitle: ""};
    }
  }

  closeNav() {
    this.setState({
      "navDrawer": false
    });
  }

  apps() {
    return Apps.find().fetch();
  }

  pages() {
    return Pages.find().fetch();
  }

  models() {
    if (Apps.find({isModel: true}).fetch()) {
      return Apps.find({isModel: true}).fetch();
    } else {
      return [];
    }
  }

  go(route) {
    FlowRouter.go(route);
  }

  open() {
    this.setState({dialog: true});
  }

  selectApp(id) {
    Meteor.call("selectApp", id);
    location.reload();
    // this.close();
  }

  go(route) {
    FlowRouter.go(route);
  }

  module() {
    var id;
    var module = Modules.find().fetch()[0];
    if (module) {
      id = module.id;
    } else {
      id = "";
    }
    return id;
  }

  close() {
    this.setState({dialog:false});
  }

  saveNewApp() {
    Meteor.call("newApp", formStore.getData("newApp").name);
    this.cancel();
  }

  cancel() {
    this.props.close();
  }

  saveEditApp() {
    if (formStore.getData("editApp")) {
      Meteor.call("editApp", formStore.getData("editApp"));
    }
    this.cancel();
  }

  deleteApp() {
    Meteor.call("deleteApp");
    this.setState({editApp: false, dialog: true});
  }

  editApp() {
    this.setState({editApp: true});
  }

  update(field) {
    if (field === "model") {
      this.setState({selectModel: true});
    }
  }

  selectModel(app) {
    Meteor.call("editApp", {model:app.id});
  }

  cancelSelectModel() {
    this.setState({selectModel: false});
  }

  render() {
    const fields = [
      {type:"text", name: "name", label: "Nom"},
      {type:"button", name: "model", label: "Modèle"},
      {type:"checkbox", name: "isModel", label: "En faire un modèle"},
      {type:"checkbox", name: "public", label: "Modèle publique", condition: function(data){
        if (data.isModel) {
          return true;
        }
      }}
    ];

    return (
      <div>
        <Dialog open={this.props.new} onClose={this.cancel.bind(this)} >
          <DialogTitle>
            Nouvelle application
          </DialogTitle>
          <DialogContent>
            <Form formId="newApp" fields={fields} data={{model: "Aucun"}} update={this.update.bind(this)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancel.bind(this)}>Annuler</Button>
            <Button onClick={this.saveNewApp.bind(this)} >Enregistrer</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.props.editApp} onClose={this.cancel.bind(this)} >
          <DialogTitle>
            {this.title().name}
          </DialogTitle>
          <DialogContent>
            <Form formId="editApp" fields={fields} data={this.title()} update={this.update.bind(this)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancel.bind(this)} color="primary" >Annuler</Button>
            <Button onClick={this.deleteApp.bind(this)} color="secondary" >Supprimer</Button>
            <Button onClick={this.saveEditApp.bind(this)} color="primary" >Enregistrer</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.selectModel} onClose={this.cancel.bind(this)} maxWidth="md" >
          <DialogTitle>
            Sélectionner un modèle
          </DialogTitle>
          <DialogContent >
            <Grid container >
              <Grid item xs={3}>
                <List>
                  <ListItem>
                    <ListItemText primary="test" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="test 2" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={9}>
                <GridList cols={3} spacing={5} cellHeight={150} style={{paddingTop:5}}>
                  {this.models().map((app)=>{
                    return (
                      <GridListTile
                        key={app.id}
                        cols={1}
                        onClick={this.selectModel.bind(this, app)} >
                        <Card style={{margin: 2, height: 140}} >
                          <CardContent>
                            <Typography type="body2">
                              {app.name}
                            </Typography>
                            <Typography gutterBottom >
                              {app.category}
                            </Typography>
                            <Typography type="caption" noWrap >
                              {app.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </GridListTile>
                    );
                  })}
                  <GridListTile cols={1}>
                    <Card style={{margin: 2, height: 140}} >
                      <CardContent>
                        <Typography type="body2">
                          Titre
                        </Typography>
                        <Typography gutterBottom >
                          catégorie
                        </Typography>
                        <Typography type="caption" noWrap >
                          Petit texte qui décrit l'application
                        </Typography>
                      </CardContent>
                    </Card>
                  </GridListTile>
                  <GridListTile cols={1} >
                    <Card style={{margin: 2, height: 140}} >
                      <CardContent>
                        <Typography type="body2">
                          test
                        </Typography>
                        <Typography gutterBottom >
                          test
                        </Typography>
                        <Typography type="caption" noWrap >
                          Un autre petit test
                        </Typography>
                      </CardContent>
                    </Card>
                  </GridListTile>
                </GridList>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelSelectModel.bind(this)} color="primary" >Annuler</Button>
            {
              // <Button onClick={this.selectModel.bind(this)} color="primary" >Sélectionner</Button>
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
