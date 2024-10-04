
const express = require("express");
const router = express.Router();
const { imageUpload } = require("../utils/Upload");
const presenterControllers = require("../controllers/presenterControllers");

router.post("/getPresenter", presenterControllers.getPresenter);
router.post(
  "/getPresenterByConfrenceId",
  presenterControllers.getPresenterByConfrenceId
);
router.post("/getPresenterByUserId", presenterControllers.getPresenterByUserId);
router.post(
  "/getPresenterByConfrenceIdAndUserId",
  presenterControllers.getPresenterByConfrenceIdAndUserId
);
router.post(
  "/getPresenterByUserIdAndConfrenceId",
  presenterControllers.getPresenterByUserIdAndConfrenceId
);
router.post(
  "/getPresenterByConfrenceIdAndRole",
  presenterControllers.getPresenterByConfrenceIdAndRole
);
router.post(
  "/getPresenterByUserIdAndRole",
  presenterControllers.getPresenterByUserIdAndRole
);
router.post(
  "/getPresenterByConfrenceIdAndRoleAndUserId",
  presenterControllers.getPresenterByConfrenceIdAndRoleAndUserId
);
router.post(
  "/getPresenterByUserIdAndRoleAndConfrenceId",
  presenterControllers.getPresenterByUserIdAndRoleAndConfrenceId
);

router.post(
  "/registerPresenter",
  imageUpload.single("profileImage"),
  presenterControllers.registerPresenter
);

module.exports = router;
