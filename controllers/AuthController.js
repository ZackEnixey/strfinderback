const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

// Define login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare the password provided with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    // If email and password are correct, create and return an access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login };
