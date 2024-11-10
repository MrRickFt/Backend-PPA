const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Route = require('./route');

const Flight = sequelize.define('Flight', {
  flight_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  route_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Route,
      key: 'route_id',
    },
  },
  departure_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  arrival_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  day_of_week: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'flights',
  timestamps: false,
});

Flight.belongsTo(Route, { foreignKey: 'route_id' });

module.exports = Flight;
