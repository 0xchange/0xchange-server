var BigNumber = require('bignumber.js');
var db = require('../../shared/db.js');
var zeroEx = require('../../shared/zeroEx.js');

module.exports.getAll = function(req, res) {
  db.query('SELECT orderObj FROM orders').then((result) => {
    var ret = [];
    result.rows.forEach((element) => {
      ret.push(element.orderobj);
    });
    res.send(ret);
  }).catch((err) => {
    res.status(400).send('Failed to get orders');
  });
}

module.exports.getPage = function(req, res) {
  var opts = req.body;
  var asc = opts.asc ? 'ASC' : 'DESC';
  var queryPromise;
  if (opts.tokenAddress) {
    queryPromise = db.query(
      'SELECT orderObj FROM orders WHERE makerTokenAddress = $1 OR takerTokenAddress = $1 ORDER BY '+opts.sortBy+' '+asc+' LIMIT $2 OFFSET $3;',
      [
        opts.tokenAddress,
        opts.limit,
        parseInt(opts.page)*parseInt(opts.limit)
      ]
    )
  } else {
    queryPromise = db.query(
      'SELECT orderObj FROM orders ORDER BY '+opts.sortBy+' '+asc+' LIMIT $1 OFFSET $2;',
      [
        opts.limit,
        parseInt(opts.page)*parseInt(opts.limit)
      ]
    )
  }
  queryPromise.then((result) => {
    var ret = [];
    result.rows.forEach((element) => {
      ret.push(element.orderobj);
    })
    res.send(ret);
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
    return db.addOrder(order);
  }).then((result) => {
    res.sendStatus(200);
  }).catch((err) => {
    console.log(err);
    res.status(400).send('Failed to post order');
  });
}
