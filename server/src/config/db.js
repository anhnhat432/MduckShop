const mongoose = require("mongoose");

const connectDB = async (mongoUri = process.env.MONGODB_URI) => {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(mongoUri);

  if (process.env.NODE_ENV !== "test") {
    console.log(`MongoDB connected: ${connection.connection.host}`);
  }
};

module.exports = connectDB;
