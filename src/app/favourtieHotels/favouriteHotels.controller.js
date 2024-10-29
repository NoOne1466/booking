const FavoriteHotel = require("./favouriteHotels.schema.js"); // Ensure you create this model
const AppError = require("./../utils/appError.js");
const factory = require("./../_common/handlerFactory.js");
const catchAsync = require("./../utils/catchAsync.js");

exports.getAllFavoritesHotels = factory.getAll(FavoriteHotel);

exports.getAllFavoritesHotelsForCurrentUser = catchAsync(
  async (req, res, next) => {
    console.log(req.userModel);
    query = {
      user: req.user._id,
    };
    const doc = await FavoriteHotel.find(query);
    console.log(doc);
    res.status(200).json({
      status: "success",
      doc,
    });
  }
);
const toFavoriteFunction = async (
  res,
  user,
  toFavorite,
  Model,
  modelType,
  next
) => {
  try {
    console.log("res:", res);
    console.log("user:", user);
    console.log("toFavorite:", toFavorite);
    console.log("Model:", Model);
    console.log("modelType:", modelType);

    let query = { user: user };
    if (modelType === "hotel") {
      query.hotel = toFavorite;
    } else if (modelType === "flight") {
      query.flight = toFavorite;
    }

    // Check if the toFavorite is already in favoritess
    const existingFavorite = await Model.findOne(query);
    console.log(existingFavorite);

    if (existingFavorite) {
      return next(
        new AppError(`This ${modelType} is already in favorites`, 400)
      );
    }

    // Add the doctor to favorites
    console.log(query);
    const favorite = await Model.create(query);

    res.status(201).json({ status: "success", data: favorite });
  } catch (error) {
    return next(new AppError(`We encountered an error ${error.message}`, 404));
  }
};

exports.addToFavorites = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  console.log(req.body.hotelId);
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
