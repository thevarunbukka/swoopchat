const Chat = require("../models/chats");
const Message = require("../models/messages");
const User = require("../models/users");

const io = require("../socket");

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

exports.createNew = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const otherUserName = req.body.otherUserName;
  const chatIDPrimary = authenticatedUserId + "₹₹₹₹" + otherUserName;
  const chatIDSecondary = otherUserName + "₹₹₹₹" + authenticatedUserId;

  const mainTask = async () => {
    try {
      const checkIfAlreadyExists = await Chat.findOne({
        _id: { $in: [chatIDPrimary, chatIDSecondary] },
      });

      if (checkIfAlreadyExists) {
        res.status(200).json({
          status: "ALREADY_EXISTS",
          data: {
            chatID: checkIfAlreadyExists._id,
          },
        });
      } else {
        const messageID = Math.floor(
          Math.random() * 100000000000000 + 1
        ).toString();
        const createChat = new Chat({
          _id: chatIDPrimary,
          owners: [authenticatedUserId, otherUserName],
        });
        await createChat.save();
        const firstMessage = new Message({
          _id: messageID,
          chatID: chatIDPrimary,
          sender: authenticatedUserId,
          type: "SYSTEM",
          message: "Chat started by " + authenticatedUserId + ".",
        });
        await firstMessage.save();
        await Chat.findByIdAndUpdate(chatIDPrimary, {
          $push: {
            messages: messageID,
          },
        });
        io.getIO().emit("NEW_CHAT", [authenticatedUserId, otherUserName]);
        res.status(200).json({
          status: "NEW_CHAT_CREATED",
          data: {
            chatID: chatIDPrimary,
          },
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

exports.getChats = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const chats = await Chat.find({
        owners: authenticatedUserId,
      }).sort({ updatedAt: -1 });

      const latestMessages = [];
      for (const chat of chats) {
        const latestMessage = await Message.findOne({ chatID: chat._id })
          .sort({ createdAt: -1 })
          .limit(1);

        if (latestMessage) {
          latestMessages.push(latestMessage);
        }
      }

      const Chats = latestMessages.map((message) => {
        let otherUserName;
        chats.find((chat) => {
          if (chat._id === message.chatID) {
            otherUserName = chat.owners.find((owner) => {
              if (owner !== authenticatedUserId) return owner;
            });
          }
        });
        return {
          _id: message._doc._id,
          chatID: message._doc.chatID,
          sender: message._doc.sender,
          type: message._doc.type,
          message: message._doc.message,
          createdAt: message._doc.createdAt,
          otherUserName,
        };
      });

      res.status(200).json({
        status: "CHATS_FETCHED",
        data: {
          chats: Chats,
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

exports.deleteChat = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const chatID = req.body.chatID;
  const mainTask = async () => {
    await Chat.findByIdAndDelete(chatID);
    await Message.deleteMany({ chatID: chatID });
    io.getIO().to(chatID).emit("REFRESH_YOUR_CHATS", {});
    res.status(200).json({
      status: "CHAT_DELETED",
    });
    try {
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};

exports.clearChat = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const chatID = req.body.chatID;
  const mainTask = async () => {
    try {
      await Message.deleteMany({ chatID: chatID });
      const messageID = Math.floor(
        Math.random() * 100000000000000 + 1
      ).toString();
      const firstMessage = new Message({
        _id: messageID,
        chatID: chatID,
        sender: authenticatedUserId,
        type: "SYSTEM",
        message: "Chat cleared by " + authenticatedUserId + ".",
      });
      const message = await firstMessage.save();
      console.log(message);
      await Chat.findByIdAndUpdate(chatID, {
        $push: {
          messages: messageID,
        },
      });
      io.getIO().to(chatID).emit("REFRESH_YOUR_CHATS", {});
      io.getIO().to(chatID).emit("CHAT_CLEARED", [message]);
      res.status(200).json({
        status: "CHAT_CLEARED",
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

exports.getIndividualChat = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const chatID = req.params.chatID;
  const otherUserName = req.params.otherUserName;
  const mainTask = async () => {
    try {
      const fetchOtherUser = await User.findById(otherUserName);
      const otherFullName =
        fetchOtherUser.firstName + " " + fetchOtherUser.lastName;

      const messages = await Message.find({ chatID: chatID });

      res.status(200).json({
        status: "MESSAGES_FETCHED",
        data: {
          otherFullName,
          messages,
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

exports.sendImage = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const chatID = req.body.chatID;
  const chatImageID = req.body.chatImageID;
  let isReplying = req.body.isReplying;
  if (isReplying) {
    isReplying = JSON.parse(isReplying);
  }
  const chatImage = req.file.originalname;

  const mainTask = async () => {
    try {
      const data = {
        _id: chatImageID,
        chatID: chatID,
        sender: authenticatedUserId,
        type: "IMAGE",
        message: chatImage,
      };

      if (isReplying) {
        data["reply"] = isReplying;
      }
      console.log(data);
      const imageMessage = new Message(data);
      const sentImage = await imageMessage.save();
      await Chat.findByIdAndUpdate(chatID, {
        $push: {
          messages: chatImageID,
        },
      });

      io.getIO().to(chatID).emit("INCOMING_MESSAGE", sentImage);
      io.getIO().to(chatID).emit("REFRESH_YOUR_CHATS", {});

      res.status(200).json({
        status: "IMAGE_SENT",
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
