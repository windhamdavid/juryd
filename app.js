/********** depend **************/

var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var events = require('events');
var http = require('http');
var path = require('path');
var FileStreamRotator = require('file-stream-rotator')
var fs = require('fs')
var logger = require('morgan');

var _ = require('lodash');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var passport = require('passport');
var lusca = require('lusca');
var expressValidator = require('express-validator');



/********** Config **************/

var app = express();

var config = {
  development: require('./config/config-dev.js'),
  production: require('./config/config.js')
};
var secure = require('./config/secure');
var passportConf = require('./config/passport');



/********** MongoDB **************/

mongoose.connect(secure.db);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error!');
  process.exit(1);
});



/********** app.engine **************/

app.engine('.hbs', exphbs({ 
  defaultLayout: 'main', 
  extname: '.hbs',
  layoutsDir:'app/views/layouts',
  partialsDir:'app/views/partials'
}));
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'app/views'));




/********** app.use **************/

app.use(express.static(path.join(__dirname, 'app'), { maxAge: 31557600000 }));
app.use(favicon(path.join(__dirname, 'app/img', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secure.sessionSecret,
  store: new MongoStore({ url: secure.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});



/********** routes controllers **************/

var router = express.Router();
app.use(router);
require('./routes/routes');

var homeController = require('./controllers/home');
var staticController = require('./controllers/static');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var apiController = require('./controllers/api');


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




/************* log **************/


app.use(logger('common', {
    stream: fs.createWriteStream('./log/access.log', {flags: 'a'})
}));
app.use(logger('dev'));


var logger = new events.EventEmitter();
logger.on('newEvent', function(event, data) {
  console.log('%s: %s', event, JSON.stringify(data));
});



/************* errors **************/


if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler())
};



/********** app.listen **************/

app.listen(conf.port), function() {
  console.log('listening on port %d in %s mode', app.get('port'), app.get('env'));
}

module.exports = app;