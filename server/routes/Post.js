const express = require("express");
const postControllers = require("../controllers/Post");
const router = express.Router();
const auth = require("../auth");

const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/memories/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.get("/", auth, postControllers.getPeople);
router.post(
  "/memory",
  auth,
  multer({
    storage: fileStorage,
  }).single("memoryImage"),
  postControllers.postMemory
);
router.post("/thought", auth, postControllers.postThought);
router.post("/like", auth, postControllers.likePost);
router.post("/save", auth, postControllers.savePost);
router.post("/delete", auth, postControllers.deletePost);
router.post("/comment", auth, postControllers.commentOnPost);
router.post("/reply-to-comment", auth, postControllers.replyToCommentOnPost);
router.get("/get-comments/:postID", auth, postControllers.getComments);
router.post("/share", auth, postControllers.sharePost);
module.exports = router;
