const CatModel = require('./../models/categories');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await CatModel.find();

  if (!categories) return next(new AppError(' No category found '), 500);

  res.status(200).json({
    status: 'success',
    categories: categories,
    user: req.user,
  });
});

exports.addCategory = catchAsync(async (req, res, next) => {
  // Check if Title and Summary Exists in req.body
  const { title, summary } = req.body;

  const newCategory = await CatModel.create({
    title,
    summary,
  });

  res.status(201).json({
    status: 'success',
    category: newCategory,
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const category = await CatModel.findById(id);

  if (!category) return next(new AppError(' No category found '), 500);

  res.status(200).json({
    status: 'success',
    category: category,
    user: req.user,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const id = req.body.id;

  if (!id) return next(new AppError(' plz select category to update '), 400);

  const category = await CatModel.findById(id);
  if (!category) return next(new AppError(' No category found '), 500);

  const updatedCat = await CatModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    updatedCat: updatedCat,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.body.id;

  if (!id) return next(new AppError(' plz select category to delete '), 400);

  const deleteCategory = await CatModel.findByIdAndDelete(id);

  if (!deleteCategory)
    return next(
      new AppError(`No category found against id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    category: deleteCategory,
  });
});
