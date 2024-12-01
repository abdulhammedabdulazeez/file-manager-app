const express = require("express");
const passport = require("passport");
const app = express();
const dbClient = require("./utils/db");
const bodyParser = require("body-parser");
const httpLogger = require("./utils/httpLogger");
const routes = require("./routers/index");
const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/user.router");
const fileRouter = require("./routers/file.router");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const redisClient = require("./utils/redis");
const i18n = require("./utils/i18nConfig");
const setLocale = require("./middleware/setlocale");
const swaggerDocs = require("./swagger");

require("dotenv").config();

dbClient.connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(httpLogger);
app.use(i18n.init); // Initialize i18n

// Apply setLocale middleware globally
app.use(setLocale);

// Middleware to set the locale based on user's preference
app.use((req, res, next) => {
  const userId = req.user ? req.user.id : null;
  if (userId) {
    redisClient.get(`user:${userId}:lang`, (err, lang) => {
      if (lang) {
        req.setLocale(lang);
        console.log(`Locale set to ${lang} for user ${userId}`);
      }
      next();
    });
  } else {
    next();
  }
});

app.use("/", routes);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/files", fileRouter);

swaggerDocs(app);

app.use("*", (req, res, next) => {
  return next(new appError(`${req.originalUrl} not found on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
