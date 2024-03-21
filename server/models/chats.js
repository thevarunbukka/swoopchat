const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    _id: { type: String, required: true, trim: true },
    owners: [String],
    messages: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
