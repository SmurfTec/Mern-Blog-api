// const { s, pro } = require('./../app.js');
const socket = require('socket.io');

const Post = require('./../models/postModel');
const CatModel = require('./../models/categories');
const Like = require('./../models/likes');
const Comment = require('./../models/commentModel');
// const User = require('./../models/User');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

let io = {};
// const { server, Pie } = require('./../app');
// app.good();
// app.bad();
// console.log(app.good);
// console.log('app.io', app.server);
// const io = socket(app.server);
// console.log('appp is', s, pro);
function filter(value, object) {
  object = object.filter((el) => {
    el.category.title = el.category.title.toLowerCase();
    // console.log(el.category.title);

    return el.category.title.includes(`${value.toLowerCase()}`);
  });
  // console.log(object.length);
  return object;
}

exports.getAllPosts = catchAsync(async (req, res) => {
  let query = Post.find();

  // API Features
  const features = new APIFeatures(query, req.query).sort().filterByDate();

  const categories = await CatModel.find({});
  // console.log('app', app);
  let posts = await features.query;

  // Filtering by Category
  if (req.query.cat) {
    posts = filter(req.query.cat, posts);
  }

  // Filtering by post search filter
  if (req.query.pos) {
    const { pos } = req.query;

    posts = posts.filter((el) => {
      return el.title.toLowerCase().includes(`${pos.toLowerCase()}`);
    });
  }

  // Filter by owner of post
  if (req.query.postBy) {
    let postUsers = JSON.stringify(req.query.postBy);
    postUsers = postUsers.split(',');
    // console.log(postUsers);
    // Posts by me
    // console.log(postUsers[0]);

    if (postUsers[0] == '"me"' || postUsers[1] == '"me"') {
      posts = posts.filter((el) => {
        // console.log('el.id');
        // console.log(el.user._id);
        // console.log('req.user.id');
        // console.log(req.user.id);

        return el.user._id == req.user.id;
      });
    } else {
      posts = posts.filter((el) => {
        // console.log('el.id');
        // console.log(el.user._id);
        // console.log('req.user.id');
        // console.log(req.user.id);

        return el.user._id != req.user.id;
      });
    }
  }

  res.status(200).json({
    userName: req.user.name,
    posts,
    categories,
    user: req.user,
  });
});

exports.addNewPost = catchAsync(async (req, res) => {
  console.log(`req.body`, req.body);
  // Get Category Id
  const CatId = await CatModel.findOne({
    title: req.body.category,
  }).select('_id title');

  //  Add New Post
  const Newpost = await Post.create({
    title: req.body.title,
    category: CatId,
    body: req.body.body,
    user: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    post: Newpost,
  });
});
exports.getPost = catchAsync(async (req, res, next) => {
  // 1 Getting post

  console.log(`user is ${req.user.email} in 127`);

  const categories = await CatModel.find({});

  console.log(`req.params.id 131`, req.params.id);
  const post = await Post.findById(req.params.id)
    .populate({
      path: 'comments',
      select: 'body -post date',
    })
    .exec();
  // .execPopulate();

  if (!post) {
    return next(
      new AppError(
        ' the post you are trying to access is either deleted or is private !! '
      ),
      500
    );
  }

  // 2 Getting total Likes of the post
  console.log(req.params.id);
  const likes = await Like.find({
    post: req.params.id,
    like: true,
  });

  const likesTotal = likes.length;

  console.log('total likes are', likesTotal);

  // 3 Getting like info about the post by this user
  const like = await Like.findOne({
    post,
    user: req.user,
  });

  // 4 Getting Comments about this post
  const comments = await Comment.find({
    post,
  }).select('-post');

  if (!like) {
    console.log('no like');

    return res.status(202).json({
      post,
      userName: req.user.name,
      like: false,
      likes: likesTotal,
      comments,
      user: req.user,
      categories,
    });
  } else {
    return res.status(200).json({
      user: req.user,
      post,
      userName: req.user.name,
      like: like.like,
      likes: likesTotal,
      comments,
      categories,
    });
  }
});

exports.likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  const postId = post._id;

  console.log('post id is', postId);

  // Check if like already exists then
  const like = await Like.findOne({
    user: req.user,
    post,
  });

  // If like exist then unlike it ,
  if (like) {
    console.log('like exist .....unliking');
    like.like = like.like === true ? false : true;

    await like.save({ validateBeforeSave: 'false' });

    console.log('after unlike now like is', like.like);
    // false -> unlike
  } else {
    console.log('like not exists');
    const newLike = await Like.create({
      user: req.user.id,
      post: postId,
    });

    if (!newLike) {
      return res.status(200).json({
        status: 'success',
      });
    }
  }
  const postLikes = await Like.find({
    post,
    like: true,
  });

  if (like) {
    liking = like.like;
  } else {
    liking = true;
  }

  res.status(200).json({
    status: 'success',
    postLikes,
    like: liking,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  // Checking if user who is deleting post is the one who made post
  const post = await Post.findOne({
    user: req.user,
  });

  if (!post)
    return next(new AppError(`You Don't have Power to delete this post`, 403));

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
  });
});

exports.commentPost = catchAsync(async (req, res, nxt) => {
  const id = req.params.id;

  const post = await Post.findById(id);
  const user = req.user;

  const postComments = await Comment.find({
    post,
  });

  const newComment = await Comment.create({
    user,
    post,
    body: req.body.comment,
  });

  if (!newComment) {
    return res.json({
      status: 'fail',
    });
  }

  // I want to broadcast here
  // console.log('io is', io);

  res.status(200).json({
    status: 'success',
    comment: newComment,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  await Comment.findByIdAndDelete(req.params.id);
  const { postId } = req.body;
  console.log(req.body);

  res.status(200).json({
    status: 'success',
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  console.log(`req.body`, req.body);
  const { id } = req.params;
  const { title, body } = req.body;

  if (!title || !body) {
    return next(new AppError(`Plz Provide Title and BOdy with request`, 400));
  }

  const post = await Post.findByIdAndUpdate(id, req.body);

  // const post = await Post.findById(id);
  // if (!post) return next(new AppError(`No Post found against id ${id}`, 404));

  // post.title = title;
  // post.body = body;

  // await post.save();
  console.log(`post`, post);
  res.status(200).json({ status: 'success ', data: { post } });
});

exports.editComment = catchAsync(async (req, res, next) => {
  const { commentBody } = req.body;
  const { id } = req.params;

  if (!id || !commentBody)
    return res.status(400).json({
      status: 'failed',
      msg: 'Plz provide all details in Req ',
    });

  const comment = await Comment.findById(id);
  if (!comment)
    return res.status(404).json({
      status: 'failed',
      msg: `No Comment Found Against id ${id}`,
    });

  comment.body = commentBody;
  await comment.save();

  res.status(200).json({
    status: 'success',
    comment,
  });
});
