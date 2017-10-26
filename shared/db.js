// PostgreSQL Querier

var pad = require('pad');
var pg = require('pg');

var pool;

try {
  var config = require('../config.js').pg;
  if (!config) throw "OH NO!";
  pool = new pg.Pool(config);
  console.log('Using config.js');
} catch (err) {
  pool = new pg.Pool({
    database: 'zeroexchange'
  });
  console.log('Using PostgreSQL defaults (localhost).');
}


var query = module.exports.query = (text, params) => pool.query(text, params);


module.exports.addOrder = function(order) {
  return query(
    'SELECT orderObj FROM orders WHERE orderObj @> \'' +
    JSON.stringify({ecSignature: order.ecSignature})+'\''
  ).then((result) => {
    if (result.rows.length) { throw new Error('DUPLICATE_ORDER') }
    else return query(
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
        pad(64, order.makerFee.toString(16), '0'),
        order.makerTokenAddress,
        pad(64, order.makerTokenAmount.toString(16), '0'),
        pad(64, order.takerFee.toString(16), '0'),
        order.takerTokenAddress,
        pad(64, order.takerTokenAmount.toString(16), '0')
      ]
    );
  })
}
