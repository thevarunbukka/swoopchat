const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
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
      required: true,
    },
    memoryImage: {
      type: String,
      trim: true,
    },
    postType: {
      type: String,
      required: true,
      trim: true,
    },
    postedOn: {
      type: String,
      required: true,
      trim: true,
    },
    comments: [
      {
        _id: { type: String, required: true, trim: true },
        byUserName: { type: String, required: true, trim: true },
        caption: { type: String, required: true },
        replies: [
          {
            _id: { type: String, required: true, trim: true },
            byUserName: { type: String, required: true, trim: true },
            caption: { type: String, required: true },
          },
        ],
      },
    ],
    likes: [],
    saves: [],
    tags: [],
    views: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
