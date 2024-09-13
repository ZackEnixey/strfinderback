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
  dilemmaOwner: { type: String, required: true },
  currentlySelectedQuestion: {
    type: Schema.Types.ObjectId,
    ref: "questioncards",
  },
  currentlySelectedAction: {
    type: Schema.Types.ObjectId,
    ref: "actioncards",
  },
  proposedStrength: { type: Schema.Types.ObjectId, ref: "strengthcards" },
  chosenSolution: {
    solution: { type: String, default: null },
    playerName: { type: String, default: null },
  },
  currentlyProposedSolutions: [
    {
      solutionTitle: { type: String, default: "" },
      solutionDescription: { type: String, default: "" },
      solutionId: { type: String, default: "" },
      likes: { type: Number, default: 0 },
      playerName: { type: String, default: null },
    },
  ],
});

const Game = mongoose.model("game", gameSchema);

module.exports = Game;
