const appError = require("../utils/appError");
const logger = require("../utils/logger");

/**
 * HANDLE TOKEN & COOKIE RESPONSE
 * @param {*} user
 * @param {*} statusCode
 * @param {*} res
 */
exports.createSendToken = async (user) => {
  try {
    // CREATE JWT WITH MODEL INSTANCE
    const token = await user.createJWT();

    user.password = undefined;
    return {
      user,
      token,
    };
  } catch (error) {
    logger.error(error);
    throw new appError(error.message, 500);
  }
};
