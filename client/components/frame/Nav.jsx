
import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";
import nav from "../../flux/stores/NavigationStore.js";

import {withTheme} from 'material-ui/styles';
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import Drawer from "material-ui/Drawer";
import Typography from "material-ui/Typography";
import List, {ListItem, ListItemIcon, ListItemText} from "material-ui/List";
import Dialog, {DialogActions, DialogContent, DialogTitle} from "material-ui/Dialog";
import Menu, {MenuItem} from "material-ui/Menu";
import ContentAdd from "material-ui-icons/Add";
import Settings from "material-ui-icons/Settings";
import Launch from "material-ui-icons/Launch";


class Nav extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.state = {
      subscription: {
        modules: Meteor.subscribe("userModules"),
        moduleTypes: Meteor.subscribe("userModuleTypes"),
        schemas: Meteor.subscribe("userSchemas"),
        pages: Meteor.subscribe("userPages"),
        user: Meteor.subscribe("user"),
        apps: Meteor.subscribe("userApps")
      },
      navDrawer: false,
      page: FlowRouter.getRouteName(),
      selectApp: false
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

  go(route) {
    FlowRouter.go(route);
  }

  open() {
    this.setState({dialog: true});
  }

  selectApp(id) {
    Meteor.call("selectApp", id);
    this.close();
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

  newApp() {
    this.setState({dialog:false, newApp:true});
  }

  render() {
    var windowWidth = window.innerWidth;
    const palette = this.props.theme.palette;
    return (
      <Drawer
        docked={windowWidth > 900 ? true : false}
        anchor="left"
        id="main-nav"
        open={windowWidth > 900 ? true : this.state.navDrawer}
        onRequestClose={this.closeNav.bind(this)} >
        <Paper elevation={0} style={{height:"65px", paddingLeft:16, borderRadius:0}} >
          <Typography type="title" gutterBottom style={{paddingTop:14}}>
            Elight
          </Typography>
          <Typography type="caption">
            v0.3.0
          </Typography>
        </Paper>

        <Paper elevation={2} style={{backgroundColor: palette.primary[500], borderRadius:0, width: 250}} >
          <ListItem button >
            <Avatar style={{backgroundColor:this.props.theme.palette.accent[500]}}>GI</Avatar>
            <ListItemText
              disableTypography
              onClick={this.open.bind(this)}
              primary={<Typography type="subheading" style={{color: palette.common.white}} >{this.title().name}</Typography>}
              secondary={
                <Typography type="body1" style={{color: palette.common.white}} > {this.title().subtitle}</Typography>} />
          </ListItem>
          {FlowRouter.current().route.group.name === "admin" &&
            <div>
              <IconButton style={{marginLeft: 51}} onClick={this.go.bind(this, "/app/"+ this.module())}>
                <Launch color={palette.primary[100]} />
              </IconButton>
              <IconButton style={{marginLeft: 50}}>
                <Settings color={palette.primary[100]} />
              </IconButton>
            </div>}
        </Paper>

        <Dialog
          open={this.state.dialog}
          onRequestClose={this.close.bind(this)}>
          <DialogContent>
            <List >
              {this.apps().map((app)=>{
                return (
                  <ListItem key={app.id} button onClick={this.selectApp.bind(this, app.id)} >
                    <Avatar style={{backgroundColor:this.props.theme.palette.accent[500]}}>GI</Avatar>
                    <ListItemText
                      primary={app.name}
                      secondary={app.subtitle} />
                  </ListItem>
                );
              })}
              <ListItem button onClick={this.newApp.bind(this)} >
                <Avatar style={{backgroundColor:this.props.theme.palette.accent[500]}}><ContentAdd /></Avatar>
                <ListItemText
                  primary="Créer" />
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>

        {FlowRouter.current().route.group.name !== "app" ? (
          <List>
            <ListItem button onClick={this.go.bind(this,"/admin/schemas")} >
              <ListItemText primary={/*language().menu.schemas*/ "Entités"} />
            </ListItem>
            <ListItem button onClick={this.go.bind(this,"/admin/items")} >
              <ListItemText primary={language().menu.items} />
            </ListItem>
            <ListItem button onClick={this.go.bind(this,"/admin/modules")} >
              <ListItemText primary={language().menu.pages} />
            </ListItem>
            {/*<ListItem button onClick={this.go.bind(this,"/admin/roles")} >
              <ListItemText primary="Rôles" />
            </ListItem>
            <ListItem button onClick={this.go.bind(this,"/admin/users")} >
              <ListItemText primary="Utilisateurs" />
            </ListItem>*/}
          </List>
        ) : (
          <List>
            {this.pages().map((page)=>{
              return (
                <ListItem key={page.id} button onClick={this.go.bind(this,"/app/" + page.id)}>
                  <ListItemText primary={page.name} />
                </ListItem>
              );
            })}
          </List>
        )}
      </Drawer>
    );
  }
}

export default withTheme(Nav);
