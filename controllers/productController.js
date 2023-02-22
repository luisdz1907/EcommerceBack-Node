const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { json } = require("body-parser");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const {id} = req.params;

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updateProduct = await Product.findOneAndUpdate(id , req.body, {
      new: true,
    });
    res.json(updateProduct)
  } catch (error) {
    throw new Error(error);
  }
});

const daleteProduct = asyncHandler(async (req, res) => {
  const {id} = req.params;
  try {

    const deleteProduct = await Product.findByIdAndDelete(id)
    
    res.json(deleteProduct)
  } catch (error) {
    throw new Error(error);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {

    const queryObj = {...req.query}
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach((item) => delete queryObj[item])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${ match }`)
    console.log(JSON.parse(queryStr))

    const getAllProduct = await Product.find(queryObj)
    res.json(getAllProduct);


  } catch (error) {
    throw new Error(error);
  }
});
const base = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  daleteProduct
};
