// Import dependencies
const { Sequelize } = require("sequelize");
require("dotenv").config(); // Ensure .env variables are loaded

// Declaring database configuration parameters
const CONFIG = {
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DIALECT: process.env.DB_DIALECT || "postgres",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432, // Default PostgreSQL port
};

// Create a new Sequelize instance
const sequelize = new Sequelize(
  CONFIG.DB_NAME,
  CONFIG.DB_USERNAME,
  CONFIG.DB_PASSWORD,
  {
    host: CONFIG.DB_HOST,
    dialect: CONFIG.DB_DIALECT, // Should be a string such as 'postgres'
    port: CONFIG.DB_PORT,
    logging: false, // Optionally disable logging
    dialectOptions: {
      connectTimeout: 60000, // 60 seconds
    },
  }
);

// Function to authenticate and sync the database
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL database successful");

    await sequelize.sync({ alter: true }); // Ensures database schema is up-to-date without altering
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Unable to connect to the PostgreSQL database:", error);
    throw error;
  }
};

// Initialize the database
initializeDatabase();

// Export the Sequelize instance
module.exports = sequelize;
