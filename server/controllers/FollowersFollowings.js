const User = require("../models/users");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

exports.getFollowersFollowings = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const otherUserName = req.body.otherUserName;
  const myFollowersFollowings = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      const rawFollowers = await User.find({
        _id: {
          $in: fetchUser.followers,
        },
      });
      const rawFollowing = await User.find({
        _id: {
          $in: fetchUser.following,
        },
      });
      const followers = rawFollowers.map((item) => {
        return {
          _id: item._id,
          fullName: item.firstName + " " + item.lastName,
        };
      });

      const following = rawFollowing.map((item) => {
        return {
          _id: item._id,
          fullName: item.firstName + " " + item.lastName,
        };
      });

      res.status(200).json({
        status: "FOLLOWERS_AND_FOLLOWING_FETCHED",
        data: {
          following,
          followers,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };

  const othersFollowersFollowings = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      const fetchOtherUser = await User.findById(otherUserName);

      const rawFollowers = await User.find({
        _id: {
          $in: fetchOtherUser.followers,
        },
      });
      const rawFollowing = await User.find({
        _id: {
          $in: fetchOtherUser.following,
        },
      });
      // correct logic from here
      const followers = rawFollowers.map((item) => {
        const isFollowing = fetchUser.following.includes(item._id);
        const isRequested = fetchUser.followRequestsSent.includes(item._id);
        return {
          _id: item._id,
          fullName: item.firstName + " " + item.lastName,
          isFollowing,
          isRequested,
        };
      });

      const following = rawFollowing.map((item) => {
        const isFollowing = fetchUser.following.includes(item._id);
        const isRequested = fetchUser.followRequestsSent.includes(item._id);
        return {
          _id: item._id,
          fullName: item.firstName + " " + item.lastName,
          isFollowing,
          isRequested,
        };
      });
      console.log(following, followers);
      res.status(200).json({
        status: "FOLLOWERS_AND_FOLLOWING_FETCHED",
        data: {
          following,
          followers,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  if (authenticatedUserId === otherUserName) {
    myFollowersFollowings();
  }
  if (authenticatedUserId !== otherUserName) {
    othersFollowersFollowings();
  }
};

exports.follow = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const otherUserName = req.body.otherUserName;
  const randomID = Math.floor(Math.random() * 1000000 + 1).toString();

  const date = new Date();
  let fullDateAndTime =
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    ", " +
    date.getDate() +
    " " +
    months[date.getMonth()] +
    " " +
    date.getFullYear();

  const mainTask = async () => {
    try {
      const getUser = await User.findById(authenticatedUserId);
      const getOtherUser = await User.findById(otherUserName);

      if (getOtherUser.accountPrivacy === true) {
        const temp1 = await User.findByIdAndUpdate(
          otherUserName,
          {
            $push: {
              notifications: {
                _id: randomID,
                notification: "FOLLOW_REQUEST",
                sender: authenticatedUserId,
                reciever: otherUserName,
                text: authenticatedUserId + " has sent you a follow request.",
                dateAndTime: fullDateAndTime,
              },
            },
          },
          {}
        );
        const temp2 = await User.findByIdAndUpdate(
          authenticatedUserId,
          {
            $push: {
              followRequestsSent: otherUserName,
            },
          },
          {}
        );
        res.status(200).json({
          status: "FOLLOW_REQUEST_SENT",
        });
      } else {
        const temp1 = await User.findByIdAndUpdate(
          otherUserName,
          {
            $push: {
              followers: authenticatedUserId,
              notifications: {
                _id: randomID,
                notification: "BASIC",
                sender: authenticatedUserId,
                reciever: otherUserName,
                text:
                  getUser.firstName +
                  " " +
                  getUser.lastName +
                  " started following you.",
                dateAndTime: fullDateAndTime,
              },
            },
          },
          {}
        );
        const temp2 = await User.findByIdAndUpdate(
          authenticatedUserId,
          {
            $push: {
              following: otherUserName,
            },
          },
          {}
        );
        res.status(200).json({
          status: "STARTED_FOLLOWING",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};

exports.unfollow = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const otherUserName = req.body.otherUserName;
  const mainTask = async () => {
    try {
      await User.findByIdAndUpdate(
        otherUserName,
        {
          $pull: {
            followers: authenticatedUserId,
          },
        },
        {}
      );
      await User.findByIdAndUpdate(
        authenticatedUserId,
        {
          $pull: {
            following: otherUserName,
          },
        },
        {}
      );
      res.status(200).json({
        status: "UNFOLLOWED",
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

exports.remove = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const otherUserName = req.body.otherUserName;
  const mainTask = async () => {
    try {
      await User.findByIdAndUpdate(
        otherUserName,
        {
          $pull: {
            following: authenticatedUserId,
          },
        },
        {}
      );
      await User.findByIdAndUpdate(
        authenticatedUserId,
        {
          $pull: {
            followers: otherUserName,
          },
        },
        {}
      );
      res.status(200).json({
        status: "FOLLOWER_REMOVED",
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
