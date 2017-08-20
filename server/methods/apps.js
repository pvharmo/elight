Meteor.methods({
  newApp(name) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    } else {
      var id = new Meteor.Collection.ObjectID()._str;
      Apps.insert({id, name, users:[{user: Meteor.userId(), roles: ["owner"]}]}, function(err) {
        if (!err) {
          Meteor.users.update({_id: Meteor.userId()}, {$push: {apps:id}, $set: {"selectedApp" : id}});
        }
      });
    }
  },

  editApp(id, newName) {
    if(!Meteor.userId() && !(Meteor.userId() in Apps.findOne({id}).users)) {
      throw new Meteor.Error("not-authorized");
    } else {
      Apps.update({id}, {$set:{name:newName}});
    }
  },

  selectApp(id) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Meteor.users.update({_id: Meteor.userId()}, {$set: {"selectedApp" : id}});
    }
  },

  deleteApp(id) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Apps.remove({id:id});
      Entities.remove({app:id});
      Schemas.remove({app:id});
      Fields.remove({app:id});
      Modules.remove({app:id});
      Items.remove({app:id});
      History.remove({app:id});
      var user = Meteor.users.findOne({_id: this.userId});
      var app = Apps.findOne({id: {$in: user.apps}});
      Meteor.users.update({_id: Meteor.userId()}, {$set: {"selectedApp" : app.id}});
    }
  }
});
