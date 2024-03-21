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

exports.getNotification = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const getUser = await User.findById(authenticatedUserId);
      res.status(200).json({
        status: "NOTIFICATIONS_LOADED",
        data: {
          notifications: getUser.notifications.reverse(),
        },
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

exports.acceptFollowRequest = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const otherUserName = req.body.otherUserName;
  const notificationId = req.body.notificationId;
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
      await User.findByIdAndUpdate(
        otherUserName,
        {
          $push: {
            following: authenticatedUserId,
            notifications: {
              _id: randomID,
              notification: "BASIC",
              sender: authenticatedUserId,
              reciever: otherUserName,
              text:
                getUser.firstName +
                " " +
                getUser.lastName +
                " " +
                " accepted your follow request.",
              dateAndTime: fullDateAndTime,
            },
          },
        },
        {}
      );
      await User.findByIdAndUpdate(
        authenticatedUserId,
        {
          $push: {
            followers: otherUserName,
            notifications: {
              _id: randomID,
              notification: "BASIC",
              sender: otherUserName,
              reciever: authenticatedUserId,
              text:
                getOtherUser.firstName +
                " " +
                getOtherUser.lastName +
                " started following you.",
              dateAndTime: fullDateAndTime,
            },
          },
        },
        {}
      );
      await User.findByIdAndUpdate(
        otherUserName,
        {
          $pull: {
            followRequestsSent: authenticatedUserId,
          },
        },
        {}
      );
      await User.findByIdAndUpdate(
        authenticatedUserId,
        {
          $pull: {
            notifications: { _id: notificationId },
          },
        },
        {}
      );
      res.status(200).json({
        status: "FOLLOW_REQUEST_ACCEPTED",
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

exports.rejectFollowRequest = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const otherUserName = req.body.otherUserName;
  const notificationId = req.body.notificationId;
  const mainTask = async () => {
    try {
      await User.findByIdAndUpdate(
        otherUserName,
        {
          $pull: {
            followRequestsSent: authenticatedUserId,
          },
        },
        {}
      );
      await User.findByIdAndUpdate(
        authenticatedUserId,
        {
          $pull: {
            notifications: { _id: notificationId },
          },
        },
        {}
      );
      res.status(200).json({
        status: "FOLLOW_REQUEST_REJECTED",
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

exports.deleteNotification = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const notificationId = req.body.notificationId;
  const mainTask = async () => {
    try {
      await User.findByIdAndUpdate(
        authenticatedUserId,
        {
          $pull: {
            notifications: { _id: notificationId },
          },
        },
        {}
      );
      res.status(200).json({
        status: "NOTIFICATION_DELETED",
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
