const mongoose = require("mongoose");

const roundTripTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  outboundFlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  returnFlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  // plane: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Plane",
  //   required: true,
  // },
  seatClass: {
    type: String,
    required: true,
  },
  outboundDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const RoundTripTicket = mongoose.model(
  "RoundTripTicket",
  roundTripTicketSchema
);

module.exports = RoundTripTicket;
