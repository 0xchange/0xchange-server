var BigNumber = require('bignumber.js');
var db = require('../../shared/db.js');
var zeroEx = require('../../shared/zeroEx.js');

module.exports.getAll = function(req, res) {
  db.query('SELECT * FROM orders').then((result) => {
    res.send(result.rows);
  }).catch((err) => {
    res.status(400).send('Failed to get orders');
  });
}

module.exports.getPage = function(req, res) {
  var opts = req.body.opts;
  var asc = opts.asc ? 'ASC' : 'DESC';
  db.query(
    'SELECT orderObj FROM orders ORDER BY '+opts.sortBy+' '+asc+' LIMIT $1 OFFSET $2;',
    [
      opts.limit,
      parseInt(opts.page)*parseInt(opts.limit)
    ]
  ).then((result) => {
    res.send(result.rows);
  }).catch((err) => {
    console.error(err);
    res.status(400).send('Failed to get orders');
  });
}

module.exports.new = function(req, res) {
  var order = req.body;
  order.expirationUnixTimestampSec = new BigNumber(order.expirationUnixTimestampSec);
  order.makerFee = new BigNumber(order.makerFee);
  order.makerTokenAmount = new BigNumber(order.makerTokenAmount);
  order.salt = new BigNumber(order.salt);
  order.takerFee = new BigNumber(order.takerFee);
  order.takerTokenAmount = new BigNumber(order.takerTokenAmount);
  zeroEx.exchange.validateOrderFillableOrThrowAsync(order).then(() => {
    return db.query(
      `INSERT INTO orders(
        orderObj,
        makerFee,
        makerTokenAddress,
        makerTokenAmount,
        takerFee,
        takerTokenAddress,
        takerTokenAmount
      ) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [
        order,
        order.makerFee.toString(16),
        order.makerTokenAddress,
        order.makerTokenAmount.toString(16),
        order.takerFee.toString(16),
        order.takerTokenAddress,
        order.takerTokenAmount.toString(16)
      ]
    );
  }).then((result) => {
    res.sendStatus(200);
  }).catch((err) => {
    console.log(err);
    res.status(400).send('Failed to post order');
  });
}
