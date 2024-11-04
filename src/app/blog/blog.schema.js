// models/contactModel.js

const mongoose = require("mongoose");
const validator = require("validator");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  photo: {
    type: String,
    required: [true, "Please provide a photo"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
