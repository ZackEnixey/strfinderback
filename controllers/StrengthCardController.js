const StrengthCardModel = require("../models/StrengthCardModel");
const UserModel = require("../models/UserModel");

const addStrengthCard = async (req, res) => {
  try {
    const {
      description,
      language,
      title,
      additionalText,
      type,
      email,
      custom,
    } = req.body;
    const strengthCard = await StrengthCardModel.create({
      description,
      language,
      title,
      createdByEmail: email,
      additionalText,
      type,
      custom,
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
    if (!req.query.type) {
      return res
        .status(400)
        .json({ success: false, message: "Type is required in the params" });
    }
    const type = req.query.type.toUpperCase();

    // Validate the type
    const validTypes = ["CLIFTON", "GALLUP"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    // Fetch the user email by user ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userEmail = user.email;

    // Fetch strengths of the given type and custom strengths created by the user
    const strengths = await StrengthCardModel.find({
      $or: [{ type }, { createdByEmail: userEmail, type }],
    });

    res.json({
      success: true,
      data: strengths,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStrengthCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, title, additionalText } = req.body;

    const updatedCard = await StrengthCardModel.findByIdAndUpdate(
      id,
      {
        description,
        title,
        additionalText,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res
        .status(404)
        .json({ success: false, message: "Strength Card not found" });
    }

    res.json({
      success: true,
      message: "Strength Card updated successfully",
      data: updatedCard,
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

module.exports = {
  addStrengthCard,
  getStrengths,
  updateStrengthCard,
};
