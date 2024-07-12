const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameTemplateSchema = new Schema({
  gameTitle: {
    type: String,
    required: true,
  },
  createdByEmail: {
    type: String,
    required: true,
  },
  gameTemplateId: {
    type: String,
    required: true,
  },
  preselectedSolutionIds: {
    type: [String],
    required: true,
  },
  preselectedStrengthIds: {
    type: [String],
    required: true,
  },
  preselectedQuestionIds: {
    type: [String],
    required: true,
  },
  preselectedActionIds: {
    type: [String],
    required: true,
  },
});

const Game = mongoose.model("gametemplate", gameTemplateSchema);

module.exports = Game;
