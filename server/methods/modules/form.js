Meteor.methods({
  deleteFormField(id) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      Fields.remove({id:id, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
    }
  },

  modifyItem(query, modificationsQuery, upsert, modifications) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      query.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      // E3c7a1r is a temporary fix. If there is only one request for $set and $inc the modificationsQuery aren't applied. E3c7a1r is used to add an additionnal modification.
      /*if (modificationsQuery.$inc) {
        modificationsQuery.$inc.E3c7a1r = 1;
      } else {
        modificationsQuery.$inc = {};
        modificationsQuery.$inc.E3c7a1r = 1;
      }*/
      var app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      Items.update(query, modificationsQuery, {multi: false, upsert:upsert}, function(error) {
        if (error) {
          console.error(error);
        }
        var id = new Meteor.Collection.ObjectID()._str;
        var item = Items.findOne(query);
        var user = Meteor.userId();
        var date = new Date();
        History.update({"refItem.id": item.id}, {$set:{refItem:item}});
        var newHistory = {id, refItem: item,item: item, modifications: modifications, date: new Date(date.toISOString()), app, user};
        History.insert(newHistory, function(err) {
          if (err) {
            console.error(err);
          }
        });
      });
    }
  },

  createItem(search, item) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    }
    item.app = Meteor.userId();
    item.history = [{
      date: Date(),
      item: search,
      modifications: modifications
    }];
    Items.insert(search, item);
  },

  deleteItemForm(search) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      if (search !== {}) {
        search.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
        Items.remove(search);
      }
    }
  },

  updateParams(id, value, field) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var params = {};
      params[field] = value;
      Modules.update({id:id, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {$set:params});
    }
  },

  newFormField(field, module) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      // Modules.update({id:module, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {$push:{fields: field}});
      field.module = module;
      field.id = new Meteor.Collection.ObjectID()._str;
      field.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      Fields.insert(field);
    }
  },

  updateField(id, newValue) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      Fields.update({id:id, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {$set:newValue});
    }
  },

  moveUpField(id, orderNumber, pageName) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      var orderItemOver = orderNumber - 1;
      var itemOver = Fields.findOne({order: orderItemOver, module: pageName, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      Fields.update({id}, {
        $set : {order: orderItemOver}
      });
      Fields.update(itemOver, {
        $set : {order: orderNumber}
      });
    }
  },

  moveDownField(id,orderNumber, pageName) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      var orderItemUnder = orderNumber + 1;
      var itemUnder = Fields.find({order: orderItemUnder, module: pageName, app: Meteor.users.findOne({_id:this.userId}).selectedApp}).fetch();
      Fields.update({id}, {
        $set : {order: orderItemUnder}
      });
      Fields.update(itemUnder[0], {
        $set : {order: orderNumber}
      });
    }
  }
});
