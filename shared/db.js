// PostgreSQL Querier

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


module.exports.query = (text, params) => pool.query(text, params);
