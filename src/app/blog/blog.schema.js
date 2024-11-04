// models/contactModel.js

const mongoose = require("mongoose");
const validator = require("validator");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide your first name"],
  },
  description: {
    type: String,
    required: [true, "Please provide your last name"],
  },
  image: {
    type: String,
    required: [true, "Please provide a message"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
