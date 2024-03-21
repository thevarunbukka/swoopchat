const express = require("express");
const notificationsControllers = require("../controllers/Notifications");
const router = express.Router();
const auth = require("../auth");

router.get("/", auth, notificationsControllers.getNotification);
router.post("/delete", auth, notificationsControllers.deleteNotification);
router.post(
  "/accept-follow-request",
  auth,
  notificationsControllers.acceptFollowRequest
);
router.post(
  "/reject-follow-request",
  auth,
  notificationsControllers.rejectFollowRequest
);

module.exports = router;
