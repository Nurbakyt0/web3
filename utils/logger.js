const winston = require("winston");
const axios = require("axios");

const couchDBUrl = "http://admin:2005@localhost:5984"; // Update with your CouchDB URL
const dbName = "logs"; // Change this to your desired CouchDB database name
const dbUrl = `${couchDBUrl}/${dbName}`;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "warn.log",
      level: "warn",
    }),
    new winston.transports.File({ filename: "info.log", level: "info" }),
  ],
});

logger.info = async (route, ipAddress, message) => {
  try {
    await axios.post(`${dbUrl}`, {
      route,
      ipAddress,
      message,
      type: "log",
    });
  } catch (error) {
    console.error("Error inserting log to CouchDB:", error);
  }
};

logger.error = async (route, ipAddress, message) => {
  try {
    await axios.post(`${dbUrl}`, {
      route,
      ipAddress,
      message,
      type: "error",
    });
  } catch (error) {
    console.error("Error inserting error log to CouchDB:", error);
  }
};

module.exports = logger;
