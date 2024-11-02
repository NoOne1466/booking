const Contact = require("../models/contactModel");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const factory = require("./handlerFactory.js");

exports.getAllContacts = factory.getAll(Contact);
exports.createContact = factory.createOne(Contact);
