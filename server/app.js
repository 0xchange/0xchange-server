var bodyParser = require('body-parser');
var express = require('express');

var app = express();


app.use(bodyParser.json()); // for parsing application/json


// API Router
app.use('/', require('./router.js'));


// Configure server and start listening.
app.listen(3000, function() {
  console.log('Express server listening on port 3000.');
});
