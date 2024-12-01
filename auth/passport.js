require("dotenv").config();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const passportjwt = require("passport-jwt");
const userModel = require("../models/user.model");
const { createSendToken } = require("../utils/createSendToken");
const logger = require("../utils/logger");
const appError = require("../utils/appError");
const redisClient = require("../utils/redis");

require("dotenv").config();
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = passportjwt.Strategy;
const ExtractJWT = passportjwt.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      console.log("token :", token);
      if (!token) {
        throw new appError(req.__('errors.unauthorized_login'), 401);
        // return done(null, false);
      }
      try {
        const user = {
          id: token.userId,
          // email: token.email,
        };
        console.log("user :", user);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { username, languagePreference } = req.body;
      req.setLocale(languagePreference);
      try {
        if (!(req.password === req.confirmPassword)) {
          throw new appError(req.__('errors.passwords_must_match'), 400);
        }

        if (!(email && password)) {
          throw new appError(req.__('errors.provide_full_signup_details'), 400);
        }

        const oldUser = await userModel.findOne({ email });
        if (oldUser)
          throw new appError(req.__('errors.user_already_exists'), 409);

        const user = await userModel.create({
          email,
          password,
          username,
          languagePreference,
        });

        // Set language preference in Redis
        redisClient.set(`user:${user._id}:lang`, languagePreference, (err) => {
          if (err) {
            return next(
              new appError(req.__('errors.error_setting_language_preference'), 500)
            );
          }
        });

        const userData = await createSendToken(user);
        console.log("userData :", userData);

        // await userModel.deleteOne({ email });
        done(null, userData.user);
      } catch (error) {
        done(error);
        logger.error(error);
        throw new appError(error.message, error.statusCode);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      req.setLocale(languagePreference);
      try {
        if (!(email || password)) {
          throw new appError(req.__('errors.provide_login_details'), 400);
        }

        const user = await userModel.findOne({ email });
        if (!user || !(await user.isValidPassword(password))) {
          throw new appError(req.__('errors.email_or_password_incorrect'), 401);
        }

        const userData = await createSendToken(user);
        console.log("userData :", userData);
        done(null, userData.user);
      } catch (error) {
        logger.error(error);
        throw new appError(error.message, error.statusCode);
      }
    }
  )
);
