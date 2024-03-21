const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const mongoose = require("mongoose");
const path = require("path");

// MODELS
const Chat = require("./models/chats");
const Message = require("./models/messages");

const app = express();
app.use(bodyParser.json()); // used to parse json data from the incoming request

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", routes);

mongoose
  .connect(
    "mongodb+srv://thevarunbukka:E99Q3UmpbOGmkkVJ@cluster0.na0cfhn.mongodb.net/swoopchat?retryWrites=true&w=majority"
  )
  .then((result) => {
    const server = app.listen(4000, () => {
      console.log(`Server is running on http://localhost:${4000}`);
    });
    const io = require("./socket").initializeServer(server);
    io.on("connection", (socket) => {
      // BASIC
      console.log(`User Connected ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`User Disconnected ${socket.id}`);
      });
      socket.on("JOIN_INDIVIDUAL_CHAT", (chatID) => {
        socket.join(chatID);
        console.log("JOIN_INDIVIDUAL_CHAT");
      });

      socket.on("SEND_MESSAGE", (data) => {
        const authenticatedUserId = data.authenticatedUserId;
        const chatID = data.chatID;
        const message = data.message;
        const messageID = data.messageID;
        const isReplying = data.isReplying;

        const mainTask = async () => {
          try {
            const data = {
              _id: messageID,
              chatID: chatID,
              sender: authenticatedUserId,
              type: "MESSAGE",
              message: message,
            };

            if (isReplying) {
              data["reply"] = isReplying;
            }

            console.log(data);

            const newMessage = new Message(data);
            const sentMessage = await newMessage.save();

            await Chat.findByIdAndUpdate(chatID, {
              $push: {
                messages: messageID,
              },
            });

            io.to(chatID).emit("INCOMING_MESSAGE", sentMessage);
            io.to(chatID).emit("REFRESH_YOUR_CHATS", {});
          } catch (error) {
            console.log(error);
          }
        };
        mainTask();
      });

      socket.on("JOIN_ALL_CHATS", ({ authenticatedUserId }) => {
        const mainTask = async () => {
          try {
            const chats = await Chat.find({
              owners: authenticatedUserId,
            }).sort({ updatedAt: -1 });

            const allChats = [];

            for (const chat of chats) {
              allChats.push(chat._id);
            }
            socket.join(allChats);
            console.log("ALL CHATS JOINED", allChats);
          } catch (error) {
            console.log(error);
          }
        };
        mainTask();
      });

      socket.on("REFRESH_CHATS", ({ authenticatedUserId }) => {
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
            socket.emit("REFRESHED_CHATS", Chats);
          } catch (error) {
            console.log(error);
            res.status(400).json({
              status: "FAILED",
            });
          }
        };
        mainTask();
      });

      socket.on("DELETE_MESSAGE", (data) => {
        const authenticatedUserId = data.authenticatedUserId;
        const chatID = data.chatID;
        const messageID = data.messageID;

        const mainTask = async () => {
          try {
            await Chat.findByIdAndUpdate(chatID, {
              $pull: {
                messages: messageID,
              },
            });
            const isDeleted = await Message.deleteOne({
              _id: messageID,
              chatID: chatID,
              sender: authenticatedUserId,
            });
            if (isDeleted.deletedCount > 0) {
              io.to(chatID).emit("MESSAGE_IS_DELETED", { messageID });
              io.to(chatID).emit("REFRESH_YOUR_CHATS", {});
            }
          } catch (error) {
            console.log(error);
          }
        };
        mainTask();
      });

      socket.on("EDIT_MESSAGE", (data) => {
        const authenticatedUserId = data.authenticatedUserId;
        const chatID = data.chatID;
        const messageID = data.messageID;
        const editedMessage = data.editedMessage;
        const mainTask = async () => {
          try {
            await Message.findOneAndUpdate(
              { _id: messageID, chatID: chatID, sender: authenticatedUserId },
              { message: editedMessage }
            );
            const updatedMessage = await Message.findById(messageID);
            console.log("EDIED MESSAGE", updatedMessage);
            io.to(chatID).emit("MESSAGE_IS_EDITED", updatedMessage);
            io.to(chatID).emit("REFRESH_YOUR_CHATS", {});
          } catch (error) {
            console.log(error);
          }
        };
        mainTask();
      });
    });
  })
  .catch((err) => console.log(err));
