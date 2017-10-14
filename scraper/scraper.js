// Listen to 0x

var filterEvent = require('./util/filterEvents.js');
var zeroEx = require('./util/zeroEx.js');

zeroEx.exchange.subscribeAsync('LogFill', {}, (evt) => {
  console.log('Event', evt);
  if (filterEvent(evt)) {
    // TODO: Write to DB
  }
}).then((result) => {
  console.log('Subscription token:', result);
}).catch((err) => {
  console.error(err);
});
