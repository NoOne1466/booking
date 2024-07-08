const express = require("express");
const bookingRoomOrderController = require("./bookingRoomOrder.controller");

const router = express.Router();
router.post("/", bookingRoomOrderController.bookRoom);

module.exports = router;
