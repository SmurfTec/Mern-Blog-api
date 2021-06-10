const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({});
  if (!users) {
    req.flash('message', 'No Users Yet !!!');
    return res.render('users', {
      message: req.flash('message'),
      user: req.user,
    });
  }

  res.render('users', { userName: req.user.name, users, user: req.user });
  // res.status(200).json({
  //    sucess: 'true',
  // });
});

exports.getUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    req.flash('message', 'No User Found !');
    return req.render('users', { message: req.flash('message') });
  }

  res.render('user', { profile: user, userName: user.name, user: req.user });
});

exports.getProfile = (req, res) => {
  res.render('profile', {
    userName: req.user.name,
    user: req.user,
    message: req.flash('message'),
    success: req.flash('success'),
    passError: req.flash('passError'),
  });
};

exports.saveProfile = catchAsync(async (req, res) => {
  // 1 Checking if Body Contains Name , Email and Bio
  const { name, email, bio } = req.body;
  // console.log(req.body);

  if (!name || !email || !bio) {
    req.flash('message', 'Plz Enter all Details to save profile');
    res.json({
      status: 'fail',
      message: 'InComplete Profile Credentials',
    });
  }

  //   2 Check if user exists
  const currentUser = await User.findOne({ email: req.user.email });

  if (!currentUser) {
    req.flash('message', 'No User Exists With this proile right Now');
    res.json({
      status: 'fail',
      message: 'InComplete Profile Credentials',
    });
  }

  //   Update User Details
  // console.log(currentUser);

  currentUser.name = name;
  currentUser.bio = bio;
  currentUser.email = email;
  await currentUser.save();

  req.user = currentUser;
  req.flash('success', 'Changes Saved');
  res.json({
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
