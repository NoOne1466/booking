const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotels",
    required: true,
  },
  roomType: {
    type: String,
    required: true,
    enum: ["single", "double", "suite", "deluxe"],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
