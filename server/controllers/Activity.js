const User = require("../models/users");
const Moment = require("../models/moments");
const Post = require("../models/posts");

exports.getFeed = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      const followings = fetchUser.following;
      followings.push(authenticatedUserId);
      const rawFeed = await Post.find({
        userName: {
          $in: followings,
        },
      }).sort({ createdAt: -1 });

      const feed = rawFeed.map((item) => {
        const isSaved = fetchUser.saved.includes(item._id);
        const isLiked = fetchUser.liked.includes(item._id);
        return { ...item._doc, isSaved, isLiked };
      });

      const previousDay = new Date();
      previousDay.setHours(previousDay.getHours() - 24);
      const moments = await Moment.find({
        userName: {
          $in: followings,
        },
        createdAt: { $gt: previousDay },
      }).sort({ createdAt: -1 });

      const notification = fetchUser.notifications.length;

      res.status(200).json({
        status: "FEED_FETCHED",
        data: { moments: moments, feed: feed, notification },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};

exports.shareMoment = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const momentImage = req.file.originalname;
  const caption = req.body.caption.trim();
  const momentID = req.body.momentID;
  const fullDate = req.body.fullDate;

  const mainTask = async () => {
    try {
      const createMoment = new Moment({
        _id: momentID,
        userName: authenticatedUserId,
        caption: caption,
        momentImage: momentImage,
        postedOn: fullDate,
      });
      const result = await createMoment.save();
      const updateUser = await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          $push: {
            moments: momentID,
          },
        },
        {}
      );
      res.status(200).json({
        status: "MOMENT_CREATED",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};
