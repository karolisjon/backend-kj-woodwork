const ProductModel = require('../models/product-model');
const {
  createNotFoundErr, 
  sendErrorResponse,
} = require('../helpers/errors/index');

const createIdDoesNotExistErr = (productId) => 
createNotFoundErr(`Product with id '${productId}' does not exist`);

const fetchAll = async (req, res) => {
  const { joinBy } = req.query;
  let productDocuments = await ProductModel.find();
  
  try {
    if (joinBy === 'categoryId') {
      productDocuments = await ProductModel.find().populate('categoryId');
    } else if (joinBy === 'woodTypeId') {
      productDocuments = await ProductModel.find().populate('woodTypeId');
    } else if (joinBy instanceof Array) {
      productDocuments = await ProductModel.find().populate('categoryId').populate('woodTypeId');
    } else await ProductModel.find();

    res.status(200).json(productDocuments);
  } catch (err) {sendErrorResponse(err, res);}
};

const fetch = async (req, res) => {
  const productId = req.params.id;
  const { joinBy } = req.query;
  let product = await ProductModel.findById(productId);

  try {

    if (joinBy === 'categoryId') {
      product = await ProductModel.findById(productId).populate('categoryId');
    } else if (joinBy === 'woodTypeId') {
      product = await ProductModel.findById(productId).populate('woodTypeId');
    } else if (joinBy instanceof Array) {
      product = await ProductModel.findById(productId).populate('categoryId').populate('woodTypeId');
    }

    if (product === null) throw createIdDoesNotExistErr(productId);

    res.status(200).json(product);

  } catch (err) {sendErrorResponse(err, res);}
};

const create = async (req, res) => {
  const newProductDetails = req.body;

  try {
    await ProductModel.validateData(newProductDetails)

    const newProduct = await ProductModel.create(newProductDetails);

    res.status(201).json(newProduct);

  } catch (err) {sendErrorResponse(err, res);}
};

const replace = async (req, res) => {
  const productId = req.params.id;
  const newProductDetails = req.body;

  try {
    await ProductModel.validateData(newProductDetails)

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      newProductDetails,
      { 
        new: true, 
        runValidators: true,
      }
    );

    if (updatedProduct === null) throw createIdDoesNotExistErr(productId);

    res.status(200).json(updatedProduct);

  } catch (err) {sendErrorResponse(err, res);}
};

const update = async (req, res) => {
  const productId = req.params.id;
  const { title, description, categoryId, price, img } = req.body;
  const newProductDetails = ({ title, description, categoryId, price, img });

  try {
    await ProductModel.validateUpdateData(newProductDetails);

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      newProductDetails,
      { new: true }
    );

    if (updatedProduct === null) throw createIdDoesNotExistErr(productId);

    res.status(200).json(updatedProduct)

  } catch (err) { sendErrorResponse(err, res); }
};

const remove = async (req, res) => {
  const productId = req.params.id;

  try {
    const removedProduct = await ProductModel.findByIdAndDelete(productId);

    if (removedProduct === null) throw createIdDoesNotExistErr(productId);

    res.status(200).json(removedProduct);
    
  } catch (err) {sendErrorResponse(err, res);}
};

module.exports = {
  fetchAll,
  fetch,
  create,
  replace,
  update,
  remove,
};
