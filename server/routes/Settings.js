const express = require("express");
const settingsControllers = require("../controllers/Settings");
const router = express.Router();
const auth = require("../auth");

router.get("/", auth, settingsControllers.loadSettings);
router.get(
  "/clear-search-history/",
  auth,
  settingsControllers.clearSearchHistory
);
router.get("/liked/", auth, settingsControllers.liked);
router.get("/saved/", auth, settingsControllers.saved);
router.get(
  "/saved-or-liked-memories/:what",
  auth,
  settingsControllers.savedOrLikedMemories
);
router.post(
  "/change-email/request-verification-code/",
  auth,
  settingsControllers.changeEmailRequestVerificationCode
);
router.post(
  "/change-email/validate-verification-code/",
  auth,
  settingsControllers.changeEmailValidateVerificationCode
);
router.post(
  "/change-email/resend-verification-code/",
  auth,
  settingsControllers.changeEmailResendVerificationCode
);
router.get(
  "/toggle-account-privacy/",
  auth,
  settingsControllers.toggleAccountPrivacy
);
router.post(
  "/change-chat-lock-passcode/",
  auth,
  settingsControllers.changeChatLockPasscode
);
router.get("/moments/", auth, settingsControllers.getMoments);
router.delete("/moments/:momentID/", auth, settingsControllers.deleteMoment);
router.patch(
  "/moments/:momentID/",
  auth,
  settingsControllers.addMomentToProfile
);
module.exports = router;
