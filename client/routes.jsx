
import React from "react";
import {mount} from "react-mounter";
import {Accounts} from "meteor/accounts-base";
import language from "./languages/languages.js";
import * as NavigationActions from "./flux/actions/NavigationActions.js";

import {MainLayout} from "./components/frame/MainLayout.jsx";

import login from "./components/login/login.jsx";
import signup from "./components/login/signup.jsx";
import SchemasWrapper from "./components/admin/schemas/SchemasWrapper.jsx";
import ItemsWrapper from "./components/admin/items/ItemsWrapper.jsx";
import ModulesWrapper from "./components/admin/modules/ModulesWrapper.jsx";
import RolesWrapper from "./components/admin/roles/RolesWrapper.jsx";
import UsersWrapper from "./components/admin/users/Wrapper.jsx";
import AppWrapper from "./components/frame/AppWrapper.jsx";
import ModuleSettingsWrapper from "./components/admin/modules/ModuleSettingsWrapper.jsx";
import Account from "./components/login/Account.jsx";

var idleTimer = 0;

Modules = new Mongo.Collection("modules");
Pages = new Mongo.Collection("pages");
Items = new Mongo.Collection("items");
History = new Mongo.Collection("history");
Schemas = new Mongo.Collection("schemas");
Entities = new Mongo.Collection("entities");
Roles = new Mongo.Collection("roles");

var admin = /\/admin\//;
var app = /\/app\//;


// var resetIdleTimer = function() {
//   idleTimer = 0;
//   /*if (callIdleTimer) {
//     callIdleTimer = false;
//     setTimeout(()=>{
//       Meteor.call("idleTimer", (error)=>{
//         console.log("test");
//       });
//       callIdleTimer = true;
//     }, 5000);
//   }*/
// };
//
//
// setInterval(function() {
//   if (!Meteor.userId() && !Meteor.loggingIn() && (window.location.pathname.match(admin) || window.location.pathname.match(app))) {
//     /*Meteor.logout(function(error) {
//     Meteor.call("onLogout");
//     location.reload();
//     });*/
//     location.reload();
//   }
// }, 1800000);

/*setInterval(function() {
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
}, 5000);*/

/*Accounts.onLogin(function() {
  resetIdleTimer;
});*/

var admin = FlowRouter.group({
  prefix: "/admin",
  name: "admin"
});

var app = FlowRouter.group({
  prefix: "/app",
  name: "app"
});

FlowRouter.route("/admin",{
  name: "admin",
  action() {
    if(!Meteor.userId() && !Meteor.loggingIn()) {
      FlowRouter.go("/login");
    } else {
      FlowRouter.go("/admin/schemas");
    }
  }
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

admin.route("/account",{
  name: "account",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<Account />),
        // resetIdleTimer: resetIdleTimer
      });
      NavigationActions.items();
    } else {
      FlowRouter.go("/login");
    }
  }
});

admin.route("/schemas",{
  name: "schemas",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<SchemasWrapper />),
        // resetIdleTimer: resetIdleTimer
      });
      NavigationActions.schemas();
    } else {
      FlowRouter.go("/login");
    }
  }
});

admin.route("/items",{
  name: "items",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<ItemsWrapper />),
        // resetIdleTimer: resetIdleTimer
      });
      NavigationActions.items();
    } else {
      FlowRouter.go("/login");
    }
  }
});

admin.route("/modules",{
  name: "modules",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<ModulesWrapper />),
        // resetIdleTimer: resetIdleTimer
      });
      NavigationActions.modules();
    } else {
      FlowRouter.go("/login");
    }
  }
});

admin.route("/roles",{
  name: "roles",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<RolesWrapper />),
        // resetIdleTimer: resetIdleTimer
      });
    } else {
      FlowRouter.go("/login");
    }
  }
});

admin.route("/users",{
  name: "users",
  action() {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<UsersWrapper />),
        // resetIdleTimer: resetIdleTimer
      });
    } else {
      FlowRouter.go("/login");
    }
  }
});

admin.route("/modules/:type/:id",{
  name: "modulesSettings",
  action(params) {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<ModuleSettingsWrapper params={params} />),
        // resetIdleTimer: resetIdleTimer
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
      FlowRouter.go("/app");
    } else {
      FlowRouter.go("/login");
    }
  }
});

app.route("/:id",{
  name: "section",
  action(params) {
    if (Meteor.userId() || Meteor.loggingIn()) {
      mount(MainLayout, {
        content: (<AppWrapper params={params} />),
        // resetIdleTimer: resetIdleTimer
      });
      NavigationActions.frontend();
    } else {
      FlowRouter.go("/login");
    }
  }
});
