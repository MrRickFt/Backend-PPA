const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Route = require('./route');
const Airport = require('./airport');

const RouteLeg = sequelize.define('RouteLeg', {
  leg_id: {
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
  origin: {
    type: DataTypes.STRING(3),
    allowNull: false,
    references: {
      model: Airport,
      key: 'code',
    },
  },
  destination: {
    type: DataTypes.STRING(3),
    allowNull: false,
    references: {
      model: Airport,
      key: 'code',
    },
  },
  leg_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'route_legs',
  timestamps: false,
});

RouteLeg.belongsTo(Route, { foreignKey: 'route_id' });

module.exports = RouteLeg;
