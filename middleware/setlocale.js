const redisClient = require("../utils/redis");
const userModel = require("../models/user.model");

const setLocale = async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const user = await userModel.findById(userId).select("-password");
  console.log(userId);
  console.log(user);
  if (userId) {
    redisClient.get(`user:${userId}:lang`, (err, lang) => {
      if (lang) {
        console.log(`Locale set to ${lang} for user ${userId}`);
        req.setLocale(lang);
      } else {
        req.setLocale("en");
      }
      next();
    });
  } else {
    req.setLocale("en");
    next();
  }
};

module.exports = setLocale;
