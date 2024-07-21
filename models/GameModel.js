const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  gameTemplate: {
    type: Schema.Types.ObjectId,
    ref: "gametemplate",
    required: true,
  },
  groupCode: {
    type: String,
    required: true,
  },
  players: [{ type: Schema.Types.ObjectId, ref: "player" }],
  phase: { type: Number, default: 0 },
  currentlySelectedQuestion: {
    type: Schema.Types.ObjectId,
    ref: "questioncards",
  },
  proposedStrength: { type: Schema.Types.ObjectId, ref: "strengthcards" },
  chosenSolution: {
    solution: { type: Schema.Types.ObjectId, ref: "solutioncards" },
    playerName: { type: String, default: null },
  },
  currentlyProposedSolutions: [
    {
      solution: { type: Schema.Types.ObjectId, ref: "solutioncards" },
      playerName: { type: String, default: null },
    },
  ],
});

const Game = mongoose.model("game", gameSchema);

module.exports = Game;
