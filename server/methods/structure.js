Meteor.methods({
  newSchema(entity) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var id = new Meteor.Collection.ObjectID()._str;
      Entities.insert({
        id,
        name: entity,
        app : Meteor.users.findOne({_id:this.userId}).selectedApp
      });
      return id;
    }
  },

  deleteSchema(entity) {
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
      Entities.update({id:id, app: Meteor.users.findOne({_id:this.userId}).selectedApp}, {$set:{name:name}});
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
  addField(showInList, fieldName, fieldType, entity, entityName, params) {
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

      Schemas.insert({
        id,
        name: fieldName,
        type: fieldType,
        params: params,
        showInList: showInList,
        order: highestOrder,
        entity: entity,
        entityName: entityName,
        app: Meteor.users.findOne({_id:this.userId}).selectedApp
      });
    }
  },

  // Delete field
  deleteField(id,ordern,entity) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
      var FieldName = Schemas.findOne({id});
      var queryUpdate = {order: {$gt:ordern,$lt:2000}, entity: entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp};
      Schemas.update(queryUpdate,{$inc: {order:-1}},{multi:true});
      Schemas.remove({id, app:Meteor.users.findOne({_id:this.userId}).selectedApp});
      Fields.remove({fieldConnection: FieldName.id, fieldConnectionEntity: FieldName.entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp});
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
