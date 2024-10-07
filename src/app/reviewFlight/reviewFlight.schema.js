const Flight = require("./../flights/flight.schema");
const mongoose = require("mongoose");

const reviewFlightSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // ticketId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    // ticketType: {
    //   type: String,
    //   enum: ["RoundTripTicket", "OneWayTicket"],
    //   required: true,
    // },
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// reviewFlightSchema.pre(/^find/, function (next) {
//   if (this.ticketType === "RoundTripTicket") {
//     this.populate("ticketId", "RoundTripTicket");
//   } else if (this.ticketType === "OneWayTicket") {
//     this.populate("ticketId", "OneWayTicket");
//   }
//   next();
// });

// reviewFlightSchema.index({ user: 1, flight: 1 }, { unique: true }); // glitched so had to do it in compass

reviewFlightSchema.statics.calcAverageRatings = async function (flightId) {
  const stats = await this.aggregate([
    {
      $match: { flight: flightId },
    },
    {
      $group: {
        _id: "$flight",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(".....");
  console.log(stats);

  if (stats.length > 0) {
    await Flight.findByIdAndUpdate(flightId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Flight.findByIdAndUpdate(flightId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewFlightSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.flight);
});

reviewFlightSchema.post(/^findOneAnd/, async function (doc) {
  if (doc && doc.constructor.calcAverageRatings) {
    await doc.constructor.calcAverageRatings(doc.flight._id);
  }
});

const ReviewFlight = mongoose.model("ReviewFlight", reviewFlightSchema);

module.exports = ReviewFlight;
