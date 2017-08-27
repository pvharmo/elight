Meteor.methods({

  sendVerificationLink() {
    let userId = Meteor.userId();
    if (userId) {
      return Accounts.sendVerificationEmail(userId);
    }
  },

  deleteUser() {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Meteor.users.update({_id:Meteor.userId()}, {$set:{login: false}});
      Meteor.users.remove({_id:Meteor.userId()});
    }
  },

  changeEmail(email) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"emails.0.address": email}});
    }
  },

  // idleTimer() {
  //   var userId = Meteor.userId();
  //
  //   Meteor.clearTimeout(timer);
  //   var timer = Meteor.setTimeout(function () {
  //     //Meteor.users.update({_id: userId}, {$set : { "services.resume.loginTokens" : [] }});
  //     Meteor.users.update({_id:userId}, {$set:{"services.resume.loginTokens": []}});
  //     return true;
  //   }, 1850000);
  // },

  importItems(keys, items) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var item = {};
      for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < keys.length; j++) {
          item[keys[j]] = items[i][j];
        }
        item.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
        Items.insert(item);
      }
    }
  },
});
