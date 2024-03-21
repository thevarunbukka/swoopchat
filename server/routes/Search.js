const express = require("express");
const searchControllers = require("../controllers/Search");
const router = express.Router();
const auth = require("../auth");

router.get("/load-history", auth, searchControllers.loadHistory);
router.post("/push", auth, searchControllers.push);
router.post("/pull", auth, searchControllers.pull);
router.post("/", auth, searchControllers.search);

module.exports = router;
