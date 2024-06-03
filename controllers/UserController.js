const UserModel = require("../models/UserModel");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user with provided email exists in the database
    const existingUser = await UserModel.findOne({ email });
    console.log(existingUser);
    // Check if the provided password matches the stored password hash
    if (existingUser) {
      const isPasswordValid = existingUser.password === password;
      if (isPasswordValid) {
        res.status(200).json({
          success: true,
          message: "User Found",
          data: existingUser,
        });
      }
    } else {
      const user = new UserModel(req.body);
      await user.save();
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a user by ID
const updateUserById = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
