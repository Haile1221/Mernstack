import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./lib/dbConnect.js";
import userRouter from "./route/userRoute.js";
import { errorHandler, requestLogger } from "./middleware/middleware.js";

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5120;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api/v1/users", userRouter);

// Error handling middleware
app.use(errorHandler);

// Initialize the server
async function initializeServer() {
  try {
    const db = await connectToDatabase();
    console.log("Connected to database:", db.databaseName);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize the server:", error);
    process.exit(1); // Exit if the server cannot connect to the database
  }
}

// Call the function to initialize the server
initializeServer();
