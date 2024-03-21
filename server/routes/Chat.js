const express = require("express");
const chatControllers = require("../controllers/Chat");
const router = express.Router();
const auth = require("../auth");
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/chats/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.get("/", auth, chatControllers.getChats);
router.post(
  "/send-image",
  auth,
  multer({
    storage: fileStorage,
  }).single("chatImage"),
  chatControllers.sendImage
);
router.get("/:chatID/:otherUserName", auth, chatControllers.getIndividualChat);
router.post("/create-new", auth, chatControllers.createNew);
router.delete("/", auth, chatControllers.deleteChat);
router.patch("/", auth, chatControllers.clearChat);

module.exports = router;
