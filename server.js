const app = require("./app");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const logger = require("./utils/logger");

// UNCAUGHT EXCEPTION
process.on("uncaughtException", (error, origin) => {
  logger.error("UNCAUGHT EXCEPTION! 🔥 Shutting Down...");
  logger.error({ ERROR: error, ORIGIN: origin });
  logger.error(error.name, error.message);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  logger.info(`server listening on http://localhost:${PORT} ...`);
  // swaggerDocs(app);
});

//UNHANDLED REJECTION
process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED REJECTION! 🔥 Shutting Down...");
  logger.error({ REASON: reason });
  server.close(() => {
    process.exit(1);
  });
});
