const mongoose = require("mongoose");

const StrengthCardSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "english",
  },
  createdByEmail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  additionalText: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: true,
  },
  custom: {
    type: Boolean,
    default: false,
  },
});

const StrengthCardModel = mongoose.model("strengthcards", StrengthCardSchema);

module.exports = StrengthCardModel;
