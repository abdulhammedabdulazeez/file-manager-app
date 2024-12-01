const logger = require("../utils/logger");
const AppError = require("../utils/appError");

const handleCastErrorDB = (err, req) => {
  req.setLocale(user.languagePreference);
  const message = req.__('errors.invalid_field', { field: err.path, value: err.value });
  return new AppError(message, 400);
};

const handleDuplicateKeyDB = (err, req) => {
  req.setLocale(user.languagePreference);
  const value = err.keyValue.name;
  logger.info(value);
  const message = req.__('errors.duplicate_field_value', { value });
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err, req) => {
  req.setLocale(user.languagePreference);
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = req.__('errors.invalid_field_data', { errors: errors.join(". ") });
  return new AppError(message, 400);
};

const handleJWTError = (req) => new AppError(req.__('errors.invalid_token'), 401);
const handleJWTExpiredError = (req) => new AppError(req.__('errors.token_expired'), 401);

const sendErrorDev = (err, req, res) => {
  logger.error(err);
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational Error that we trust, send to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming Errors or other unknown Error: Don't leak error details
    console.error("ERROR 💣", err);
    return res.status(500).json({
      status: "error",
      message: req.__('errors.something_went_wrong'),
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    logger.error(err);
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error, req);
    if (error.code === 11000) error = handleDuplicateKeyDB(error, req);
    if (error._message === "Validation failed") error = handleValidationErrorDB(error, req);
    if (error.name === "JsonWebTokenError") error = handleJWTError(req);
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError(req);
    sendErrorProd(error, req, res);
  }
};
