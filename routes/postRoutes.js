var express = require('express');
var router = express.Router();
;

const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');

router.use(authController.protect);

/* GET home page. */
router
  .route('/')
  .get(postsController.getAllPosts)
  .post(postsController.addNewPost);

router
  .route('/:id')
  .get(postsController.getPost)
  .delete(postsController.deletePost)
  .patch(postsController.updatePost);

router.route('/:id/like').patch(postsController.likePost);

router
  .route('/:id/comment')
  .post(postsController.commentPost);

router
  .route('/comments/:id')
  .delete(postsController.deleteComment)
  .patch(postsController.editComment);

module.exports = router;
