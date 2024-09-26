import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// load evironment variables
const DB_URI = process.env.MONGODB_URI; //MONGODB_URI
const DB_NAME = process.env.MONGODB_NAME; //MONGODB_Database name

// check the environment variables
if (!DB_URI) {
  console.error(
    "Error: MONGODB_URI is not defined in the environment variables."
  );
  process.exit(1);
}

if (!DB_NAME) {
  console.error(
    "Error: MONGODB_NAME is not defined in the environment variables."
  );
  process.exit(1);
}

//create a mongoDB instance
const client = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Async functions to connect with database

export async function connectToDatabase() {
  try {
    //connect MongoClient to the mongoDB databse
    await client.connect();
    // once connected, send a ping command to verify the connection is successful
    await client.db(DB_NAME).command({ ping: 1 });
    console.log("Connected to the database successfully");
    return client.db(DB_NAME);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

// after completing we should shutdown close our databse
process.on("SIGINT", async () => {
  //listen for SIGINT signal
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
