/*global require:true, __dirname:true */

var express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var events = require('events');
var http = require('http');
var path = require('path');
var logger = require('morgan');

var app = express();

var config = {
  development: require('./config/config-dev.js'),
  production: require('./config/config.js')
};
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');


var homeController = require('./controllers/home');
var userController = require('./controllers/user');

app.use(errorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'app')));
app.use(favicon(path.join(__dirname, 'app/img', 'favicon.ico')));

app.engine('.hbs', exphbs({ 
  defaultLayout: 'main', 
  extname: '.hbs',
  layoutsDir:'app/views/layouts',
  partialsDir:'app/views/partials'
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'app/views'));

app.get('/', homeController.index);
app.get('/login', userController.getLogin);


var logger = new events.EventEmitter();
logger.on('newEvent', function(event, data) {
  console.log('%s: %s', event, JSON.stringify(data));
});

app.listen(conf.port), function() {
  console.log('listening on port %d in %s mode', app.get('port'), app.get('env'));
}

module.exports = app;