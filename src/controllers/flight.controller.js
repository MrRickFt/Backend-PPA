const flightService = require('../services/flight.service');
const { seedDatabase } = require('../services/seed.service');
const { success, errorHandler } = require('../utils/responseHandler');
const validateParams = require('../utils/validateParams');

const getFlights = async (req, res) => {
  try {
    const { origin, destination, dayOfWeek } = req.query;
    if (!validateParams({ origin, destination, dayOfWeek }, res)) { return; }
    const flights = await flightService.getFlightsWithStops(origin, destination, parseInt(dayOfWeek));
    success(res, flights, 'Flights fetched successfully');
;
  } catch (error) {
    console.error(error);
    errorHandler(res, 'Error fetching flights', HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const seedDB = async (req, res) => {
  try {
    await seedDatabase();
    success(res, "", 'Flights fetched successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    errorHandler(res, 'Error seeding database', HttpStatusCodes.INTERNAL_SERVER_ERROR)
  }
};

module.exports = {
  getFlights,
  seedDB,
};


