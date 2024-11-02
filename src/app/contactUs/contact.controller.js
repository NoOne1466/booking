const Contact = require("./contact.schema.js");
const AppError = require("./../utils/appError.js");
const factory = require("./../_common/handlerFactory.js");
const catchAsync = require("./../utils/catchAsync.js");

exports.getAllContacts = factory.getAll(Contact);
exports.createContact = factory.createOne(Contact);
