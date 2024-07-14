const express = require("express");
const hotelController = require("./hotels.controller");
const authController = require("./../midllewares/authController");

const router = express.Router();

router.use(authController.protect);
router
  .route("/")
  .get(hotelController.getAllHotels)
  .post(authController.restrictToSuperAdmin, hotelController.createHotels);

router
  .route("/:id")
  .get(hotelController.getHotel)
  .patch(authController.restrictToSuperAdmin, hotelController.updateHotels)
  .delete(authController.restrictToSuperAdmin, hotelController.deleteHotels);

module.exports = router;
