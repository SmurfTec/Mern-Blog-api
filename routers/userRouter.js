var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const protect = require('../middlewares/protect');

router.use(protect);

/* GET home page. */
router.get('/', userController.getAllUsers);
router.get('/me', userController.getMe, userController.getUser);

// router.get('/:id', userController.getUser);

module.exports = router;
