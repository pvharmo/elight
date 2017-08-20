Meteor.methods({
  chartRequest(module) {
    var aggregation = [];
    var _id = new Meteor.Collection.ObjectID()._str;
    var field = Schemas.findOne({id: module.params.y, app: Meteor.users.findOne({_id:this.userId}).selectedApp}).id;
    var legend = Schemas.findOne({id: module.params.chartLegend, app: Meteor.users.findOne({_id:this.userId}).selectedApp}).id;
    var links = Schemas.find({type: "link", entity: module.params.entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp}).fetch();
    var valuesSource = "$modifications.";
    var afterDate = module.params.afterDate;
    var beforeDate = module.params.beforeDate;
    var project = {};
    if (module.params.x === "date"/* && module.params.groupBy*/) {
      var groupBy = {};
      switch (module.params.groupBy) {
      case "days":
        groupBy = {day: {$dayOfMonth: "$date"}, month: {$subtract: [{$month: "$date"}, 1]}, year: {$year: "$date"}};
        break;
      case "daysOfWeek":
        groupBy = {dayOfWeek: {$dayOfWeek: "$date"}};
        break;
      case "months":
        groupBy = {month: {$subtract: [{$month: "$date"}, 1]}, year: {$year: "$date"}};
        break;
      case "monthsOfYear":
        groupBy = {month: {$month: "$date"}};
        break;
      case "years":
        groupBy = {year: {$year: "$date"}};
        break;
      default:
        groupBy = {day: {$dayOfMonth: "$date"}, month: {$subtract: [{$month: "$date"}, 1]}, year: {$year: "$date"}};
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
    for (let i = 0; i < module.params.items.length; i++) {
      let aggregate = [{
        $match: {
          app: Meteor.users.findOne({_id:this.userId}).selectedApp,
          "refItem.entity": module.params.entity,
          "refItem.id": module.params.items[i],
          date: {$gt: new Date(afterDate), $lt: new Date(beforeDate)}
        }
      }];
      if (links.length > 0) {
        for (let i = 0; i < links; i++) {
          aggregate[i + 1] = {
            $lookup: {
              from: "items",
              localField: "refItem." + links[0].id,
              foreignField: "id",
              as: links[0].id
            }
          };
        }
      }
      aggregate.push({
        $group: {
          _id: groupBy,
          total: {[module.params.operation]: valuesSource + field},
          refItem: {$first: "$refItem." + legend}
        }
      });
      if (module.params.x === "date") {
        aggregate.push({
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
            "_id.dayOfWeek": 1
          }
        });
      } else {
        aggregate.push({
          $sort: {
            "_id": 1
          }
        });
      }
      aggregation.push(History.aggregate(aggregate));
    }
    return aggregation;
  }
});
