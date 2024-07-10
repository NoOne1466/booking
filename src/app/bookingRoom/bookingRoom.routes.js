const express = require("express");
const bookingRoomController = require("./bookingRoom.controller");
const authController = require("../midllewares/authController");
const webhookController = require("../_common/webhookController");

const router = express.Router();
router.route("/webhook").post(webhookController.webhook);

router.use(authController.protect);
router.post("/", bookingRoomController.bookRoom);

module.exports = router;
