var build = require('./build');
var express = require('express');
var app = express();

//var config = require('./config.json')[process.env.NODE_ENV || 'development'];

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   //Changed for Express 4
}



app.use(express.static(__dirname + '/build'));

var port = process.env.PORT || 3000;

app.listen(process.env.PORT, function(){
  console.log('running at http://localhost:' + process.env.PORT + '');
});

