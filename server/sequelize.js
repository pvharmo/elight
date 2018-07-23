const Sequelize = require('sequelize');
export const sequelize = new Sequelize('sportsla_elight', 'sportsla_elight', '3l1ght3l1ght', {
  host: 'sports-lamitis.com',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});
