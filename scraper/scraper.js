// Listen to 0x

var filterEvent = require('./util/filterEvents.js');
var zeroEx = require('./util/zeroEx.js');

zeroEx.exchange.subscribeAsync('LogFill', (evt) => {
}).then((result) => {
  if (filterEvent(result)) {
    // TODO: Write to DB
  }
}).catch((err) => {
  console.error(err);
});
