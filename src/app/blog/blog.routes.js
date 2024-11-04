const express = require("express");
const blogController = require("./blog.controller");
const authController = require("../midllewares/authController");
const Blog = require("./blog.schema");
const handlerFactory = require("./../_common/handlerFactory");

const router = express.Router();

router
  .route("/")
  .get(blogController.getAllblogs)
  .post(
    handlerFactory.uploadPhoto,
    handlerFactory.resizeImages(Blog),
    blogController.createblog
  );

module.exports = router;