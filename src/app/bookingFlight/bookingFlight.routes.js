const flightController = require("./bookingFlight.controller");
const authController = require("./../midllewares/authController");
const express = require("express");

const router = express.Router();

router.use(authController.protect);
router.post("/", flightController.createTicket);

module.exports = router;
