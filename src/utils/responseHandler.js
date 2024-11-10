const HttpStatusCodes = require('./httpStatusCodes');

const success = (res, data, message = 'Success', statusCode = HttpStatusCodes.OK) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};


const errorHandler = (res, message = 'An error occurred', statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

const noContent = (res, message = 'No results found') => {
  res.status(HttpStatusCodes.NO_CONTENT).json({
    success: true,
    message,
    data: null,
  });
};

module.exports = {
  success,
  errorHandler,
  noContent
};
