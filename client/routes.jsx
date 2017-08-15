
import React from "react";
import {mount} from "react-mounter";
import { Accounts } from "meteor/accounts-base";
import language from "./languages/languages.js";
import * as NavigationActions from "./actions/NavigationActions.js";

import {MainLayout} from "./layouts/MainLayout.jsx";

import login from "./login/login.jsx";
import signup from "./login/signup.jsx";
import SchemasWrapper from "./schemas/SchemasWrapper.jsx";
import ItemsWrapper from "./items/ItemsWrapper.jsx";
import ModulesWrapper from "./modules/ModulesAdminWrapper.jsx";
import AppWrapper from "./apps/AppWrapper.jsx";
import ModuleSettingsWrapper from "./modules/ModuleSettingsWrapper.jsx";
import Account from "./login/Account.jsx";

var idleTimer = 0;

var resetIdleTimer = function() {
  idleTimer = 0;
  /*if (callIdleTimer) {
    callIdleTimer = false;
    setTimeout(()=>{
      Meteor.call("idleTimer", (error)=>{
        console.log("test");
      });
      callIdleTimer = true;
    }, 5000);
  }*/
};

var admin = /\/admin\//;
var app = /\/app\//;

setInterval(function() {
  if (!Meteor.userId() && !Meteor.loggingIn() && (window.location.pathname.match(admin) || window.location.pathname.match(app))) {
    /*Meteor.logout(function(error) {
    Meteor.call("onLogout");
    location.reload();
    });*/
    location.reload();
  }
}, 500);

setInterval(function() {
  if (window.location.pathname.match(admin) || window.location.pathname.match(app)) {
    if (idleTimer === 0) {
      Meteor.call("idleTimer");
      idleTimer += 5;
    } else if (idleTimer > 1800) {
      Meteor.logout();
    } else {
      idleTimer += 5;
    }
  }
}, 5000);

Accounts.onLogin(function() {
  resetIdleTimer;
});

FlowRouter.route("/login",{
  name: "login",
  action() {
    if(!Meteor.userId() && !Meteor.loggingIn()) {
      mount(login);
    } else {
      FlowRouter.go("/admin/schemas");
    }
  }
});

FlowRouter.route("/signup",{
  name: "signup",
  action() {
    if (!Meteor.userId() && !Meteor.loggingIn()) {
      mount(signup);
    } else {
      FlowRouter.go("/admin/schemas");
    }
  }
});

FlowRouter.route("/admin/account",{
  name: "account",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<Account />),
        resetIdleTimer: resetIdleTimer
      });
      NavigationActions.items();
    } else {
      FlowRouter.go("/login");
    }
  }
});

FlowRouter.route("/admin/schemas",{
  name: "schemas",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<SchemasWrapper />),
        resetIdleTimer: resetIdleTimer
      });
      NavigationActions.schemas();
    } else {
      FlowRouter.go("/login");
    }
  }
});

FlowRouter.route("/admin/items",{
  name: "items",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<ItemsWrapper />),
        resetIdleTimer: resetIdleTimer
      });
      NavigationActions.items();
    } else {
      FlowRouter.go("/login");
    }
  }
});

FlowRouter.route("/admin/modules",{
  name: "modules",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<ModulesWrapper />),
        resetIdleTimer: resetIdleTimer
      });
      NavigationActions.modules();
    } else {
      FlowRouter.go("/login");
    }
  }
});

FlowRouter.route("/admin/modules/:type/:id",{
  name: "modulesSettings",
  action(params) {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<ModuleSettingsWrapper params={params} />),
        resetIdleTimer: resetIdleTimer
      });
      NavigationActions.modules();
    } else {
      FlowRouter.go("/login");
    }
  }
});

FlowRouter.route("/",{
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      FlowRouter.go("/admin/schemas");
    } else {
      FlowRouter.go("/login");
    }
  }
});

FlowRouter.route("/app/:id",{
  name: "app",
  action(params) {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<AppWrapper params={params} />),
        resetIdleTimer: resetIdleTimer
      });
      NavigationActions.frontend();
    } else {
      FlowRouter.go("/login");
    }
  }
});
