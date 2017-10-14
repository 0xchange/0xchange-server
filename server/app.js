var express = require('express');

var app = express();


// API Router
app.get('/', require('./router.js'));


// Send index.html when users load website.
app.get('*', function(req, res) {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});


// Configure server and start listening.
app.listen(3000, function() {
  console.log('Express server listening on port 3000.');
});
