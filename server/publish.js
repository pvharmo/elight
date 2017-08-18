
var selectedApp;

Meteor.publish("user", function() {
  return Meteor.users.find({_id: this.userId}, {fields: {selectedApp: 1, login: 1}});
});

Apps = new Mongo.Collection("apps");

Meteor.publish("userApps", function(){
  var user = Meteor.users.find({_id: this.userId}).fetch()[0];
  return Apps.find({users: {$elemMatch: {$eq: this.userId}}});
});

//////////////////////////////////////////////////

Roles = new Mongo.Collection("roles");

Meteor.publish("appRoles", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Roles.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

//////////////////////////////////////////////////

Entities = new Mongo.Collection("entities");

Meteor.publish("appEntities", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Entities.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

Schemas = new Mongo.Collection("schemas");

Meteor.publish("appSchemas", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Schemas.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

///////////////////////////////////////////////////

Pages = new Mongo.Collection("pages");

Meteor.publish("appPages", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Pages.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

Modules = new Mongo.Collection("modules");

Meteor.publish("appModules", function() {
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Modules.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

ModuleTypes = new Mongo.Collection("moduleTypes");

Meteor.publish("appModuleTypes", function() {
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return ModuleTypes.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

Meteor.publish("moduleTypes", function() {
  if (this.userId) {
    return ModuleTypes.find({});
  }
});

Fields = new Mongo.Collection("fields");

Meteor.publish("appFields", function() {
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Fields.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

///////////////////////////////////////////////////

Items = new Mongo.Collection("items");

Meteor.publish("appItems", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Items.find({app: selectedApp},{fields:{app:0}, limit: 100});
    }
  }
});

History = new Mongo.Collection("history");

Meteor.publish("appHistory", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return History.find({app: selectedApp},{fields:{app:0}, limit: 100});
    }
  }
});

/*Meteor.publish("appHistoryAggregation", function(key) {
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return History.aggregate([{$match: {app: selectedApp}}, {$group: {_id: "id", total: {$sum: key}}}]);
    }
  }
});*/

/*Meteor.publish("appHistoryAggregation", function(key) {
  var x = History.aggregate([{$match: {app: selectedApp}}, {$group: {_id: "id", total: {$sum: key}}}]);
  this.added();
});*/


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Temporary
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Meteor.publish("userEntities", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Entities.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

Meteor.publish("userSchemas", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Schemas.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

///////////////////////////////////////////////////

Meteor.publish("userPages", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Pages.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

Meteor.publish("userModules", function() {
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Modules.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

Meteor.publish("userModuleTypes", function() {
  if (this.userId) {
    return ModuleTypes.find({});
  }
});

Meteor.publish("userFields", function() {
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Fields.find({app: selectedApp},{fields:{app:0}});
    }
  }
});

///////////////////////////////////////////////////

Meteor.publish("userItems", function(){
  if (this.userId) {
    selectedApp = Meteor.users.findOne({_id:this.userId}).selectedApp;

    if (selectedApp) {
      return Items.find({app: selectedApp},{fields:{app:0}, limit: 100});
    }
  }
});
