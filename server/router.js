var express = require('express');

// Get API implementation.
var api = require('./api');

// Set up router.
var router = express.Router();

router.get('/order', api.order.getAll);
router.post('/order', api.order.getPage);
router.post('/order/new', api.order.new);

router.get('/token', api.token.getAll);
router.post('/token/new', api.token.new);

module.exports = router;
