const blog = require("./blog.schema.js");
const AppError = require("../utils/appError.js");
const factory = require("../_common/handlerFactory.js");
const catchAsync = require("../utils/catchAsync.js");

exports.getAllblogs = factory.getAll(blog);
exports.createblog = factory.createOne(blog);
