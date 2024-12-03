const appError = require("../utils/appError");
const Users = require("../models/user.model");
const { createSendToken } = require("../utils/createSendToken");
const { createPasswdResetToken } = require("../utils/tokens");
require("dotenv").config();
const crypto = require("crypto");

/**
 * SIGNUP
 */
exports.signup = async (req, res, next) => {
  const user = req.user;
  req.setLocale(user.languagePreference || "en");
  res.status(201).json({
    status: "success",
    message: req.__('auth.signup_success'), // Use i18n for localized message
    ...user,
  });
};

/**
 * LOGIN
 */
exports.login = async (req, res, next) => {
  const user = req.user;

  req.setLocale(user.languagePreference || "en");

  res.status(200).json({
    status: "success",
    message: req.__('auth.login_success'), // Use i18n for localized message
    ...user,
  });
};
