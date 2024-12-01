const winston = require("winston");
const fs = require("fs");
const path = require("path");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create logs directory:", error);
}

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const getTransports = () => {
  const baseTransports = [new winston.transports.Console()];

  // Only add file transports if not in test environment
  if (process.env.NODE_ENV !== "test") {
    baseTransports.push(
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
        handleExceptions: true,
        maxsize: 5242880, //5mb
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: "logs/all.log",
      })
    );
  }

  return baseTransports;
};

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: getTransports(),
  exitOnError: false,
});

module.exports = logger;
