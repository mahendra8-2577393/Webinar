

const express = require("express");
const router = express.Router();
const { imageUpload } = require("../utils/Upload");
const audienceControllers = require("../controllers/audienceController");

router.post(
  "/registerAudience",
  imageUpload.single("profileImage"),
  audienceControllers.registerAudience
);

module.exports = router;
