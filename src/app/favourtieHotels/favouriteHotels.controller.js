const FavoriteHotel = require("./favouriteHotels.schema.js"); // Ensure you create this model
const AppError = require("./../utils/appError.js");
const factory = require("./../_common/handlerFactory.js");
const catchAsync = require("./../utils/catchAsync.js");

exports.getAllFavoritesHotels = factory.getAll(FavoriteHotel);

const toFavoriteFunction = async (
  res,
  user,
  toFavorite,
  Model,
  modelType,
  next
) => {
  try {
    let query = { user: user };

    if (modelType === "hotel") {
      query.hotel = toFavorite;
    }

    // Check if the hotel is already in favorites
    const existingFavorite = await Model.findOne(query);

    if (existingFavorite) {
      return next(
        new AppError(`This ${modelType} is already in favorites`, 400)
      );
    }

    // Add the hotel to favorites
    const favorite = await Model.create(query);

    res.status(201).json({ status: "success", data: favorite });
  } catch (error) {
    return next(new AppError(`We encountered an error ${error.message}`, 404));
  }
};

exports.addToFavorites = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  if (req.body.hotelId) {
    const { hotelId } = req.body;
    await toFavoriteFunction(
      res,
      userId,
      hotelId,
      FavoriteHotel,
      "hotel",
      next
    );
    return;
  }
  return next(new AppError("No valid favorite type provided", 400));
});

exports.removeFromFavorites = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  if (req.body.hotelId) {
    // Remove the hotel from favorites
    await FavoriteHotel.findOneAndDelete({
      user: userId,
      hotel: req.body.hotelId,
    });
  }

  // Send the success response
  res.status(200).json({
    status: "success",
    data: "has been removed from favorites",
  });
});
