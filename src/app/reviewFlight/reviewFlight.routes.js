const express = require("express");
const authController = require("../midllewares/authController");

const flightReviewController = require("./reviewFlight.controller");
const ReviewFlight = require("./reviewFlight.schema");

const handlerFactory = require("./../_common/handlerFactory");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(flightReviewController.getAllReviews)
  .post(flightReviewController.createReview);

router
  .route("/:id")
  .get(flightReviewController.getReviewsForFlight)
  .delete(flightReviewController.deleteReview);

module.exports = router;
