const PlayerModel = require("../models/Player");

const loginPlayer = async (req, res) => {
  try {
    const { nickName, email } = req.body;
    const existingPlayer = await PlayerModel.findOne({ email });
    if (existingPlayer) {
      return res.status(201).json({
        success: true,
        message: "Player already exists",
        data: existingPlayer,
      });
    }
    const newPlayer = await PlayerModel.create({
      nickName,
      email,
    });
    res.status(201).json({
      success: true,
      message: "Player created successfully",
      data: newPlayer,
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
const updatePlayerById = async (req, res) => {
  try {
    if (req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be updated",
      });
    }

    const updateData = {};
    if (req.body.nickName) updateData.nickName = req.body.nickName;
    if (req.body.strengths) updateData.strengths = req.body.strengths;
    if (req.body.isReady) updateData.isReady = req.body.isReady;

    const Player = await PlayerModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!Player) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found" });
    }

    res.status(200).json({
      success: true,
      message: "Player updated successfully",
      data: Player,
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
  loginPlayer,
  updatePlayerById,
};
