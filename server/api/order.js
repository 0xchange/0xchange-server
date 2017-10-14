var db = require('../../shared/db.js');
var zeroEx = require('../../shared/zeroEx.js');

module.exports.new = function(req, res) {
  var order = req.body;
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
        order.makerFee,
        order.makerTokenAddress,
        order.makerTokenAmount,
        order.takerFee,
        order.takerTokenAddress,
        order.takerTokenAmount
      ]
    );
  }).then((result) => {
    res.sendStatus(200);
  }).catch((err) => {
    console.log(err);
    res.status(400).send('Failed to post order');
  });
}
