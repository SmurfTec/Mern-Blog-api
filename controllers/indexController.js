const catModel = require('./../models/categories');
const User = require('./../models/User');
const Post = require('./../models/postModel');
const catchAsync = require('./../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const cats = await catModel.find();
  const users = await User.find();
  const posts = await Post.find();

  const userName = req.user.name;
  // console.log(cats.length);

  res.status(200).json({
    status: 'success',
    categories: cats,
    users,
    posts,
    userName,
    user: req.User,
  });
});
