// services/seedService.js
const Airport = require('../models/airport');
const Route = require('../models/route');
const RouteLeg = require('../models/routeLeg');
const Flight = require('../models/flight');

// Aeropuertos de la red PPA
const airports = [
  { code: 'BOG', name: 'Bogotá' },
  { code: 'MDE', name: 'Medellín' },
  { code: 'BAQ', name: 'Barranquilla' },
  { code: 'BGA', name: 'Bucaramanga' },
  { code: 'SMR', name: 'Santa Marta' },
  { code: 'CTG', name: 'Cartagena' },
  { code: 'CLO', name: 'Cali' },
  { code: 'EOH', name: 'Enrique Olaya Herrera' },
];

// Rutas y tramos
const routes = [
  // Rutas directas (una pierna)
  { origin: 'BOG', destination: 'MDE', is_direct: true, num_legs: 1 },
  { origin: 'BOG', destination: 'BAQ', is_direct: true, num_legs: 1 },
  { origin: 'MDE', destination: 'CTG', is_direct: true, num_legs: 1 },

  // Rutas indirectas (con escalas)
  { origin: 'BOG', destination: 'SMR', is_direct: false, num_legs: 2 }, // Ejemplo: BOG -> BGA -> SMR
  { origin: 'BOG', destination: 'CLO', is_direct: false, num_legs: 1 }, // Ejemplo: BOG -> BAQ -> CLO
];

// Tramos de las rutas con escalas
const routeLegs = [
  // Ruta BOG -> SMR con 2 tramos: BOG -> BGA -> SMR
  { route_origin: 'BOG', route_destination: 'SMR', legs: [
    { origin: 'BOG', destination: 'BGA', leg_order: 1 },
    { origin: 'BGA', destination: 'SMR', leg_order: 2 },
  ]},
  // Ruta BOG -> CLO con 1 tramo intermedio: BOG -> BAQ -> CLO
  { route_origin: 'BOG', route_destination: 'CLO', legs: [
    { origin: 'BOG', destination: 'BAQ', leg_order: 1 },
    { origin: 'BAQ', destination: 'CLO', leg_order: 2 },
  ]},
  // Rutas directas con una sola pierna
  { route_origin: 'BOG', route_destination: 'MDE', legs: [
    { origin: 'BOG', destination: 'MDE', leg_order: 1 },
  ]},
  { route_origin: 'BOG', route_destination: 'BAQ', legs: [
    { origin: 'BOG', destination: 'BAQ', leg_order: 1 },
  ]},
  { route_origin: 'MDE', route_destination: 'CTG', legs: [
    { origin: 'MDE', destination: 'CTG', leg_order: 1 },
  ]},
];

// Vuelos para cada ruta, con horarios variados
const flights = [
  { route_origin: 'BOG', route_destination: 'MDE', flights: [
    { departure_time: '08:00:00', arrival_time: '09:30:00', day_of_week: 1, duration: 90 },
    { departure_time: '08:00:00', arrival_time: '09:30:00', day_of_week: 2, duration: 90 },
  ]},
  { route_origin: 'BOG', route_destination: 'SMR', flights: [
    { departure_time: '07:00:00', arrival_time: '10:30:00', day_of_week: 1, duration: 210 },
    { departure_time: '07:00:00', arrival_time: '10:30:00', day_of_week: 2, duration: 210 },
  ]},
];

// Función para poblar la base de datos
const seedDatabase = async () => {
  try {
    await Airport.bulkCreate(airports, { ignoreDuplicates: true });

    const routeInstances = await Route.bulkCreate(routes, { ignoreDuplicates: true, returning: true });

    // Poblar las piernas de cada ruta en `RouteLeg`
    for (const routeData of routeLegs) {
      const route = routeInstances.find(
        (r) => r.origin === routeData.route_origin && r.destination === routeData.route_destination
      );

      for (const leg of routeData.legs) {
        await RouteLeg.create({
          route_id: route.route_id,
          origin: leg.origin,
          destination: leg.destination,
          leg_order: leg.leg_order,
        });
      }
    }

    // Poblar vuelos únicos en `Flight` asociados a cada ruta
    for (const routeFlightData of flights) {
      const route = routeInstances.find(
        (r) => r.origin === routeFlightData.route_origin && r.destination === routeFlightData.route_destination
      );

      for (const flight of routeFlightData.flights) {
        await Flight.findOrCreate({
          where: {
            route_id: route.route_id,
            departure_time: flight.departure_time,
            day_of_week: flight.day_of_week,
          },
          defaults: {
            arrival_time: flight.arrival_time,
            duration: flight.duration,
          },
        });
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
