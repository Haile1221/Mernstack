import { ObjectId } from "mongodb";
import { connectToDatabase } from "../lib/dbConnect.js";

import bcrypt from "bcrypt";

// Create a new user
export async function createUser(req, res) {
  const { username, email, password, avatar } = req.body;
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  const existingUser = await usersCollection.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
    username,
    email,
    password: hashedPassword,
    avatar,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);
  const insertedUser = await usersCollection.findOne({
    _id: result.insertedId,
  });

  return res.status(201).json(insertedUser);
}

// Get all users
export async function getAllUsers(req, res) {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  const users = await usersCollection.find({}).toArray();
  res.status(200).json(users);
}

// Get user by ID
export async function getUserById(req, res) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}

// Update user
export async function updateUser(req, res) {
  const id = req.params.id;
  const { username, email, password, avatar } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          username,
          email,
          password,
          avatar,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}

// Delete user
export async function deleteUser(req, res) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}
