import {sequelize} from "../sequelize";

Meteor.methods({
  newPage(name) {
    /*sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });*/
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

  newModule(module, page) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var id = new Meteor.Collection.ObjectID()._str;
      var order = 1;

      if(Modules.find({page}).fetch().length >= 1) {
        order = Modules.findOne({page, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {sort: {order:-1}, skip: 0}).order + 1;
      }

      module.order = order;
      module.page = page;
      module.id = id;
      module.app = Meteor.users.findOne({_id:this.userId}).selectedApp;

      Modules.insert(module);
    }
  },

  moveModule(idDrop, idDrag) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      const app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      var orderDrop = Modules.findOne({id: idDrop, app}).order;
      var orderDrag = Modules.findOne({id: idDrag, app}).order;

      if (orderDrop < orderDrag) {
        Modules.update({order: {$gte:orderDrop, $lt:orderDrag}, app}, {$inc: {order: 1}}, {multi:true});
      } else if (orderDrop > orderDrag) {
        Modules.update({order: {$gt:orderDrag, $lte:orderDrop}, app}, {$inc: {order: -1}}, {multi:true});
      }
      Modules.update({id:idDrag, app}, {$set: {order: orderDrop}});
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
  }
});
