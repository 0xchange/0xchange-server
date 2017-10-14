var db = require('../../shared/db.js');
var zeroEx = require('../../shared/zeroEx.js');

module.exports.new = function(req, res) {
  var order = req.body;
  // TODO: Validate
  db.query(
    'INSERT INTO orders(orderObj, makerToken, takerToken) VALUES($1, $2, $3)',
    [order, order.makerTokenAddress, order.takerTokenAddress]
  ).catch((err) => {
    console.error(err);
  });
  res.sendStatus(200);
}
