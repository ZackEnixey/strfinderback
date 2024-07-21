const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  strengths: {
    type: [{ type: Schema.Types.ObjectId, ref: "strengthcards" }],
    default: [],
  },
  isReady: {
    type: Boolean,
    default: false,
  },
});

const Workload = mongoose.model("player", PlayerSchema);

module.exports = Workload;
