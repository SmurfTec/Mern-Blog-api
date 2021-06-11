var express = require('express');
var router = express.Router();

const categoriesController = require('../controllers/categoriesController');
const authController = require('../controllers/authController');


router.use(authController.protect);

router
  .route('/')
  .get(categoriesController.getAllCategories)
  .post(categoriesController.addCategory)
  .patch(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

router.get('/:id', categoriesController.getCategory);

module.exports = router;
