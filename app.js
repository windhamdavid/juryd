var express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var events = require('events');
var http = require('http');
var path = require('path');
var logger = require('morgan');


var app = express();

var config = {
  development: require('./config/config-dev.js'),
  production: require('./config/config.js')
};

var app = express(),
    server = http.createServer(app);
    server.listen(conf.port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'app')));


var logger = new events.EventEmitter();
logger.on('newEvent', function(event, data) {
  console.log('%s: %s', event, JSON.stringify(data));
});

