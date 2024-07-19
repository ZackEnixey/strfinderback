const mongoose = require("mongoose");
const Player = require("./Player");

const groupSchema = new mongoose.Schema({
  groupCode: { type: String, required: true, unique: true },
  gameCode: { type: String, required: true },
  players: { type: [Player.schema], default: [] },
});

module.exports = mongoose.model("Group", groupSchema);
