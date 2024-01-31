const dotenv = require("dotenv");
const app = require("./app");
const connectDatabase = require("./config/Database");

// Log start of environment variables loading
console.log("Loading environment variables...");

// Load environment variables directly
const result = dotenv.config({ path: '../Backend/config/config.env' });

if (result.error) {
  console.error("Error loading environment variables:", result.error);
  process.exit(1);
}


// Log end of environment variables loading
console.log("Environment variables loaded successfully.");

// Log start of database connection
console.log("Connecting to the database...");

// Database connection
connectDatabase();

// Log end of database connection
console.log("Database connected successfully.");

//HANDLING UNCAUGHT ERRROR//
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to uncaught exception`);
  process.exit(1);
});


// Create the server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//UNHANDLED REJECTION ERROR ///
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to Unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
