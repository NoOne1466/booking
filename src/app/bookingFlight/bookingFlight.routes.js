const flightController = require("./bookingFlight.controller");
const authController = require("./../midllewares/authController");
const express = require("express");

const router = express.Router();

router.use(authController.protect);
router.post("/", flightController.createTicket);
router.post("/refund", flightController.refund);
router.get("/mytickets", flightController.getAllTicketsForCurrentUser);

router.get("/", flightController.getAllTickets);

module.exports = router;
