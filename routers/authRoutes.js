var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

router.route('/login').post(authController.login);

router.route('/signup').post(authController.signup);

// router.route('/confirmMail/:activationLink').get(authController.confirmMail);

// router.route('/forgotPassword').post(authController.forgotPassword);

// router.route('/resetPassword/:resetToken');

// router.route('/resetPassword/:resetToken');

// router.route('/updatePassword').patch(authController.updatePassword);

// router
//   .route('/profile')
//   .get(userController.getProfile)
//   .delete(authController.deleteMe);

// router.post('/profile', userController.saveProfile);

module.exports = router;
