var express = require('express');
var router = express.Router();

const categoriesController = require('../controllers/categoriesController');
const protect = require('../middlewares/protect');

router.use(protect);

router
  .route('/')
  .get(categoriesController.getAllCategories)
  .post(categoriesController.addCategory)
  .patch(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

router.get('/:id', categoriesController.getCategory);

module.exports = router;
