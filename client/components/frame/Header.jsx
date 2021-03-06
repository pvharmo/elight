
import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";

import {pink} from "@material-ui/core/colors";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Launch from "@material-ui/icons/Launch";
import Popover from "@material-ui/core/Popover";

export default class Header extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.state = {
      subscription: {
        user: Meteor.subscribe("user"),
        apps: Meteor.subscribe("userApps")
      },
      rightDrawer: false,
      open: false
    };
  }

  componentWillUnmount() {
    this.state.subscription.user.stop();
    this.state.subscription.apps.stop();
  }

  title() {
    var user = Meteor.users.find().fetch()[0];
    if (user) {
      var app = Apps.find({id:user.selectedApp}).fetch()[0];
      if (app) {
        return app.name;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  logout() {
    this.setState({open: false});
    Meteor.logout(function() {
      Meteor.call("onLogout");
    });
    setTimeout(function() {
      location.reload();
    }, 100);
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

  handleClick(event) {
    this.setState({open:true, anchorEl: event.currentTarget});
  }

  handleRequestClose() {
    this.setState({open: false});
  }

  go(route) {
    this.setState({open: false});
    FlowRouter.go(route);
  }

  render() {
    return (
      <div>
        <AppBar
          id = "app-bar"
          position="fixed" >
          <Toolbar style={{marginTop: "2px"}}>
            <div style={{width:250}}></div>
            <IconButton color="primary" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            {/*<Typography type="title" color="inherit" style={{flex:1, textAlign: "left"}} >
              {this.title()}
            </Typography>*/}
            <div style={{flex:1}}></div>
            {/*FlowRouter.current().route.group.name === "admin" &&
              <Button color="primary" onClick={this.go.bind(this, "/app/"+ this.module())}>
                Aller à l'application
                <Launch style={{marginLeft:5}} />
              </Button>
            */}
            <IconButton
              color="primary"
              aria-label="More"
              aria-owns={this.state.open ? "user-menu" : null}
              aria-haspopup="true" onClick={this.handleClick.bind(this)} >
              <Avatar style={{backgroundColor: pink[400]}} >JCR</Avatar>
            </IconButton>
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              onClose={this.handleRequestClose.bind(this)} >
              <Card >
                <CardHeader
                  avatar={
                    <Avatar style={{backgroundColor: pink[400]}} >JCR</Avatar>
                  }
                  title="Jonathan Caron-Roberge"
                  subheader="jonathan@sports-lamitis.com" />
                <CardActions>
                  <Button onClick={this.go.bind(this, "/admin/account")} >
                    {language().menu.account}
                  </Button>
                  <Button onClick={this.logout.bind(this)} >
                    {language().menu.logout}
                  </Button>
                </CardActions>
              </Card>
            </Popover>
            {/*<Menu
              id="long-menu"
              anchorEl={this.state.anchorEl}
              open={this.state.openX}
              onClose={this.handleRequestClose.bind(this)}
              MenuListProps={{
                style: {
                  width: 200,
                },
              }}>
              <MenuItem>
                <Avatar style={{width:60, height:60}}>A</Avatar>
                <Typography>Test</Typography>
              </MenuItem>

            </Menu>*/}
          </Toolbar>
        </AppBar>
        <div style = {{"height":"66px"}}></div>
      </div>
    );
  }
}

// <MenuItem onClick={this.go.bind(this, "/admin/account")} >
//   {language().menu.account}
// </MenuItem>
// <MenuItem onClick={this.logout.bind(this)} >
//   {language().menu.logout}
// </MenuItem>
