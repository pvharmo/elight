
import React, {Component} from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";
import * as NavigationActions from "../../flux/actions/NavigationActions.js";
import nav from "../../flux/stores/NavigationStore.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import NavigationMoreVert from "material-ui/svg-icons/navigation/more-vert";
import IconButton from "material-ui/IconButton";

export default class Header extends TrackerReact(React.Component) {

  constructor() {
    super();
    this.changeTitleSchema = this.changeTitleSchema.bind(this);
    this.changeTitleApp = this.changeTitleApp.bind(this);

    if (Session.get("title") === undefined) {
      Session.set("title", {schema: "", app: ""});
    }

    this.state = {
      subscription: {
        user: Meteor.subscribe("user"),
        apps: Meteor.subscribe("userApps")
      },
      rightDrawer: false,
      title: Session.get("title").schema
    };
  }

  componentWillMount() {
    nav.on("schema-selected", this.changeTitleSchema);
    nav.on("app-selected", this.changeTitleApp);
    nav.on("schemas", this.changeTitleSchema);
    nav.on("apps", this.changeTitleApp);
  }

  componentWillUnmount() {
    this.state.subscription.user.stop();
    this.state.subscription.apps.stop();

    nav.removeListener("schema-selected", this.changeTitleSchema);
    nav.removeListener("app-selected", this.changetitleApp);
    nav.removeListener("schemas", this.changeTitleSchema);
    nav.removeListener("apps", this.changetitleApp);
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

  changeTitleSchema() {
    this.setState({title: Session.get("title").schema});
  }

  changeTitleApp () {
    this.setState({title: Session.get("title").app});
  }

  toggleMenu() {
    this.setState({menu:true});
  }

  openLeftNav() {
    NavigationActions.openNavDrawer();
  }

  logout() {
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

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <AppBar
            title = {this.title()}
            id = "app-bar"
            style = {{"position": "fixed"}}
            onLeftIconButtonTouchTap = {this.openLeftNav.bind(this)}
            iconElementRight = {
              <DropDownMenu
                value=""
                underlineStyle={{display:"none"}}
                iconButton={<NavigationMoreVert />} >
                {FlowRouter.getRouteName() !== "app" ? (
                  <MenuItem primaryText={"Application"} href={"/app/"+ this.module()} />
                ) : (
                  <MenuItem primaryText={"Administrateur"} href="/admin/schemas" />
                )}
                <MenuItem primaryText={language().menu.account} href="/admin/account" />
                <MenuItem primaryText={language().menu.logout} onTouchTap={this.logout.bind(this)} />
              </DropDownMenu>
            }
          />
        </MuiThemeProvider>
        <div style = {{"height":"70px"}}></div>
      </div>
    );
  }
}
