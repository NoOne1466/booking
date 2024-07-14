const express = require("express");
const flightController = require("./flight.controller");
const authController = require("./../midllewares/authController");

const router = express.Router();

router.use(authController.protect);
router
  .route("/")
  .get(flightController.getAllFlight)
  .post(authController.restrictToSuperAdmin, flightController.createFlight);

router
  .route("/:id")
  .get(flightController.getFlight)
  .patch(authController.restrictToSuperAdmin, flightController.updateFlight)
  .delete(authController.restrictToSuperAdmin, flightController.deleteFlight);

module.exports = router;
