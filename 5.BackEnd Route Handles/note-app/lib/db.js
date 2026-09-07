import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.error(error);
    throw new Error("DB connection failed");
  }
}
