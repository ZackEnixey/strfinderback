const mongoose = require("mongoose");

const StrengthCardSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  createdByEmail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "custom",
  },
});

const StrengthCardModel = mongoose.model("strengthcards", StrengthCardSchema);

module.exports = StrengthCardModel;
