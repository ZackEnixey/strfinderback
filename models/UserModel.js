const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  gameCodes: {
    type: [String], // Array of strings
    default: [], // Default value as an empty array
  },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
