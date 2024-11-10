const sequelize = require('../config/database');

const getFlightsWithStops = async (origin, destination, dayOfWeek) => {
  try {
    const query = `SELECT * FROM get_flights(:origin, :destination, :dayOfWeek)`;

    const results = await sequelize.query(query, {
      replacements: { origin, destination, dayOfWeek },
      type: sequelize.QueryTypes.SELECT
    });

    return results;
  } catch (error) {
    console.error('Error fetching flights with stops:', error);
    throw error;
  }
};



module.exports = { getFlightsWithStops };

