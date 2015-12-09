var express = require('express');
var app = express();
var router = express.Router();

var path = require('path');
var secure = require('../config/secure');
var passportConf = require('../config/passport');


/********** routes controllers **************/

var homeController = require('../controllers/home');
var userController = require('../controllers/user');
var contactController = require('../controllers/contact');
var apiController = require('../controllers/api');


/*************** routes *******************/

router.get('/', homeController.index);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);
router.get('/register', userController.getSignup);
router.post('/register', userController.postSignup);
router.get('/contact', contactController.getContact);
router.post('/contact', contactController.postContact);
router.get('/account', passportConf.isAuthenticated, userController.getAccount);
router.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
router.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
router.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
router.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


/********** oauth routes controllers **************/


/********** static routes controllers **************/

router.get('/about', function(req, res) {
  res.render('pages/about', { title: 'Privacy Policy' });
});
router.get('/privacy', function(req, res) {
  res.render('pages/privacy', { title: 'Privacy Policy' });
});
router.get('/terms', function(req, res) {
  res.render('pages/terms', { title: 'Terms & Conditions' });
});





module.exports = router