import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// Load environment variables
const DB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_NAME;

if (!DB_URI || !DB_NAME) {
  console.error("Error: MongoDB URI and/or Database Name not defined.");
  process.exit(1);
}

const client = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to connect to the database
export async function connectToDatabase() {
  try {
    await client.connect();
    await client.db(DB_NAME).command({ ping: 1 });
    console.log("Connected to the database successfully");
    return client.db(DB_NAME);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  try {
    await client.close();
    console.log("MongoDB client closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});
