const express = require("express");
const activityControllers = require("../controllers/Activity");
const router = express.Router();
const auth = require("../auth");

const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/moments/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.get("/feed", auth, activityControllers.getFeed);
router.post(
  "/share-moment",
  auth,
  multer({
    storage: fileStorage,
  }).single("momentImage"),
  activityControllers.shareMoment
);

// router.post("/delete", auth, notificationsControllers.deleteNotification);

module.exports = router;
