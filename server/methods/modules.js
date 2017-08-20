Meteor.methods({
  newPage(name) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var id = new Meteor.Collection.ObjectID()._str;
      Pages.insert({
        id,
        name,
        app : Meteor.users.findOne({_id:this.userId}).selectedApp
      });
      return id;
    }
  },

  editPage(id, newName) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      Pages.update({id, app: Meteor.users.findOne({_id:this.userId}).selectedApp},{$set:{name:newName}}, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }
  },

  deletePage(page) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var modulesId = Modules.find({page: page, app: Meteor.users.findOne({_id:this.userId}).selectedApp}).fetch();
      var pageId = Pages.findOne({id: page, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      var fields = Fields.find({page:page.id, app: Meteor.users.findOne({_id:this.userId}).selectedApp}).fetch();
      for (var i = 0; i < modulesId.length; i++) {
        Modules.remove(modulesId[i]);
      }
      for (var x = 0; x < fields.length; x++) {
        Fields.remove(fields[x]);
      }

      Pages.remove(pageId);
    }
  },

  addModule(fieldName, fieldType, pageName) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var highestOrder;

      if(Modules.find({page: pageName}).fetch().length >= 1) {
        highestOrder = Modules.findOne({page: pageName, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {sort: {order:-1}, skip: 0}).order + 1;
      } else {
        highestOrder = 1;
      }

      var id = new Meteor.Collection.ObjectID()._str;
      Modules.insert({
        id,
        name : fieldName,
        type : fieldType,
        order : highestOrder,
        page : pageName,
        params : {},
        app : Meteor.users.findOne({_id:this.userId}).selectedApp
      });
    }
  },

  moveUpModule(id, orderNumber, pageName) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      var orderItemOver = orderNumber - 1;
      var itemOver = Modules.findOne({order: orderItemOver, page: pageName, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      Modules.update({id}, {
        $set : {order: orderItemOver}
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
      Modules.update(itemOver, {
        $set : {order: orderNumber}
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }
  },

  moveDownModule(id,orderNumber, pageName) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      var orderItemUnder = orderNumber + 1;
      var itemUnder = Modules.findOne({order: orderItemUnder, page: pageName, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      Modules.update({id}, {
        $set : {order: orderItemUnder}
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
      Modules.update(itemUnder, {
        $set : {order: orderNumber}
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }
  },

  deleteModule(id,ordern,pageName) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      var queryUpdate = {order: {$gt:ordern,$lt:2000}, page: pageName, app: Meteor.users.findOne({_id:this.userId}).selectedApp};
      Modules.update(queryUpdate,{$inc: {order:-1}},{multi:true});
      Modules.remove({id, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
    }
  },

  SaveModuleEdited(id,moduleEdited) {
    if(!Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      Modules.update(id, {
        $set : moduleEdited
      });
    }
  },

  addParams(id, params) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      Modules.update({id:id, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {$set:{params:params}});
    }
  },

  newField(field) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
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
