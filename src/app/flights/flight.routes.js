const express = require("express");
const flightController = require("./flight.controller");

const router = express.Router();

router
  .route("/")
  .get(flightController.getAllFlight)
  .post(flightController.createFlight);

router
  .route("/:id")
  .get(flightController.getFlight)
  .patch(flightController.updateFlight)
  .delete(flightController.deleteFlight);

module.exports = router;
