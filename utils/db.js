const mongoose = require("mongoose");
require("dotenv").config();
const appError = require("../utils/appError");
const logger = require("../utils/logger");

const url = process.env.MONGO_URI;

// const connectDB = async () => {
//   try {
//     await mongoose.connect(url);
//     logger.info("DB Connected!");
//   } catch (error) {
//     logger.error(error);
//     return new appError(error.message, 500);
//   }
// };

class DBClient {
  constructor() {
    this.db = null;
    this.usersCollection = null;
    this.filesCollection = null;
    // this.connect();
  }

    async connectDB() {
    try {
      const client = await mongoose.connect(url);
      this.db = client.connection.db;
      this.usersCollection = this.db.collection("users");
      this.filesCollection = this.db.collection("files");
      logger.info("DB Connected!");
    } catch (error) {
      logger.error(error);
      return new appError(error.message, 500);
    }
  };

  // async connect() {
  //   try {
  //     const client = await mongoose.connect(DB_URI);
  //     this.db = client.connection.db;
  //     this.usersCollection = this.db.collection("users");
  //     this.filesCollection = this.db.collection("files");
  //     console.log("Connected to MongoDB");
  //   } catch (err) {
  //     console.error("Database connection error:", err.message);
  //     this.db = false;
  //     process.exit(1); // Exit process with failure
  //   }
  // }

  /**
   * Checks if connection to Redis is Alive
   * @return {boolean} true if connection alive or false if not
   */
  isAlive() {
    return !!this.db;
  }

  /**
   * Returns the number of documents in the collection users
   * @return {number} amount of users
   */
  async nbUsers() {
    const numberOfUsers = await this.usersCollection.countDocuments();
    return numberOfUsers;
  }

  /**
   * Returns the number of documents in the collection files
   * @return {number} amount of files
   */
  async nbFiles() {
    const numberOfFiles = await this.filesCollection.countDocuments();
    return numberOfFiles;
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
