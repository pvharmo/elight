
import React, {Component} from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";
import * as NavigationActions from "../../flux/actions/NavigationActions.js";
import nav from "../../flux/stores/NavigationStore.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Drawer from "material-ui/Drawer";
import Paper from "material-ui/Paper";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";

export default class Nav extends TrackerReact(React.Component) {

  constructor() {
    super();

    this.state = {
      subscription: {
        modules: Meteor.subscribe("userModules"),
        moduleTypes: Meteor.subscribe("userModuleTypes"),
        schemas: Meteor.subscribe("userSchemas"),
        pages: Meteor.subscribe("userPages")
      },
      navDrawer: false,
      page: FlowRouter.getRouteName()
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
  }

  closeNav() {
    this.setState({
      "navDrawer": false
    });
  }

  schemas() {
    this.setState({
      "navDrawer": false
    });
    NavigationActions.schemas();
  }

  items() {
    this.setState({
      "navDrawer": false
    });
    NavigationActions.items();
  }

  modules() {
    this.setState({
      "navDrawer": false
    });
    NavigationActions.modules();
  }

  frontend() {
    this.setState({
      "navDrawer": false
    });
    NavigationActions.frontend();
  }

  pages() {
    return Pages.find().fetch();
  }

  navigateTo(event, value) {
    this.setState({page:value});
    if (value === "schemas") {
      FlowRouter.go("/admin/schemas");
    } else if (value === "items") {
      FlowRouter.go("/admin/items");
    } else if (value === "modules") {
      FlowRouter.go("/admin/modules");
    } /*else {
      FlowRouter.go("/page/" + value);
    }*/
  }

  render() {
    var windowWidth = window.innerWidth;
    return (
      <MuiThemeProvider>
        <Drawer
          docked={windowWidth > 900 ? true : false}
          width={200}
          zDepth={1}
          id="main-nav"
          containerStyle={{"paddingTop":"90px", boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 6px inset, rgba(0, 0, 0, 0.12) 0px 1px 4px inset"}}
          open={windowWidth > 900 ? true : this.state.navDrawer}
          onRequestChange={this.closeNav.bind(this)} >
          <MuiThemeProvider>
            <paper>
              <Menu autoWidth={true} value={this.state.page} onChange={this.navigateTo.bind(this)} style={{maxWidth: "200px"}} >
                {FlowRouter.getRouteName() !== "app" ? (
                  <div>
                    <MenuItem value={"schemas"} href="/admin/schemas" primaryText={language().menu.schemas} onTouchTap={this.schemas.bind(this)} />
                    <MenuItem value={"items"} href="/admin/items" primaryText={language().menu.items} onTouchTap={this.items.bind(this)} />
                    <MenuItem value={"modules"} href="/admin/modules" primaryText={language().menu.pages} onTouchTap={this.modules.bind(this)} />
                    <MenuItem value={"roles"} href="/admin/roles" primaryText={"Roles"} />
                  </div>
                ) : (
                  this.pages().map((page)=>{
                    return <MenuItem value={page.id} key={page.id} href={"/app/" + page.id} primaryText={page.name} onTouchTap={this.frontend.bind(this)} />;
                  })
                )}
              </Menu>
            </paper>
          </MuiThemeProvider>
        </Drawer>
      </MuiThemeProvider>
    );
  }
}
