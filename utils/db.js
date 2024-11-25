// db.js
require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");

const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/filemanager";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(DB_URI);
//     console.log("Connected to MongoDB");
//   } catch (err) {
//     console.error("Database connection error:", err);
//     process.exit(1); // Exit process with failure
//   }
// };

class DBClient {
  constructor() {
    this.db = null;
    this.usersCollection = null;
    this.filesCollection = null;
    this.connect();
  }

  async connect() {
    try {
      const client = await mongoose.connect(DB_URI);
      this.db = client.connection.db;
      this.usersCollection = this.db.collection("users");
      this.filesCollection = this.db.collection("files");
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Database connection error:", err.message);
      this.db = false;
      process.exit(1); // Exit process with failure
    }
  }

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
