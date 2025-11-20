const { connect } = require("mongoose");
const { DB, REQUEST_TIMEOUT } = require("./index");
const { success, error } = require("consola");

const connectDB = async () => {
  try {

    await connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: REQUEST_TIMEOUT,
    });

    success({ message: `✅ Successfully connected to MongoDB: ${DB}`, badge: true });
  } catch (err) {
    error({ message: `❌ Failed to connect to MongoDB:\n${err}`, badge: true });

    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
