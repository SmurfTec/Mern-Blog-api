const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({});

  if (!users) {
    return next(new AppError(`No user found `, 500));
  }

  res.status(200).json({
    status: 'success',
    userName: req.user.name,
    users,
    user: req.user,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id;

  next();
});

exports.getUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError(`No user found `, 404));
  }

  res.status(200).json({
    status: 'success',
    profile: user,
    userName: user.name,
    user: req.user,
  });
});

exports.getProfile = (req, res) => {
  res.status(200).json({
    status: 'success',
    userName: req.user.name,
    user: req.user,
  });
};

exports.saveProfile = catchAsync(async (req, res) => {
  // 1 Checking if Body Contains Name , Email and Bio
  const { name, email, bio } = req.body;
  // console.log(req.body);

  if (!name || !email || !bio) {
    return next(new AppError(` Plz Enter all Details to save profile `, 400));
  }

  //   2 Check if user exists
  const currentUser = await User.findOne({ email: req.user.email });

  if (!currentUser) {
    return next(
      new AppError(` No User Exists With this proile right Now `, 400)
    );
  }

  currentUser.name = name;
  currentUser.bio = bio;
  currentUser.email = email;
  await currentUser.save();

  req.user = currentUser;
  res.status(200).json({
    status: 'success',
  });
  // res.render('profile', { userName: req.user.name });
});

exports.changeAvatar = catchAsync(async (req, res) => {
  // console.log(req.file);
  // console.log(req.body.avatar);

  const currentUser = req.user;
  currentUser.image = req.file.filename;

  const updatedUser = await currentUser.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteAvatar = catchAsync(async (req, res) => {
  const currentUser = req.user;
  currentUser.image = 'avatar.png';

  const updatedUser = await currentUser.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});
