const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Airport = require('./airport');

const Route = sequelize.define('Route', {
  route_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  is_direct: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  num_legs: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'routes',
  timestamps: false,
});

Route.belongsTo(Airport, { foreignKey: 'origin', as: 'originAirport' });
Route.belongsTo(Airport, { foreignKey: 'destination', as: 'destinationAirport' });

module.exports = Route;
