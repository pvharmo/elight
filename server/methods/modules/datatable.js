Meteor.methods({
  datatableRequest(options, module) {
    let skip = options.listSize * (options.page - 1);
    let links = Schemas.find({type: "link", entity: module.params.entity, app: Meteor.users.findOne({_id:this.userId}).selectedApp}).fetch();
    let lookup = {
      from: "items",
      localField: "refItem." + links[0].id,
      foreignField: "id",
      as: links[0].id
    };
    let aggregation = History.aggregate([
      {
        $match: {
          app: Meteor.users.findOne({_id:this.userId}).selectedApp,
          "refItem.entity": module.params.entity
        }
      }, {
        $lookup: lookup
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
  }
});
