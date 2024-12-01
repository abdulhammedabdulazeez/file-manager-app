const userModel = require("../models/user.model");
const AppError = require("../utils/appError");
const redisClient = require("../utils/redis");

exports.profile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password"); // Exclude password field

    req.setLocale(user.languagePreference || "en");

    if (!user) {
      return next(new AppError(req.__("errors.user_not_found"), 400));
    }

    res.status(200).json({
      status: "success",
      message: req.__("profile.welcome"),
      user, 
    });
  } catch (err) {
    next(err); 
  }
};

exports.updateProfile = (req, res) => {
  res.status(200).json({
    status: "success",
    message: req.__("profile.update_success"), 
  });
};

exports.setLanguage = async (req, res, next) => {
  const userId = req.user.id;
  const { lang } = req.body;

  if (!lang) {
    return next(new AppError(req.__("errors.missing_language"), 400));
  }

  try {
    // Set language preference in Redis
    await redisClient.set(`user:${userId}:lang`, lang);
    console.log(`Language set successfully for user ${userId}`);

    // Update language preference in the database
    await userModel.findByIdAndUpdate(userId, { languagePreference: lang });

    // Set the locale for the current request
    req.setLocale(lang);

    // Debugging statement to check the locale
    console.log(`Locale set to ${req.getLocale()}`);

    res.status(200).json({
      status: "success",
      message: req.__("profile.language_preference_set_successfully"), // Use i18n for localized message
    });
  } catch (err) {
    console.error("Error setting language in Redis:", err);
    return next(
      new AppError(req.__("errors.error_setting_language_preference"), 500)
    );
  }
};
