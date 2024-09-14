const express = require("express");
const hotelController = require("./hotels.controller");
const authController = require("./../midllewares/authController");

const router = express.Router();

router
  .route("/")
  .get(hotelController.getAllHotels)
  .post(
    authController.protect,
    authController.restrictToSuperAdmin,
    hotelController.createHotels
  );

router
  .route("/:id")
  .get(hotelController.getHotel)
  .patch(
    authController.protect,
    authController.restrictToSuperAdmin,
    hotelController.updateHotels
  )
  .delete(
    authController.protect,
    authController.restrictToSuperAdmin,
    hotelController.deleteHotels
  );

module.exports = router;
