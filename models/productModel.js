const mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  slug: {
    type: String,
    lowercae: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required:true
  },
  sold: {
    type: Number,
    default: 0
  },
  images: {
    type: Array,
  },
  color: {
    type: String,
    required: true,
  },
  ratings: {
    star: Number,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
},{timestamps: true});

//Export the model
module.exports = mongoose.model("Product", productSchema);
