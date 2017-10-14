// Listen to 0x

var zeroEx = require('util/zeroEx.js');

zeroEx.exchange.subscribeAsync('LogFill', {}).then((result) => {
  // Filter & write to DB
}).catch((err) => {
  console.error(err);
});
