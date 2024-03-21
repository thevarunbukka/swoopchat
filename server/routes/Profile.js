const express = require("express");
const profileControllers = require("../controllers/Profile");
const router = express.Router();
const auth = require("../auth");

router.get("/my/", auth, profileControllers.myProfile);
router.get("/others/:usernameToFetch", auth, profileControllers.othersProfile);
router.get("/memories/:usernameToFetch", auth, profileControllers.getMemories);
router.get(
  "/thought/:thoughtID/:updateViews",
  auth,
  profileControllers.getThought
);
router.get(
  "/others/send-follow-request",
  auth,
  profileControllers.othersProfileSendFollowRequest
);
router.get(
  "/my/remove-moment-from-profile/:momentID",
  auth,
  profileControllers.removeMomentFromProfile
);
module.exports = router;
