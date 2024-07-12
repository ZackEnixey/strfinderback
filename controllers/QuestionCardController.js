const QuestionModel = require("../models/QuestionCardModel");
const UserModel = require("../models/UserModel");

// Add a new question
const addQuestion = async (req, res) => {
  try {
    const { title, description, language, additionalText, email, custom } =
      req.body;

    const question = await QuestionModel.create({
      title,
      description,
      language,
      additionalText,
      createdByEmail: email,
      custom,
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully",
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

// Get questions
const getQuestions = async (req, res) => {
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

    // Fetch questions filtered by language, either custom questions created by the user or default questions
    const questions = await QuestionModel.find({
      $or: [
        { createdByEmail: userEmail, language },
        { custom: false || null, language },
      ],
    });

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, title, additionalText } = req.body;

    const updatedCard = await QuestionModel.findByIdAndUpdate(
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
        .json({ success: false, message: "Question Card not found" });
    }

    res.json({
      success: true,
      message: "Question Card updated successfully",
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
  addQuestion,
  getQuestions,
  updateQuestion,
};
