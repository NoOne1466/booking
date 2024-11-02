const OneWayTicket = require("./../bookingFlight/oneWayTicket.schema");
const RoundTripTicket = require("./../bookingFlight/roundTripTicket.schema");
const ReviewFlight = require("./reviewFlight.schema");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./../_common/handlerFactory");
const mongoose = require("mongoose");

const AppError = require("../utils/appError");

exports.getAllReviews = factory.getAll(ReviewFlight);
// exports.createNewReview = factory.createOne(ReviewFlight);
exports.deleteReview = factory.deleteOne(ReviewFlight);
exports.getReviewsForFlight = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const doc = await ReviewFlight.find({ flight: req.params.id });
  console.log(doc);
  res.status(201).json({
    status: "success",
    doc,
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { rating, review } = req.body;
  const userId = req.user.id;
  const ticketId = new mongoose.Types.ObjectId(req.body.ticketId);
  const id = new mongoose.Types.ObjectId("66f145f2aa5063bd2e1671e6");
  console.log(id);

  // Find the ticket
  let ticket = await RoundTripTicket.findOne({ _id: ticketId });
  // console.log(ticket.outboundFlight);
  // console.log(ticket.returnFlight);
  // If it's a round-trip ticket
  if (ticket) {
    // Create a review for the outbound flight
    const outboundReview = await ReviewFlight.create({
      review,
      rating,
      flight: id, //ticket.outboundFlight, // Assuming ticket has outboundFlight field
      user: req.user.id,
    });

    // Create a review for the return flight
    const returnReview = await ReviewFlight.create({
      review,
      rating,
      flight: ticket.returnFlight, // Assuming ticket has returnFlight field
      user: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: {
        outboundReview,
        returnReview,
      },
    });
  } else if (!ticket) {
    ticket = await OneWayTicket.findOne({ _id: ticketId, user: userId });
    if (ticket) {
      const flightReview = await ReviewFlight.create({
        review,
        rating,
        flight: ticket.flight,
        user: req.user.id,
      });
      res.status(201).json({
        status: "success",
        data: {
          flightReview,
        },
      });
    }
  } else {
    return next(new AppError("Ticket not found", 404));
  }
});

// ticket ==> 2 flights or 1 flight if 2 flights automatically add the 2 reviews
// exports.checkIfBookedFlight = catchAsync(async (req, res, next) => {
//   const userId = new mongoose.Types.ObjectId(req.user.id); // userId is saved in the user.id in the req
//   const ticketId = new mongoose.Types.ObjectId(req.body.ticketId);
//   console.log(userId, ticketId);

//   let ticketType = "";
//   let ticket = await oneWayTicket.findOne({ _id: ticketId, user: userId });
//   // console.log(ticket);

//   if (ticket) ticketType = "OneWayTicket";
//   console.log(ticketType);

//   if (!ticket) {
//     ticket = await roundTripTicket.findOne({ _id: ticketId, user: userId });

//     // console.log(ticket);
//     if (ticket) ticketType = "RoundTripTicket";
//   }
//   console.log(ticketType);

//   req.body.ticketType = ticketType;
//   req.body.user = userId;
//   if (!ticket) {
//     return next(
//       new AppError("You can only review a flight you have booked!", 400)
//     );
//   }

//   next();
// });
