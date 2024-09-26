import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./lib/dbConnect.js";
import userRouter from "./route/userRoute.js";
import { errorHandler, requestLogger } from "./middleware/middleware.js";

// write connection functiom
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
const PORT = process.env.PORT || 3000;

async function initializeServer() {
  try {
    const db = await connectToDatabase();
    console.log("connected to database : ", db.databaseName);
    app.use("/api/v1/users", userRouter);
    app.use(errorHandler);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize the database:", error);
    process.exit(1);
  }
}
//initilize the server

initializeServer();
