
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

var resetIdleTimer = function() {
  Meteor.call("idleTimer");
};

var admin = /\/admin\//;

setInterval(function() {
  if (Meteor.users.find().fetch()[0]) {
    if (window.location.pathname.match(admin) && !Meteor.users.find().fetch()[0].login && !Meteor.loggingIn()) {
      Meteor.logout(function() {
        Meteor.call("onLogout");
        location.reload();
      });
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

FlowRouter.route("/page/:id",{
  name: "page",
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
