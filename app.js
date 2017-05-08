/********** depend **************/

var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var events = require('events');
var http = require('http');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');

var _ = require('lodash');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var passport = require('passport');
var lusca = require('lusca');
var expressValidator = require('express-validator');



/********** Config **************/


var conf = require('./config/config');
var secure = require('./config/secure');
var passportConf = require('./config/passport');
var app = express();


/********** MongoDB **************/

mongoose.connect(secure.db);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error!');
  process.exit(1);
});



/********** app.engine **************/

app.set('port', process.env.PORT || 8383);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');
app.use(compress());



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

var homeController = require('./controllers/home_control');
var userController = require('./controllers/user_control');
var contactController = require('./controllers/contact_control');
var eventController = require('./controllers/event_control');
var entryController = require('./controllers/entry_control');
var apiController = require('./controllers/api_control');


/********** user routes **************/

router.get('/', homeController.index);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/user/:username', userController.getUserURL);

router.get('/logout', userController.logout);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);
router.get('/register', userController.getSignup);
router.post('/register', userController.postSignup);
router.get('/account', passportConf.isAuthenticated, userController.getAccount);
router.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
router.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
router.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
router.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


/********** event routes **************/

var eventRouter = require('./routes/event_route');
app.use('/event', eventRouter);

router.get('/event', eventController.getEvent);
router.get('/event/new', eventController.getEvent_new);
router.post('/event/new', passportConf.isAuthenticated, eventController.postEvent_new);

/********** entry routes **************/

var entryRouter = require('./routes/entry_route');
app.use('/entry', entryRouter);

router.get('/entry', entryController.getEntry);
router.get('/entry/new', entryController.getEntry_new);
router.post('/entry/new', passportConf.isAuthenticated, entryController.postEntry_new);


/********** static routes controllers **************/

router.get('/contact', contactController.getContact);
router.post('/contact', contactController.postContact);

router.get('/about', function(req, res) {
  res.render('pages/about', { title: 'About' });
});
router.get('/docs', function(req, res) {
  res.render('pages/docs', { title: 'Documentation' });
});
router.get('/privacy', function(req, res) {
  res.render('pages/privacy', { title: 'Privacy Policy' });
});
router.get('/terms', function(req, res) {
  res.render('pages/terms', { title: 'Terms & Conditions' });
});
router.get('/status', function(req, res) {
  res.render('pages/status', { title: 'System Status' });
});
router.get('/support', function(req, res) {
  res.render('pages/support', { title: 'Support' });
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

app.use(function handleNotFound(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url, error: '404 Not found' });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  };
});

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler())
};

if (process.env.NODE_ENV !== 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {
      message: err.message,
      error: {}
    });
  });
}



/********** app.listen **************/

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;