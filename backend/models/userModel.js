// backend/models/userModel.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  // We can also add an admin flag here if you want
  // isAdmin: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);
module.exports = User;