// PostgreSQL Querier

var pg = require('pg');

var pool;

try {
  pool = new pg.Pool(require('../config.js').pg);
  console.log('Using config.js');
} catch (err) {
  pool = new pg.Pool({
    database: 'zeroexchange'
  });
  console.log('Using PostgreSQL defaults (localhost).');
}


module.exports.query = (text, params) => pool.query(text, params);
