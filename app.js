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
var logger = require('morgan');

var _ = require('lodash');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var passport = require('passport');
var lusca = require('lusca');
var expressValidator = require('express-validator');


/********** config **************/

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



/********** app controllers **************/

var homeController = require('./controllers/home');
var userController = require('./controllers/user');

app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/register', userController.getSignup);
app.post('/register', userController.postSignup);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

//app.get('/contact', contactController.getContact);
//app.post('/contact', contactController.postContact);

/************* log **************/

var logger = new events.EventEmitter();
logger.on('newEvent', function(event, data) {
  console.log('%s: %s', event, JSON.stringify(data));
});


/************* errors **************/

app.use(errorHandler());


/********** app.listen **************/

app.listen(conf.port), function() {
  console.log('listening on port %d in %s mode', app.get('port'), app.get('env'));
}

module.exports = app;