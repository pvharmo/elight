import moment from "moment";

var timer;

Meteor.methods({

  //////////- User -////////////////////////////////////

  onLogin() {
    //Meteor.users.findOne({_id:this.userId}).selectedApp = Meteor.users.findOne({_id:this.userId}).Meteor.users.findOne({_id:this.userId}).selectedApp;
    Meteor.users.update({_id:Meteor.userId()}, {$set:{"login": true}});
  },

  onLogout() {
    Meteor.users.update({_id:Meteor.userId()}, {$set:{"login": false}});
  },

  changeEmail(email) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"emails.0.address": email}});
    }
  },

  idleTimer() {
    var userId = Meteor.userId;

    Meteor.clearTimeout(timer);
    timer = Meteor.setTimeout(function () {
      //Meteor.users.update({_id: userId}, {$set : { "services.resume.loginTokens" : [] }});
      Meteor.users.update({_id:userId}, {$set:{"login": false}});
      return true;
    }, 1800000);
  },

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

  //////////- Apps -////////////////////////////////////

  newApp(name) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Apps.insert({name, users: [Meteor.userId()]}, function(id, err) {
        if (!err) {
          Meteor.users.update({_id: Meteor.userId()}, {$push : { "Apps" : [id]}, $set: {"selectedApp" : id}});
        }
      });
    }
  },

  editApp(id, newName) {
    if(!Meteor.userId() && !(Meteor.userId() in Apps.findOne({id}).users)) {
      throw new Meteor.Error("not-authorized");
    } else {
      Apps.update({_id:id}, {$set:{name:newName}});
    }
  },

  selectApp(id) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Meteor.users.update({_id: Meteor.userId()}, {$set: {"selectedApp" : id}});
      //Meteor.users.findOne({_id:this.userId}).selectedApp = id;
    }
  },

  deleteApp(id) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Apps.remove({_id:id});
      Entities.remove({app:id});
      Schemas.remove({app:id});
      Fields.remove({app:id});
      Modules.remove({app:id});
      Items.remove({app:id});
      History.remove({app:id});
    }
  },

  //////////- Schemas -/////////////////////////////////
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
  },

  ///////////- Modules -//////////////////////////////

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
  },

  ///////////- Items -////////////////////////////////

  // Creates new item
  newItem(item, modifications) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    } else {
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
          var newHistory = {id, refItem:item, item, modifications, date: Date(), app: app};
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
          History.remove({"item.id": id.id, app: id.app});
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
  },

  ///////////- forms -//////////////////////////////////////

  /*submitForm(items) {
    if(!Meteor.userId() && !Meteor.users.findOne({_id:this.userId}).selectedApp) {
      throw new Meteor.Error("not-authorized");
    }
    for (var i = 0; i < items.length; i++) {
      var x = items[i];
      Items.update(x[0],{$inc:x[1]});
    }
  },*/

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
        var date = new Date();
        History.update({"refItem.id": item.id}, {$set:{refItem:item}});
        var newHistory = {id, refItem: item,item: item, modifications: modifications, date: new Date(date.toISOString()), app: app};
        History.insert(newHistory, function(err) {
          if (err) {
            console.error(err);
          }
        });
      });
    }
  },

  /*createItem(search, item) {
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
  },*/

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

  ///////////- datables -//////////////////////////////////////

  datatableRequest(options) {
    var skip = options.listSize * (options.page - 1);
    var aggregation = History.aggregate([
      {
        $match: {
          app: Meteor.users.findOne({_id:this.userId}).selectedApp,
          entity: options.entity
        }
      }, {
        $sort: options.sort
      }, {
        $skip: skip
      }, {
        $limit: options.listSize
      }
    ]);

    return aggregation;
  },

  dataCount(entity) {
    var dataCount = History.find({entity: entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp}).count();
    return dataCount;
  },

  chartRequest(module) {
    var aggregation = [];
    var _id = new Meteor.Collection.ObjectID()._str;
    var field = Schemas.findOne({id: module.params.y}).name;
    var legend = Schemas.findOne({id: module.params.chartLegend}).name;
    var valuesSource = "$modifications.";
    var afterDate = module.params.afterDate;
    var beforeDate = module.params.beforeDate;
    if (module.params.x === "date"/* && module.params.groupByDate*/) {
      var groupByDate = {};
      switch (module.params.groupByDate) {
      case "days":
        groupByDate = {day: {$dayOfMonth: "$date"}, month: {$subtract: [{$month: "$date"}, 1]}, year: {$year: "$date"}};
        break;
      case "daysOfWeek":
        groupByDate = {dayOfWeek: {$dayOfWeek: "$date"}};
        break;
      case "months":
        groupByDate = {month: {$subtract: [{$month: "$date"}, 1]}, year: {$year: "$date"}};
        break;
      case "monthsOfYear":
        groupByDate = {month: {$month: "$date"}};
        break;
      case "years":
        groupByDate = {year: {$year: "$date"}};
        break;
      default:
        groupByDate = {day: {$dayOfMonth: "$date"}, month: {$subtract: [{$month: "$date"}, 1]}, year: {$year: "$date"}};
      }
    }
    if (module.params.valuesSource === "HistoryVariations") {
      valuesSource = "$modifications.";
    } else if (module.params.valuesSource === "History") {
      valuesSource = "$item.";
    }
    if (!afterDate) {
      afterDate = "0001-01-01T00:00:00.000Z";
    }
    if (!beforeDate) {
      beforeDate = "9999-12-30T23:59:59.999Z";
    }
    for (var i = 0; i < module.params.items.length; i++) {
      aggregation.push(History.aggregate([
        {
          $match: {
            app: Meteor.users.findOne({_id:this.userId}).selectedApp,
            "refItem.entity": module.params.entity,
            "refItem.id": module.params.items[i],
            date: {$gt: new Date(afterDate), $lt: new Date(beforeDate)}
          }
        }, {
          $group: {
            _id: groupByDate,
            total: {[module.params.operation]: valuesSource + field + ".value"},
            refItem: {$first: "$refItem." + legend + ".value"}
          }
        }, {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
            "_id.dayOfWeek": 1
          }
        }
      ]));
    }
    return aggregation;
    //return [[{_id: {day: 1, month: 3, year: 2017}, total: 5, refItem:"5eabe8b4edefd350530b789a"}]];
  },

  /////////////////////////////////////////////////////////////////////////

  test() {
    var id = new Meteor.Collection.ObjectID()._str;
    var id2 = new Meteor.Collection.ObjectID()._str;
    ModuleTypes.insert({id: id,name: "Form",tabs: ["Information", "Champs", "Options"],tabsContent: ["Information","FormFieldsWrapper", "FormOptions"]});
    ModuleTypes.insert({id: id2,name: "Datatable",tabs: ["Information", "Options"],tabsContent: ["Information", "DatatableOptions"]});
  },

  logAggregation() {
    var x = History.aggregate([{$match: {app: Meteor.users.findOne({_id:this.userId}).selectedApp}}, {$group: {_id: "$refItem.id", total: {$sum: "$modifications.Quantité.value"}}}]);
    //console.log(x);
    return x;
  },

  testItems(x) {
    var start = Date();
    for (var i = 0; i < x; i++) {
      Items.insert({
        "Titre": {
          "value": "Le mur",
          "type": "text"
        },
        "Auteur": {
          "value": "Sartre",
          "type": "text"
        },
        "Date de publication": {
          "value": "2017-07-05T00:05:53.145Z",
          "type": "date"
        },
        "Description": {
          "value": "test",
          "type": "textarea"
        },
        "Éditeur": {
          "value": "Boréal",
          "type": "text"
        },
        "Quantité": {
          "value": 5,
          "type": "number"
        },
        "Catégorie": {
          "value": [
            "Philosophie",
            "Santé"
          ],
          "type": "dropdown"
        },
        "entity": "cKD6nQMFCMhoA8ddX",
        "history": [
          {
            "item": {
              "Titre": "Le mur",
              "Auteur": "Sartre",
              "Date de publication": "",
              "Description": "Un livre de Sartre",
              "Éditeur": "Boréal",
              "Quantité": 5,
              "Catégorie": [
                "Philosophie"
              ]
            },
            "date": "Sun Jul 02 2017 17:41:01 GMT-0400 (Est (heure d’été))"
          }
        ],
        "id": "5826a41c8bc416740b25f556",
        "E3c7a1r": 0
      });
    }
    var end = Date();
    console.log(end - start);
  },

  testHistory(date, value) {
    // date : "2017-07-30T20:52:03.513Z"
    History.insert(
      {
        "id": "c570fa65e445c5d8c4b862a5",
        "refItem": {
          "_id": "oeh6d26Z8GSZ4Zy93",
          "Titre": {
            "value": "La nausée",
            "type": "text"
          },
          "Auteur": {
            "value": "Sartre",
            "type": "text"
          },
          "Quantité": {
            "value": 7,
            "type": "number"
          },
          "entity": "5e37758911ec5948be67bf3e",
          "id": "5eabe8b4edefd350530b789a",
          "app": "8ow2kXY2cSqXx68rQ",
          "E3c7a1r": 0
        },
        "item": {
          "_id": "oeh6d26Z8GSZ4Zy93",
          "Titre": {
            "value": "La nausée",
            "type": "text"
          },
          "Auteur": {
            "value": "Sartre",
            "type": "text"
          },
          "Quantité": {
            "value": 34,
            "type": "number"
          },
          "entity": "5e37758911ec5948be67bf3e",
          "id": "5eabe8b4edefd350530b789a",
          "app": "8ow2kXY2cSqXx68rQ",
          "E3c7a1r": 0
        },
        "modifications": {
          "Quantité": {
            "value": value,
            "type": "number",
            "operation": "substract"
          }
        },
        "date": new Date(date),
        "app": "8ow2kXY2cSqXx68rQ",
      }
    , function(err) {
      console.log(err);
    });
  }

});
