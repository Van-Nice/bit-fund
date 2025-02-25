// src/data-source.ts
import { DataSource } from "typeorm";
import { Campaign } from "./entities/Campaign";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Be careful with this in production
  logging: true,
  entities: [Campaign],
  ssl: {
    rejectUnauthorized: false, // Might be needed for some hosting providers
  },
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

export const verifyDatabaseConnection = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log("Database not initialized, attempting to initialize...");
      await initializeDatabase();
    }

    // Test the connection
    await AppDataSource.query("SELECT 1");
    console.log("Database connection verified");
    return true;
  } catch (error) {
    console.error("Database connection verification failed:", error);
    throw error;
  }
};
