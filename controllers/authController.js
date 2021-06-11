

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedOut', {
    // expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.redirect('/login');
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);

  // Delete / Privatize all posts related to this user
  const posts = await Post.deleteMany({
    user,
  });

  // Delete / deactivate User
  user.active = false;

  await user.save({ runValidators: false });

  //  Clear all cookies for jwt
  res.cookie('jwt', 'loggedOut', {
    // expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.json({
    status: 'success',
  });
});



