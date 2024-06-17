const StrengthCardModel = require("../models/StrengthCardModel");
const UserModel = require("../models/UserModel");

const addStrengthCard = async (req, res) => {
  try {
    const { description, language, title,additionalText, type, email } = req.body;
    const strengthCard = await StrengthCardModel.create({
      description,
      language,
      title,
      createdByEmail: email,
      additionalText,
      type,
    });
    res.status(201).json({
      success: true,
      message: "Strength Card added successfully",
      data: strengthCard,
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

const getStrengths = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    if (!req.query.type) {
      return res
        .status(400)
        .json({ success: false, message: "Type is required in the params" });
    }
    const type = req.query.type.toUpperCase();

    // Fetch the user email by user ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userEmail = user.email;

    // Fetch strengths
    let strengths = [];
    if (type === "CLIFTON") {
      const cliftonStrengths = await StrengthCardModel.find({
        type: "CLIFTON",
      });
      strengths = cliftonStrengths;
    } else if (type === "GALLUP") {
      const gallupStrengths = await StrengthCardModel.find({ type: "GALLUP" });
      strengths = gallupStrengths;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Type not found" });
    }

    // Fetch custom strengths created by the user
    const customStrengths = await StrengthCardModel.find({
      createdByEmail: userEmail,
    });
    strengths = strengths.concat(customStrengths);

    res.json({
      success: true,
      data: strengths,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addStrengthCard,
  getStrengths,
};
