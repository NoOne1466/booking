const express = require("express");
const User = require("./user.schema");
const userController = require("./user.controller");
const authController = require("./../midllewares/authController");
const router = express.Router();
const factory = require("./../_common/handlerFactory");
const favouriteController = require("./../favourtieHotels/favouriteHotels.controller");
router.get("/", userController.getAllUsers);

router.post("/signup", authController.signup(User));
router.post("/login", authController.login(User));
router.post("/forgotPassword", authController.forgotPassword(User));
router.patch("/resetPassword", authController.resetPassword(User));

router.use(authController.protect);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMyPassword", authController.updatePassword(User));
router.patch("/udpateMe", factory.uploadPhoto, userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(
    authController.protect,
    authController.restrictToSuperAdmin,
    userController.createUser
  );

// router.use("/:userId/reviews", reviewUsersRouter);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    authController.restrictToSuperAdmin,
    userController.createUser,
    userController.updateUser
  )
  .delete(
    authController.restrictToSuperAdmin,
    userController.createUser,
    userController.deleteUser
  );

/// favs

// Favorites routes
router
  .route("/favourites/hotels")
  .get(favouriteController.getAllFavoritesHotels);

router
  .route("/favourites/add-hotel-to-favorites")
  .post(favouriteController.addToFavorites);

router
  .route("/favourites/remove-hotel-from-favorites")
  .delete(favouriteController.removeFromFavorites);

module.exports = router;
