const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: String,
    trim: true,
  },
  accountPrivacy: Boolean,
  chatLockPasscode: {
    type: String,
  },
  posts: [],
  chats: [],
  stories: [],
  followers: [],
  following: [],
  searchHistory: [],
  liked: [],
  saved: [],
  followRequestsSent: [],
  moments: [],
  momentsOnProfile: [],
  notifications: [
    {
      _id: { type: String, required: true, trim: true },
      notification: {
        type: String,
        required: true,
      },
      sender: {
        type: String,
        required: true,
      },
      reciever: {
        type: String,
        required: true,
      },
      text: {
        type: String,
      },
      dateAndTime: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
