const express = require("express");
const planeController = require("./planes.controller");

const router = express.Router();

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
