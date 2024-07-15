const ActionModel = require("../models/ActionCardModel");
const UserModel = require("../models/UserModel");

// Add a new action
const addAction = async (req, res) => {
  try {
    const { title, description, language, numberOfUpperTokens, email, custom } =
      req.body;

    const question = await ActionModel.create({
      title,
      description,
      language,
      numberOfUpperTokens,
      createdByEmail: email,
      custom,
    });

    res.status(201).json({
      success: true,
      message: "Action added successfully",
      data: question,
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

// Get actions
const getActions = async (req, res) => {
  try {
    const userId = req.params.id;
    const language = req.query.language || "English";

    // Fetch the user email by user ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userEmail = user.email;

    // Fetch actions filtered by language, either custom questions created by the user or default questions
    const actions = await ActionModel.find({
      $or: [
        { createdByEmail: userEmail, language },
        { custom: false, language },
      ],
    });

    res.json({
      success: true,
      data: actions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, title, additionalText, numberOfUpperTokens } =
      req.body;

    const updatedCard = await ActionModel.findByIdAndUpdate(
      id,
      {
        description,
        title,
        additionalText,
        numberOfUpperTokens,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res
        .status(404)
        .json({ success: false, message: "Action Card not found" });
    }

    res.json({
      success: true,
      message: "Action Card updated successfully",
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
  addAction,
  getActions,
  updateAction,
};
