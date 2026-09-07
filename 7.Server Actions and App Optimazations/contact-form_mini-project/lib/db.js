// lib/db.js

import mongoose from "mongoose";

export async function dbConnet() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connection Successful!!");
  } catch (error) {
    throw new Error(error);
  }
}
