const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const roomTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["single", "double", "suite", "deluxe"],
  },
  price: {
    type: Number,
    required: true,
  },
  totalRooms: {
    type: Number,
    required: true,
  },
  availableRooms: {
    type: Number,
    required: true,
  },
});

const hotelsSchema = new mongoose.Schema(
  {
    image: {
      type: [String],
      default: "hotel.png",
    },
    country: String,
    address: String,
    description: String,
    room: [roomTypeSchema],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Hotel = mongoose.model("Hotel", hotelsSchema);

module.exports = Hotel;
