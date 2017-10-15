var db = require('../../shared/db.js');

module.exports.getAll = function(req, res) {
  db.query('SELECT * FROM tokens').then((result) => {
    var ret = [];
    result.rows.forEach((element) => {
      ret.push({
        address: element.address,
        symbol: element.symbol,
        name: element.token_name,
        decimals: element.decimals
      });
    });
    res.send(ret);
  }).catch((err) => {
    res.status(400).send('Failed to get orders');
  });
}

module.exports.new = function(req, res) {
  var token = req.body;
  db.query(
    `INSERT INTO tokens(
      address,
      symbol,
      token_name,
      decimals
    ) VALUES($1, $2, $3, $4)`,
    [
      token.address,
      token.symbol,
      token.name,
      token.decimals
    ]
  ).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    console.log(err);
    res.status(400).send('Failed to post token');
  });
}
