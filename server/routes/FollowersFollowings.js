const express = require("express");
const followersFollowingsControllers = require("../controllers/FollowersFollowings");
const router = express.Router();
const auth = require("../auth");

router.post("/", auth, followersFollowingsControllers.getFollowersFollowings);
router.post("/follow", auth, followersFollowingsControllers.follow);
router.post("/un-follow", auth, followersFollowingsControllers.unfollow);
router.post("/remove", auth, followersFollowingsControllers.remove);

module.exports = router;
