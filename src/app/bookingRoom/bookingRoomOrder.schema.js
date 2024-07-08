const mongoose = require("mongoose");

const orderRoomSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  priceInCents: { type: Number, required: true },
  isPaid: { type: Boolean, required: true, default: false },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
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

const OrderRoom = mongoose.model("OrderRoom", orderRoomSchema);

module.exports = OrderRoom;
