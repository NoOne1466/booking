const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.files);
    cb(null, "src/app/_common/img");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.model.id}-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image, please upload only images", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadPhoto = upload.single("photo");
exports.uploadImage = upload.single("image");

exports.uploadArrayOfPhotos = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 20 },
]);

exports.resizeImages = (Model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.files);
    // console.log("id", req.params.id);
    const doc = await Model.findById(req.params.id);
    const { images } = doc;
    // console.log("images");
    // console.log(images);

    req.body.images = images;
    // console.log(req.body);

    // console.log(req.files.images);
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `user-${req.model.id}-${Date.now()}-${i + 1}.jpeg`;
        // console.log(filename);
        // console.log("buffer", file);
        const buffer = await fs.promises.readFile(file.path);

        await sharp(buffer)
          .resize(500, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`src/app/_common/img/${filename}`);
        // console.log("in loop", req.body);
        req.body.images.push(filename);
      })
    );
    // console.log("ended", req.body);
    next();
  });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // if (calculateRatings) {
    //   await calculateRatings(doc.hospital);
    // }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const filteredBody = filterObj(
      req.body,
      "firstName",
      "lastName",
      "email",
      "dateOfBirth",
      "phoneNumber",
      "gender",
      "type",
      "price",
      "totalRooms",
      "availableRooms",
      "description",
      "image",
      "images"
    );
    // if (req.file) req.body.image = `img/${req.file.filename}`;

    // console.log("body", req.body);
    const doc = await Model.findByIdAndUpdate(req.params.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // req.body.user = req.model.id;
    console.log("body", req.body);

    if (req.file) req.body.photo = `img/${req.file.filename}`;

    console.log("file", req.file);
    const doc = await Model.create(req.body);
    console.log("body after ", req.body);

    // console.log(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    let doc = await query;
    // console.log(doc);
    // Handle special case for Flight model to populate reviews
    if (Model.modelName == "Flight") {
      // console.log("flight");

      doc = await doc.populate({
        path: "reviews",
        select: "review rating user",
        populate: {
          path: "user",
          select: "name",
        },
      });
    }

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on doc or user (hack)

    let filter = {};
    // if (req.params.doctorId) filter = { doctor: req.params.doctorId };
    // if (req.params.userId) filter = { user: req.params.userId };
    if (req.body.hospital) {
      filter.hospital = req.body.hospital;
    }
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.getMe = (req, res, next) => {
  console.log(req.userModel);
  if (req.userModel === "User") {
    console.log(req.userModel);
    req.params.id = req.user.id;
    // userModel;
    next();
  }
  // if (req.userModel === "Doctor") {
  //   console.log(req.userModel);
  //   req.params.id = req.doctor.id;
  //   next();
  // }
};

exports.updateMe = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    if (req.body.password || req.body.passwordConfirm) {
      // 1) Create error if user POSTs pass word data
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(
      req.body,
      "firstName",
      "lastName",
      "email",
      "dateOfBirth",
      "phoneNumber",
      "gender"
    );
    if (req.file) filteredBody.photo = `img/${req.file.filename}`;

    // 3) Update user document
    // console.log(req.model);

    const updatedUser = await Model.findByIdAndUpdate(
      req.model.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      return next(
        new AppError(
          "The logged in user does not have permision for this route"
        )
      );
    }
    // console.log(updatedUser);

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  });

exports.deleteMe = (Model) =>
  catchAsync(async (req, res, next) => {
    const user = await Model.findByIdAndUpdate(req.model.id, { active: false });
    if (!user) {
      return next(
        new AppError(
          "The logged in user does not have permision for this route"
        )
      );
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// exports.homePage = (req, res) => {
//   res.send("Welcome to the homepage!");
// };
