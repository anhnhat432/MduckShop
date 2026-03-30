require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { loadEnvConfig } = require("./config/env");

const startServer = async () => {
  try {
    const env = loadEnvConfig(process.env);

    await connectDB(env.mongoUri);

    app.listen(env.port, () => {
      console.log(`Server is listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
