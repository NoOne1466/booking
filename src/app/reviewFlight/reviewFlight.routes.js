const express = require("express");
const authController = require("../midllewares/authController");

const flightReviewController = require("./reviewFlight.controller");
const ReviewFlight = require("./reviewFlight.schema");

const handlerFactory = require("./../_common/handlerFactory");

const router = express.Router();

router.use(authController.protect);

router.route("/").post(
  flightReviewController.createReview
  // handlerFactory.createOne(ReviewFlight)
);

module.exports = router;
