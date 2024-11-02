const express = require("express");
const contactController = require("./contact.controller");
const authController = require("./../midllewares/authController");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("User"),
    authController.restrictTo("Doctor"),
    authController.restrictToSuperAdmin,
    contactController.getAllContacts
  )
  .post(contactController.createContact);

module.exports = router;
