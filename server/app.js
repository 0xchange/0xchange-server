var bodyParser = require('body-parser');
var cors = require('cors');
var CronJob = require('cron').CronJob;
var express = require('express');

var app = express();


app.use(bodyParser.json()); // for parsing application/json
app.use(cors());


// API Router
app.use('/', require('./router.js'));


// Configure server and start listening.
app.listen(3000, function() {
  console.log('Express server listening on port 3000.');
});


new CronJob({
  cronTime: '00 */5 * * * *',
  onTick: require('./scripts/purgeExpiredOrders.js'),
  start: true
});
