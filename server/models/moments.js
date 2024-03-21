const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const momentSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
    },
    momentImage: {
      type: String,
      trim: true,
    },
    postedOn: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Moment", momentSchema);
