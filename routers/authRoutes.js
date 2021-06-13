var express = require('express');
var router = express.Router();
const protect = require('../middlewares/protect');

const authController = require('../controllers/authController');

router.route('/login').post(authController.login);

router.route('/signup').post(authController.signup);

router.route('/updatePassword').patch(protect, authController.updatePassword);

// router
//   .route('/profile')
//   .get(userController.getProfile)
//   .delete(authController.deleteMe);

// router.post('/profile', userController.saveProfile);

module.exports = router;
