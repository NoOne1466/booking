const mongoose = require("mongoose");

const oneWayTicketSchema = new mongoose.Schema({
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
  // plane: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Plane",
  //   required: true,
  // },
  seatClass: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OneWayTicket = mongoose.model("OneWayTicket", oneWayTicketSchema);

module.exports = OneWayTicket;
