// lib/models/Contact.js

import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
