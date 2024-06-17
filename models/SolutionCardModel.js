const mongoose = require("mongoose");

const SolutionCardSchema = new mongoose.Schema({
  title: {
        type: String,
        required: true,
      },
  description: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "english"
  },
  custom:{
    type: Boolean,
    default: false
  },
  createdByEmail: {
    type: String,
    required: false,
  },
  info: {
    type: String,
    required: true,
  },
  urlForLiterature:{
  type: String,
  required: true,
 },
 urlForTedTalk:{
    type: String,
    required: true
 },
  type: {
    type: String,
    required: true,
  },
});

const SolutionCardModel = mongoose.model("solutioncards", SolutionCardSchema);

module.exports = SolutionCardModel;
