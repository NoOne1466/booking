const express = require("express");
const flightController = require("./flight.controller");
const authController = require("./../midllewares/authController");

const router = express.Router();

// router.use(authController.protect);
router
  .route("/")
  .get(flightController.getAllFlight)
  .post(
    authController.protect,
    authController.restrictToSuperAdmin,
    flightController.createFlight
  );

router
  .route("/:id")
  .get(flightController.getFlight)
  .patch(
    authController.protect,
    authController.restrictToSuperAdmin,
    flightController.updateFlight
  )
  .delete(
    authController.protect,
    authController.restrictToSuperAdmin,
    flightController.deleteFlight
  );

module.exports = router;
