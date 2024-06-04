const StrengthCardModel = require("../models/StrengthCardModel");

const addStrengthCard = async (req, res) => {
  try {
    const { description, language, title, type } = req.body;
    const createdByEmail = "email"; // storing user email in the request object
    console.log(createdByEmail);
    const strengthCard = await StrengthCardModel.create({
      description,
      language,
      title,
      createdByEmail,
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
    if (!req.body.type) {
      return res
        .status(400)
        .json({ success: false, message: "Type is required in the body" });
    }
    const type = req.body.type;
    if (type === "CLIFTON") {
      const cliftonStrengths = await StrengthCardModel.find({
        type: "CLIFTON",
      });
      res.json({
        success: true,
        data: cliftonStrengths,
      });
    } else if (type === "GALLUP") {
      const gallupStrengths = await StrengthCardModel.find({ type: "GALLUP" });
      res.json({
        success: true,
        data: gallupStrengths,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addStrengthCard,
  getStrengths,
};
