const express = require("express");
const bookingRoomController = require("./bookingRoom.controller");

const router = express.Router();
router.post("/", bookingRoomController.bookRoom);

module.exports = router;
