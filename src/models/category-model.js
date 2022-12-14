const { Schema, model } = require('mongoose');
const yup = require('yup');

const categorySchema = Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const categoryValidationSchema = yup.object().shape({
  title: yup
    .string('category.title must always be a string')
    .required('category.title is mandatory'),
  image: yup
    .string('category.image must always be a string')
    .required('category.image is mandatory'),
});

const categoryUpdateValidationSchema = yup.object().shape({
  title: yup.string().typeError('category.title must always be a string'),
  image: yup.string().typeError('category.image must always be a string')
});

categorySchema.statics.validateData = (categoryData) => 
categoryValidationSchema.validate(categoryData);

categorySchema.statics.validateUpdateData = (categoryData) => 
categoryUpdateValidationSchema.validate(categoryData);

const CategoryModel = model('Category', categorySchema);

module.exports = CategoryModel;
