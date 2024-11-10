const HttpStatusCodes = require('./httpStatusCodes');
const { error } = require('./responseHandler');

/**
 * Verifica que todos los parámetros requeridos estén presentes y no sean undefined o vacíos.
 * @param {Object} params - Un objeto con los parámetros requeridos (key-value).
 * @param {Object} res - El objeto de respuesta de Express para enviar errores si faltan parámetros.
 * @returns {boolean} - Devuelve true si todos los parámetros están presentes, de lo contrario envía una respuesta de error y devuelve false.
 */
const validateParams = (params, res) => {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      error(res, `Missing or empty parameter: ${key}`, HttpStatusCodes.BAD_REQUEST);
      return false;
    }
  }
  return true;
};

module.exports = validateParams;
