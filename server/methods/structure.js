Meteor.methods({
  newEntity(entity) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var id = new Meteor.Collection.ObjectID()._str;
      entity.id = id;
      entity.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      Entities.insert(entity);
      return id;
    }
  },

  deleteEntity(entity) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      Schemas.remove({entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      Items.remove({entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      Fields.remove({fieldConnectionEntity:entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      Entities.remove({id:entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      History.remove({"item.entity":entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
    }
  },

  editEntity(id, name) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      Entities.update({id:id, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {$set:{name}});
    }
  },

  moveField(idDrop, idDrag) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      const app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      var orderDrop = Schemas.findOne({id: idDrop, app}).order;
      var orderDrag = Schemas.findOne({id: idDrag, app}).order;

      if (orderDrop < orderDrag) {
        Schemas.update({order: {$gte:orderDrop, $lt:orderDrag}, app}, {$inc: {order: 1}}, {multi:true});
      } else if (orderDrop > orderDrag) {
        Schemas.update({order: {$gt:orderDrag, $lte:orderDrop}, app}, {$inc: {order: -1}}, {multi:true});
      }
      Schemas.update({id:idDrag, app}, {$set: {order: orderDrop}});
    }
  },

  moveUp(id, orderNumber, entity) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      var orderItemOver = orderNumber - 1;
      var itemOver = Schemas.findOne({order: orderItemOver, entity: entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      Schemas.update({id}, {
        $set : {order: orderItemOver}
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
      Schemas.update(itemOver, {
        $set : {order: orderNumber}
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }
  },

  moveDown(id, orderNumber, entity) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      var orderItemUnder = orderNumber + 1;
      var itemUnder = Schemas.findOne({order: orderItemUnder, entity: entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
      Schemas.update({id}, {
        $set : {order: orderItemUnder}
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
      Schemas.update(itemUnder, {
        $set : {order: orderNumber}
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }
  },

  // Create a new field
  newField(field, entity) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var highestOrder;

      if(Schemas.find({entity: entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp}).fetch().length > 0) {
        highestOrder = Schemas.findOne({entity: entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {sort: {order:-1}}).order + 1;
      } else {
        highestOrder = 1;
      }

      var id = new Meteor.Collection.ObjectID()._str;

      field.id = id;
      field.order = highestOrder;
      field.entity = entity;
      field.app = Meteor.users.findOne({_id:this.userId}).selectedApp;

      Schemas.insert(field);
    }
  },

  // Delete field
  deleteField(field) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var queryUpdate = {order: {$gt:field.order}, entity: field.entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp};
      Schemas.update(queryUpdate,{$inc: {order:-1}},{multi:true});
      Schemas.remove({id: field.id, app:Meteor.users.findOne({_id:this.userId}).selectedApp});
      Fields.remove({fieldConnection: field.id, fieldConnectionEntity: field.entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
    }
  },

  // Update parameters
  updateSchemaParams(params, schemaId) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      Schemas.update({id:schemaId, app:Meteor.users.findOne({_id:this.userId}).selectedApp}, {$set: {params:params}});
    }
  },

  // Change showInList in schemas
  toggleShowInListSchema(id,status) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      Schemas.update(id, {
        $set: {showInList: !status}
      });
    }
  },

  // Change field name
  SaveSchemaEdited(id,modif) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      id.app = Meteor.users.findOne({_id:this.userId}).selectedApp;
      Schemas.update({id:id}, {
        $set : modif
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }
  }
});
