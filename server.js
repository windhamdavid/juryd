var build = require('./build');
var express = require('express');
var app = express();

var config = require('./env.json')[process.env.NODE_ENV || 'development'];

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   
}
app.use(express.static(__dirname + '/build'));

app.listen(process.env.PORT, function(){
  console.log('Server running at http://localhost:' + process.env.PORT + '');
});

