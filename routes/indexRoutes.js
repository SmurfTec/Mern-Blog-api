var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const viewController = require('../controllers/viewController');


router
  .route('/login')
  .get(viewController.login)
  .post(authController.login);

router
  .route('/signup')
  .get(viewController.signup)
  .post(authController.signUp);

router
  .route('/confirmMail/:activationLink')
  .get(authController.confirmMail);
// .get(viewController.confirmMail)

// router
//   .get('/logout',
//    authController.logout);


router
  .route('/forgotPassword')
  .get(viewController.forgotPassword)
  .post(authController.forgotPassword);

router
  .route('/resetPassword/:resetToken')
  .get(viewController.resetPassword);

router
  .route('/resetPassword/:resetToken')
  .patch(authController.resetPassword);

router.use('/', authController.protect);
/* GET home page. */

router
  .route('/updatePassword')
  .patch(authController.updatePassword);

router
  .route('/profile')
  .get(userController.getProfile)
  .delete(authController.deleteMe);

router.post('/profile',userController.saveProfile);

// router.route('avatar').post()
router.get('/', indexController);

module.exports = router;
