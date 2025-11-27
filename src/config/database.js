const { connect } = require("mongoose");
const { DB, REQUEST_TIMEOUT } = require("./index");
const { success, error } = require("consola");

const connectDB = async () => {
  try {
    // Remove the deprecated options - they are no longer needed in MongoDB Driver v4+
    await connect(DB, {
      serverSelectionTimeoutMS: REQUEST_TIMEOUT,
    });

    success({ message: `✅ Successfully connected to MongoDB: ${DB}`, badge: true });
  } catch (err) {
    error({ message: `❌ Failed to connect to MongoDB:\n${err}`, badge: true });

    // Automatic restart - retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;