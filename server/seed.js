import dotenv from "dotenv";
import { connectToDatabase } from "./lib/dbConnect.js";
dotenv.config();

// Sample data for users
const users = [
  {
    username: "Haile121",
    email: "hzerfu10@mail.com",
    password: "$2b$10$vD5yRWdxLp1j6riuSi/Ozu71x145viXeGC7AHT5R0WcycGalmYTae",
    avatar: "https://www.gravatar.com/avatar/?d=mp&s=200",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    username: "jane78",
    email: "jane@mail.com",
    password: "$2b$10$vD5yRWdxLp1j6riuSi/Ozu71x145viXeGC7AHT5R0WcycGalmYTae",
    avatar: "https://www.gravatar.com/avatar/?d=mp&s=200", // Gravatar with 200px size for jane78
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Sample tasks (tutors)
const tutors = [
  {
    name: "Read Atomic Habits",
    description: "Finish reading Atomic Habits by James Clear",
    priority: "not urgent",
    due: new Date().toISOString(),
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Learn MERN Stack",
    description:
      "Learn the MERN stack and build a full-stack application with it",
    priority: "urgent",
    due: new Date().toISOString(),
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function main() {
  try {
    const db = await connectToDatabase();
    console.log("Connected to the database:", db.databaseName);

    // Check if users already exist by their email
    const usersCollection = db.collection("users");
    console.log("[seed]", "Checking existing users...");

    for (const user of users) {
      const existingUser = await usersCollection.findOne({ email: user.email });
      if (existingUser) {
        console.log(
          `[seed] User ${user.email} already exists, skipping insert.`
        );
      } else {
        console.log(`[seed] Inserting new user ${user.email}...`);
        await usersCollection.insertOne(user);
      }
    }

    console.log("[seed]", "User seeding completed.");

    // Fetch the inserted users to assign tasks to them
    const userDocs = await usersCollection.find({}).toArray();

    if (userDocs.length === 0) {
      throw new Error("No users found in the database.");
    }

    // Assign tasks to users (use the user IDs)
    tutors[0].owner = userDocs[0]._id; // Assign first task to the first user
    tutors[1].owner = userDocs[1]._id; // Assign second task to the second user

    // Insert tasks into the "tutors" collection
    const tutorsCollection = db.collection("tutors");
    console.log("[seed]", "Seeding tutor tasks...");
    await tutorsCollection.insertMany(tutors);
    console.log("[seed]", "Tutor task seeding completed.");

    console.log("[seed] All done!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    process.exit(0);
  }
}

main();
