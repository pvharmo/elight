Meteor.methods({
  newRole(name) {
    Roles.insert({
      id: new Meteor.Collection.ObjectID()._str,
      name,
      app: Meteor.users.findOne({_id:this.userId}).selectedApp
    });
  },

  deleteRole(_id) {
    Roles.remove({_id});
  },

  saveRole(role) {
    role.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
    Roles.update({_id:role._id}, role);
  }
});
