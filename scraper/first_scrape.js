// Run this to get 0x history and then start listening to 0x.

var filterEvent = require('./util/filterEvents.js');
var zeroEx = require('../shared/zeroEx.js');

zeroEx.exchange.getLogsAsync('LogFill', {fromBlock: 4219261, toBlock: 'latest'}, {}).then((result) => {
  result.forEach((element) => {
    if (filterEvent(element)) {
      // TODO: Write to DB
    };
  });
  require('./scraper.js');
}).catch((err) => {
  console.error(err);
});
