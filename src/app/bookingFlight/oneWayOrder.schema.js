const mongoose = require("mongoose");

const orderOneWaytSchema = new mongoose.Schema({
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
    enum: ["economy", "business", "firstClass"],
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  priceInCents: { type: Number, required: true },
  isPaid: { type: Boolean, required: true, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paidAt: { type: Date },
  refundedAt: { type: Date },
  orderId: { type: String },
  transactionId: { type: String },
});

const oneWayOrder = mongoose.model("OneWayOrder", orderOneWaytSchema);

module.exports = oneWayOrder;
