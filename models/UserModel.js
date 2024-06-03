const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false // Adjust as needed
  },
  password: {
    type: String,
    required: false // Adjust as needed
  },
  isActive: {
    type: Boolean,
    required: true
  },
  gameCodes: {
    type: [String], // Array of strings
    default: [] // Default value as an empty array
  }
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
