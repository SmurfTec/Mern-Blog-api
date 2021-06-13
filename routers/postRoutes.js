var express = require('express');
var router = express.Router();

const postsController = require('../controllers/postsController');
const protect = require('../middlewares/protect');

router.use(protect);

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

router.route('/:id/comment').post(postsController.commentPost);

router
  .route('/comments/:id')
  .delete(postsController.deleteComment)
  .patch(postsController.editComment);

module.exports = router;
