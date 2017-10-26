var Promise = require('bluebird');
var db = require('../../shared/db.js');

module.exports = function () {
  console.log('Running purge...');
  var promises = [];
  db.query('SELECT orderObj FROM orders').then((result) => {
    result.rows.forEach((element) => {
      var expiration = parseInt(element.orderobj.expirationUnixTimestampSec);
      if (expiration < Date.now()/1000) {
        promises.push(db.query(
          'DELETE FROM orders WHERE orderObj = $1',
          [element.orderobj]
        ));
      }
    });
  }).then(() => {
    return Promise.all(promises);
  }).then(() => {
    console.log('Purge complete!');
  }).catch((err) => {
    console.error(err);
  })
}
