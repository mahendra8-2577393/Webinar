
const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/adminControllers");

router.post("/listAllUsers", adminControllers.listAllUsers);
router.patch("/verifyPresenter", adminControllers.verifyPresenter);
router.post("/createConfrence", adminControllers.createConfrence);
router.patch("/updateConfrence", adminControllers.updateConfrence);
router.delete("/deleteConfrence", adminControllers.deleteConfrence);
router.patch("/verifyAllPresenter", adminControllers.verifyAllPresenter);
router.delete("/deletePresenter", adminControllers.deletePresenter);

module.exports = router;
