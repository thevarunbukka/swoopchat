const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    _id: { type: String, required: true, trim: true },
    chatID: { type: String, required: true, trim: true },
    sender: { type: String, required: true, trim: true },
    type: { type: String },
    reply: { type: Object },
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
