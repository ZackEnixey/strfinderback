const mongoose = require("mongoose");

const QuestionCardSchema = new mongoose.Schema({
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
    default: "english",
  },
  custom: {
    type: Boolean,
    default: false,
  },
  additionalText: {
    type: String,
    default: "",
  },
  createdByEmail: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Workload = mongoose.model("questioncards", QuestionCardSchema);

module.exports = Workload;
