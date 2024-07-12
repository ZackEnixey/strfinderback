const UserModel = require("../models/UserModel");
const Game = require("../models/GameTemplateModel");

const generateRandomId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const createGame = async (req, res) => {
  try {
    const {
      gameTitle,
      createdByEmail,
      preselectedSolutionIds,
      preselectedStrengthIds,
      preselectedQuestionIds,
      preselectedActionIds,
    } = req.body;

    if (
      !gameTitle ||
      !createdByEmail ||
      !preselectedSolutionIds ||
      !preselectedStrengthIds ||
      !preselectedQuestionIds ||
      !preselectedActionIds
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const gameTemplateId = generateRandomId();

    const newGame = new Game({
      gameTitle,
      createdByEmail,
      gameTemplateId,
      preselectedSolutionIds,
      preselectedStrengthIds,
      preselectedQuestionIds,
      preselectedActionIds,
    });

    const savedGame = await newGame.save();
    res.status(201).json({
      message: "Game Created Successfully",
      gameCode: savedGame.gameTemplateId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getGames = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userEmail = user.email;

    const games = await Game.find({ createdByEmail: userEmail });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedGame = await Game.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedGame) {
      return res.status(404).json({ message: "Game not found" });
    }

    res
      .status(200)
      .json({ message: "Game updated successfully", game: updatedGame });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createGame,
  getGames,
  updateGame,
  deleteGame,
};
