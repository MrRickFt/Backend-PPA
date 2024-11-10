const express = require('express');
const app = express();
const flightRoutes = require('./routes/flight.routes');
const sequelize = require('./config/database');


app.use(express.json());
app.use('/api/flights', flightRoutes);

sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(console.error);

module.exports = app;
