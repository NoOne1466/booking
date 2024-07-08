const express = require("express");
const Hotels = require("./Hotels.schema");
const userController = require("./user.controller");
const authController = require("./../midllewares/authController");

const router = express.Router();

router
  .route("/")
  .get(hotelController.getAllHotels)
  .post(hotelController.createHotels);

router
  .route("/:id")
  .get(hotelController.getHotel)
  .patch(hotelController.updateHotels)
  .delete(hotelController.deleteHotels);

module.exports = router;
