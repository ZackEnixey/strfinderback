const mongoose = require("mongoose");

const ActionCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  additionalText: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "English",
  },
  custom: {
    type: Boolean,
    default: false,
  },
  numberOfUpperTokens: {
    type: Number,
    default: 0,
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

const Workload = mongoose.model("actioncards", ActionCardSchema);

module.exports = Workload;
