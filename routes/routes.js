var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var secure = require('../config/secure');
var passportConf = require('../config/passport');

app.use(express.static(path.join(__dirname, './app'), { maxAge: 31557600000 }));


/********** routes controllers **************/

var homeController = require('../controllers/home');
var staticController = require('../controllers/static');
var userController = require('../controllers/user');
var contactController = require('../controllers/contact');
var apiController = require('../controllers/api');


router.get('/', homeController.index);
router.get('/terms', staticController.static);

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


/********** static routes controllers **************/


app.get('/privacy', function(req, res) {
  res.render('pages/privacy', {
    title: 'Privacy Policy'
  });
});


/********** oauth routes controllers **************/


module.exports = router