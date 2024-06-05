const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, isActive, role, gameCodes } = req.body;
    // Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new student with hashed password
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      isActive,
      role,
      gameCodes,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
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
    // Check if the email field is present in the request body
    if (req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be updated",
      });
    }
    // Extract the email from the request body and remove it
    const { email, ...updateData } = req.body;
    const user = await UserModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
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
// Function to delete a game code from the array
const deleteGameCode = async (req, res) => {
  const { userId, gameCode } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const gameCodeIndex = user.gameCodes.indexOf(gameCode);
    if (gameCodeIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Game code not found" });
    }

    user.gameCodes.splice(gameCodeIndex, 1); // Remove the game code from the array
    await user.save(); // Save the updated user document

    res
      .status(200)
      .json({ success: true, message: "Game code deleted successfully" });
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
  deleteGameCode,
};
