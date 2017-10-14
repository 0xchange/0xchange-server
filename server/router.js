var express = require('express');

// Get API implementation.
var api = require('./api');

// Set up router.
var router = express.Router();

router.get('/get', api.order.getAll);
router.post('/get', api.order.getPage);

//router.get('/get/:token', _);

router.post('/post/order/', api.order.new);

//router.post('/post/token/:token', _);

module.exports = router;
