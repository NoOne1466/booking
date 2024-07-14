const express = require("express");
const planeController = require("./planes.controller");
const authController = require("./../midllewares/authController");
const router = express.Router();

router.use(
  authController.protect,
  authController.restrictTo("User"),
  authController.restrictToSuperAdmin
);

router
  .route("/")
  .get(planeController.getAllPlane)
  .post(planeController.createPlane);

router
  .route("/:id")
  .get(planeController.getPlane)
  .patch(planeController.updatePlane)
  .delete(planeController.deletePlane);

module.exports = router;
