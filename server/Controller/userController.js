import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

import { connectToDatabase } from "../lib/dbConnect.js";

// create user

export async function createUser(req, res) {
  const { username, email, password, avatar } = req.body;
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");
  // check if a user with same email or username already existed
  const existingUser = await usersCollection.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "the User with email or password already exists" });
  }

  // first hash the password before storing into database
  const hashpassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    email,
    password: hashpassword,
    avatar,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await usersCollection.insertOne(newUser);

  // fetch the insrted decument using the inserted id
  const insertedUser = await usersCollection.findOne({
    _id: result.insertedId,
  });
  res.status(201).json(insertedUser);
}

// to read all users

export async function getAllUsers(req, res) {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");
  const users = await usersCollection.find({}).toArray();
  res.status(200).json(users);
}

// geting or read users by their id method

export async function getUserById(req, res) {
  const { id } = req.params;
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  //validate if the id is valid object id

  if (!ObjectId) {
    return res.status(400).json({ message: "invalid id" });
  }
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Error fetching user" });
  }
}

// update user

export async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, password, avatar } = req.body;

  // Check if ID is valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
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

    // Log the result for debugging
    console.log("Update Result:", result);

    // Check if the user was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user" });
  }
}

// delete user

export async function deleteUser(req, res) {
  const { id } = req.params;

  // Validate the ID
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    // Check if the user was not found and deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success response
    return res.status(200).json({ msg: "User is deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting user" });
  }
}
