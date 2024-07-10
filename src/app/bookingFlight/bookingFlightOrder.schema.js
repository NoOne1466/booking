const mongoose = require("mongoose");

const orderFlightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  seatClass: {
    type: String,
    required: true,
  },
  priceInCents: { type: Number, required: true },
  isPaid: { type: Boolean, required: true, default: false },
  departureDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paidAt: { type: Date },
  refundedAt: { type: Date },
  orderId: { type: String },
  transactionId: { type: String },
});

const OrderFlight = mongoose.model("OrderFlight", orderFlightSchema);

module.exports = OrderFlight;
