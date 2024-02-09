const dotenv = require("dotenv");
const app = require("./app");
const connectDatabase = require("./config/Database");

// Load environment variables
console.log("Loading environment variables...");
const result = dotenv.config({ path: '../Backend/config/config.env' });

if (result.error) {
  console.error("Error loading environment variables:", result.error);
  process.exit(1);
}
console.log("Environment variables loaded successfully.");

// Connect to the database
console.log("Connecting to the database...");
connectDatabase()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

// Create the server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
