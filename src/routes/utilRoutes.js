
const express = require("express");
const router = express.Router();

const utilControllers = require("../controllers/utilController");

router.get("/getAllConfrences", utilControllers.getAllConfrences);
router.get("/getConfrencesId/:confrenceId", utilControllers.getConfrencesId);
router.post("/getConfrenceByUserId", utilControllers.getConfrenceByUserId);
router.post("/filterConfrences", utilControllers.filterConfrences);
router.post("/searchConfrences", utilControllers.searchConfrences);

module.exports = router;
