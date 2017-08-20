Meteor.methods({
  // Creates new item
  newItem(item, modifications, entity) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      item.entity = entity;
      item.id = new Meteor.Collection.ObjectID()._str;
      item.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      item.E3c7a1r = 0;
      var app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      Items.insert(item, function(err, res) {
        if (err) {
          console.error(err);
        } else {
          var id = new Meteor.Collection.ObjectID()._str;
          for (var key in modifications) {
            modifications[key].operation = "set";
          }
          var date = new Date();
          var user = Meteor.userId();
          var newHistory = {id, refItem:item, item, modifications, date: new Date(date.toISOString()), app, entity, user};
          History.insert(newHistory, function(err) {
            if (err) {
              console.error(err);
            }
          });
        }
      });
    }
  },

  // Delete items
  deleteItem(id) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      Items.remove(id, function(err) {
        if (err) {
          console.error(err);
        } else {
          History.remove({"refItem.id": id.id, app: id.app});
        }
      });
    }
  },

  updateItem(id,item) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      Items.update({id:id, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {$set: item});
    }
  },

  // Rename the keys of each items
  renameKeys(newOldName, entity) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      Items.update({entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {$rename : newOldName}, {multi:true});
    }
  }
});
