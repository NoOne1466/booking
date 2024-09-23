const mongoose = require("mongoose");

const favoriteHotelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Favorite must belong to a user"],
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: "Hotel",
    required: [true, "Favorite must belong to a hotel"],
  },
});

const FavoriteHotel = mongoose.model("FavoriteHotel", favoriteHotelSchema);

module.exports = FavoriteHotel;
