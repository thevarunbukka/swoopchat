const express = require("express");
const editProfileControllers = require("../controllers/EditProfile");
const router = express.Router();
const auth = require("../auth");

const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/profiles/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.get("/", auth, editProfileControllers.loadEditProfile);
router.post("/", auth, editProfileControllers.editProfile);
router.post(
  "/picture/",
  auth,
  multer({
    storage: fileStorage,
  }).single("profileImage"),
  editProfileControllers.editProfilePicture
);
module.exports = router;
