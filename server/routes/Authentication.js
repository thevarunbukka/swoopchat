const express = require("express");
const authenticationControllers = require("../controllers/Authentication");
const router = express.Router();

const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/profiles/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.post(
  "/request-verification-code",
  authenticationControllers.requestVerificationCode
);
router.post(
  "/resend-verification-code",
  authenticationControllers.resendVerificationCode
);
router.post(
  "/verify-verification-code",
  authenticationControllers.verifyVerificationCode
);
router.post(
  "/finish-account-setup",
  multer({
    storage: fileStorage,
  }).single("profileImage"),
  authenticationControllers.finishAccountSetup
);
router.post("/verify-username", authenticationControllers.verifyUserName);
module.exports = router;
