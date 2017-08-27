Meteor.methods({
  newRole(role) {
    role.id = new Meteor.Collection.ObjectID()._str;
    role.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
    Roles.insert(role);
  },

  deleteRole(id) {
    Roles.remove({id, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
  },

  saveRole(role) {
    role.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
    Roles.update({id:role.id, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, role);
  },

  toggleActive(id, checked) {
    Roles.update({id, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {$set: {active: checked}});
  }
});
