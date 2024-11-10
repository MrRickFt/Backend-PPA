const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');

router.get('/seed', flightController.seedDB);
router.get('/', flightController.getFlights);

module.exports = router;
